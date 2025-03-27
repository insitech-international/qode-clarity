"""
File management and processing for Qode Clarity.
This module handles reading files and importing them into Firestore.
"""
import os
import re
import logging
import asyncio
from typing import List, Dict, Optional, Any, Tuple, Set
from enum import Enum
from datetime import datetime

# Firebase/Firestore imports
from firebase_admin import firestore

# Local imports
from qode_clarity_fastapi.app.firebase_client import get_firestore_client
from qode_clarity_fastapi.app.schemas import QuestionSchema, SolutionSchema
from qode_clarity_fastapi.settings import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BankType(Enum):
    """Enum for different types of content banks"""
    QUESTION = 'question_bank'
    SOLUTION = 'solution_bank'

class FileManager:
    """Handles all file operations"""
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    @staticmethod
    def extract_id_from_filename(filename: str) -> int:
        """Extract the numeric ID from a filename."""
        try:
            match = re.search(r'^(\d+)', filename)
            return int(match.group(1)) if match else 0
        except (AttributeError, ValueError) as e:
            logger.error(f"Error extracting ID from filename {filename}: {str(e)}")
            return 0

    def read_file(self, file_path: str) -> str:
        """Read content from a file with proper error handling."""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except FileNotFoundError:
            self.logger.error(f"File not found: {file_path}")
            raise
        except IOError as e:
            self.logger.error(f"IO error reading file {file_path}: {str(e)}")
            raise

    def parse_markdown_sections(self, content: str) -> Dict[str, str]:
        """Parse markdown content into sections."""
        sections = {}
        current_section = None
        section_content = []

        for line in content.split('\n'):
            if line.startswith('# '):
                if current_section:
                    sections[current_section] = '\n'.join(section_content).strip()
                current_section = line[2:].lower().replace(' ', '_')
                section_content = []
            else:
                section_content.append(line)

        if current_section:
            sections[current_section] = '\n'.join(section_content).strip()

        return sections

    def parse_metadata(self, content: str) -> Dict[str, Any]:
        """Parse metadata from content with improved error handling."""
        metadata = {}
        list_fields = {'similar_questions', 'real_life_domains', 'tags'}
        
        try:
            for line in content.split('\n'):
                if line.strip().startswith('-'):
                    try:
                        key_value = line.strip('- ').split(':', 1)
                        if len(key_value) != 2:
                            continue
                            
                        key, value = map(str.strip, key_value)
                        key = key.strip('**').lower().replace(' ', '_')
                        
                        if not value.strip():
                            continue
                            
                        if key in list_fields:
                            metadata[key] = [item.strip() for item in value.split(',') if item.strip()]
                        else:
                            metadata[key] = value.strip()
                    except Exception as e:
                        self.logger.warning(f"Error parsing metadata line '{line}': {str(e)}")
                        continue
                        
            return metadata
        except Exception as e:
            self.logger.error(f"Error parsing metadata: {str(e)}")
            return metadata

class FirestoreManager:
    """Manages Firestore operations"""
    def __init__(self):
        self.db = get_firestore_client()
        self.logger = logging.getLogger(__name__)

    def upsert_document(self, collection: str, document_id: str, data: Dict) -> None:
        """Upsert a document in Firestore."""
        try:
            doc_ref = self.db.collection(collection).document(document_id)
            
            # Add timestamps
            data['updatedAt'] = firestore.SERVER_TIMESTAMP
            
            # Check if document exists for createdAt field
            doc = doc_ref.get()
            if not doc.exists:
                data['createdAt'] = firestore.SERVER_TIMESTAMP
                
            # Update or create document
            doc_ref.set(data)
            
            self.logger.debug(f"Upserted document {document_id} in {collection}")
            
        except Exception as e:
            self.logger.error(f"Error upserting document {document_id} in {collection}: {str(e)}")
            raise

    async def get_categories(self) -> List[str]:
        """Get all categories from Firestore."""
        try:
            categories_ref = self.db.collection('categories')
            docs = categories_ref.stream()
            
            categories = []
            for doc in docs:
                data = doc.to_dict()
                if 'name' in data and data['name']:
                    categories.append(data['name'])
                    
            return sorted(categories)
            
        except Exception as e:
            self.logger.error(f"Error getting categories: {str(e)}")
            raise

class QuestionManager:
    """Manages question and solution processing"""
    def __init__(self, firestore_manager: FirestoreManager, file_manager: FileManager, base_dir: str):
        self.firestore_manager = firestore_manager
        self.file_manager = file_manager
        self.base_dir = base_dir
        self.logger = logging.getLogger(__name__)

    def _find_file(self, question_id: int, bank_type: BankType) -> Optional[str]:
        """Find the file path for a given question ID and bank type."""
        try:
            data_dir = os.path.join(self.base_dir, 'qode_clarity_fastapi', 'data', bank_type.value)
            
            for root, _, files in os.walk(data_dir):
                for file in files:
                    if (file.endswith('.md') and 
                        self.file_manager.extract_id_from_filename(file) == question_id):
                        return os.path.join(root, file)
            
            self.logger.warning(f"No {bank_type.value} file found for ID: {question_id}")
            return None
            
        except Exception as e:
            self.logger.error(f"Error finding file for ID {question_id} in {bank_type.value}: {str(e)}")
            return None

    async def process_question(self, question_id: int, force_update: bool = False) -> Optional[Dict]:
        """Process a question and update Firestore."""
        try:
            question_file = self._find_file(question_id, BankType.QUESTION)
            if not question_file:
                return None

            content = self.file_manager.read_file(question_file)
            sections = self.file_manager.parse_markdown_sections(content)
            metadata = self.file_manager.parse_metadata(content)
            
            # Get category path from file location
            category_path = os.path.relpath(
                os.path.dirname(question_file), 
                os.path.join(self.base_dir, 'qode_clarity_fastapi', 'data', BankType.QUESTION.value)
            )
            if category_path == '.':
                category_path = ''
                
            # Create question data
            question_data = {
                'questionId': question_id,
                'content': content,
                'title': metadata.get('title', ''),
                'category': metadata.get('category', ''),
                'categoryPath': category_path,
                'subcategory': metadata.get('subcategory', ''),
                'difficulty': metadata.get('difficulty', ''),
                'tags': metadata.get('tags', []),
                'similarQuestions': metadata.get('similar_questions', []),
                'realLifeDomains': metadata.get('real_life_domains', []),
                'problemDescription': sections.get('problem_description', ''),
                'problemVersions': sections.get('versions', '').splitlines(),
                'constraints': sections.get('constraints', '').splitlines(),
                'notes': sections.get('notes', '').splitlines()
            }
            
            if force_update or await self._should_update_question(question_id, content):
                self.firestore_manager.upsert_document('questions', str(question_id), question_data)
                
            return question_data
            
        except Exception as e:
            self.logger.error(f"Error processing question {question_id}: {str(e)}")
            return None

    async def process_solution(self, question_id: int, force_update: bool = False) -> Optional[Dict]:
        """Process a solution and update Firestore."""
        try:
            solution_file = self._find_file(question_id, BankType.SOLUTION)
            if not solution_file:
                return None

            content = self.file_manager.read_file(solution_file)
            sections = self.file_manager.parse_markdown_sections(content)
            metadata = self.file_manager.parse_metadata(content)
            
            # Get category path from file location
            category_path = os.path.relpath(
                os.path.dirname(solution_file), 
                os.path.join(self.base_dir, 'qode_clarity_fastapi', 'data', BankType.SOLUTION.value)
            )
            if category_path == '.':
                category_path = ''
            
            # Create solution data
            solution_data = {
                'questionId': question_id,
                'content': content,
                'title': metadata.get('title', ''),
                'category': metadata.get('category', ''),
                'categoryPath': category_path,
                'subcategory': metadata.get('subcategory', ''),
                'difficulty': metadata.get('difficulty', ''),
                'tags': metadata.get('tags', []),
                'similarQuestions': metadata.get('similar_questions', []),
                'realLifeDomains': metadata.get('real_life_domains', []),
                'approach': sections.get('approach', ''),
                'code': sections.get('code', ''),
                'explanation': sections.get('explanation', ''),
                'classificationRationale': sections.get('classification_rationale', ''),
                'introduction': sections.get('introduction', ''),
                'mathematicalAbstraction': sections.get('mathematical_abstraction', ''),
                'pythonicImplementation': sections.get('pythonic_implementation', ''),
                'solveFramework': sections.get('solve_framework', ''),  # Updated from bucesr_framework
                'complexityAnalysis': sections.get('complexity_analysis', ''),
                'realWorldAnalogies': sections.get('real_world_analogies', ''),
                'storytellingApproach': sections.get('storytelling_approach', ''),
                'visualRepresentation': sections.get('visual_representation', '')
            }
            
            if force_update or await self._should_update_solution(question_id, content):
                self.firestore_manager.upsert_document('solutions', str(question_id), solution_data)
                
            return solution_data
            
        except Exception as e:
            self.logger.error(f"Error processing solution {question_id}: {str(e)}")
            return None

    async def process_category(self, category_path: str, question_count: int = 0) -> Optional[Dict]:
        """Process a category and update Firestore."""
        try:
            # Create category from path
            parts = category_path.split(os.path.sep)
            category_name = ' '.join(part.replace('_', ' ') for part in parts)
            
            category_data = {
                'name': category_name,
                'path': category_path,
                'questionCount': question_count,
                'parentPath': os.path.dirname(category_path) if '/' in category_path else '',
                'level': len(parts)
            }
            
            # Generate an ID from the path
            category_id = category_path.replace('/', '_').replace(' ', '_').lower()
            if not category_id:
                category_id = 'root'
                
            # Store in Firestore
            self.firestore_manager.upsert_document('categories', category_id, category_data)
            
            return category_data
            
        except Exception as e:
            self.logger.error(f"Error processing category {category_path}: {str(e)}")
            return None

    async def _should_update_question(self, question_id: int, content: str) -> bool:
        """Check if question needs to be updated in Firestore."""
        try:
            doc_ref = self.firestore_manager.db.collection('questions').document(str(question_id))
            doc = doc_ref.get()
            
            if not doc.exists:
                return True
                
            existing = doc.to_dict()
            return existing.get('content') != content
            
        except Exception as e:
            self.logger.error(f"Error checking if question {question_id} needs update: {str(e)}")
            return True  # Default to update on error

    async def _should_update_solution(self, question_id: int, content: str) -> bool:
        """Check if solution needs to be updated in Firestore."""
        try:
            doc_ref = self.firestore_manager.db.collection('solutions').document(str(question_id))
            doc = doc_ref.get()
            
            if not doc.exists:
                return True
                
            existing = doc.to_dict()
            return existing.get('content') != content
            
        except Exception as e:
            self.logger.error(f"Error checking if solution {question_id} needs update: {str(e)}")
            return True  # Default to update on error

def validate_pairs(question_files: List[str], solution_files: List[str]) -> None:
    """Validate that each question has a corresponding solution and vice versa."""
    try:
        # Extract question IDs from filenames
        question_ids = {FileManager.extract_id_from_filename(os.path.basename(f)) for f in question_files}
        solution_ids = {FileManager.extract_id_from_filename(os.path.basename(f)) for f in solution_files}
        
        # Find missing pairs
        missing_solutions = question_ids - solution_ids
        missing_questions = solution_ids - question_ids
        
        # Log missing pairs
        if missing_solutions:
            logger.warning(f"Found {len(missing_solutions)} questions without solutions: {missing_solutions}")
            
        if missing_questions:
            logger.warning(f"Found {len(missing_questions)} solutions without questions: {missing_questions}")
            
    except Exception as e:
        logger.error(f"Error during pair validation: {str(e)}")
        raise

async def update_database(base_dir: str) -> None:
    """Update Firestore with questions, solutions, and categories from files."""
    try:
        # Initialize managers
        file_manager = FileManager()
        firestore_manager = FirestoreManager()
        question_manager = QuestionManager(firestore_manager, file_manager, base_dir)

        # Verify data directory exists
        data_dir = os.path.join(base_dir, 'qode_clarity_fastapi', 'data')
        if not os.path.exists(data_dir):
            raise FileNotFoundError(f"Data directory does not exist: {data_dir}")

        # Initialize file lists and category tracker
        question_files = []
        solution_files = []
        category_paths = set()
        
        # Find all markdown files and track categories
        for bank_type in BankType:
            bank_dir = os.path.join(data_dir, bank_type.value)
            if os.path.exists(bank_dir):
                for root, _, files in os.walk(bank_dir):
                    # Get category path relative to bank directory
                    rel_path = os.path.relpath(root, bank_dir)
                    if rel_path != '.':
                        category_paths.add(rel_path)
                    
                    # Process files
                    for file in files:
                        if file.endswith('.md') and re.match(r'^(\d+)_', file):
                            full_path = os.path.join(root, file)
                            if bank_type == BankType.QUESTION:
                                question_files.append(full_path)
                            else:
                                solution_files.append(full_path)

        # Count questions per category
        category_counts = {}
        for file_path in question_files:
            category_path = os.path.relpath(
                os.path.dirname(file_path), 
                os.path.join(data_dir, BankType.QUESTION.value)
            )
            if category_path == '.':
                category_path = ''
                
            category_counts[category_path] = category_counts.get(category_path, 0) + 1

        # Process categories first
        category_tasks = []
        for category_path in category_paths:
            count = category_counts.get(category_path, 0)
            category_tasks.append(question_manager.process_category(category_path, count))
            
            # Also process parent categories
            parts = category_path.split(os.path.sep)
            for i in range(1, len(parts)):
                parent_path = os.path.sep.join(parts[:i])
                if parent_path and parent_path not in category_paths:
                    category_paths.add(parent_path)
                    category_tasks.append(question_manager.process_category(parent_path))
        
        # Execute category tasks
        if category_tasks:
            await asyncio.gather(*category_tasks)
        
        # Process files concurrently
        question_tasks = [
            question_manager.process_question(
                FileManager.extract_id_from_filename(os.path.basename(f)), 
                force_update=False  # Only update if changed
            )
            for f in question_files
        ]
        
        solution_tasks = [
            question_manager.process_solution(
                FileManager.extract_id_from_filename(os.path.basename(f)), 
                force_update=False  # Only update if changed
            )
            for f in solution_files
        ]
        
        # Wait for all tasks to complete
        processed_questions = [q for q in await asyncio.gather(*question_tasks) if q]
        processed_solutions = [s for s in await asyncio.gather(*solution_tasks) if s]

        # Log results
        logger.info(f"Processed {len(processed_questions)} questions and {len(processed_solutions)} solutions")
        logger.info(f"Processed {len(category_paths)} categories")
        
        # Validate question-solution pairs
        validate_pairs(question_files, solution_files)

    except Exception as e:
        logger.error(f"Error updating database: {str(e)}")
        raise

class DatabaseUpdateDiagnostic:
    """Diagnostic utility for database update process."""
    
    def __init__(self, base_dir: str):
        self.base_dir = base_dir
        self.data_dir = os.path.join(base_dir, 'qode_clarity_fastapi', 'data')
        self.file_manager = FileManager()
        self.firestore_manager = FirestoreManager()
        
    async def run_diagnostics(self) -> Dict:
        """Run comprehensive diagnostics on database update process."""
        results = {
            'timestamp': datetime.now().isoformat(),
            'file_system': {},
            'firestore': {},
            'processing': {},
            'errors': []
        }
        
        try:
            # Check file system
            results['file_system'] = await self.check_file_system()
            
            # Check Firestore
            results['firestore'] = await self.check_firestore()
            
            # Test file processing
            results['processing'] = await self.test_file_processing()
            
        except Exception as e:
            results['errors'].append(f"Critical error during diagnostics: {str(e)}")
            logger.error(f"Diagnostic failure: {str(e)}", exc_info=True)
            
        return results
    
    async def check_file_system(self) -> Dict:
        """Check file system state and accessibility."""
        fs_results = {
            'directory_exists': False,
            'question_files': [],
            'solution_files': [],
            'unpaired_files': [],
            'invalid_files': []
        }
        
        try:
            # Check if data directory exists
            fs_results['directory_exists'] = os.path.exists(self.data_dir)
            if not fs_results['directory_exists']:
                raise FileNotFoundError(f"Data directory not found: {self.data_dir}")
            
            # Get all markdown files
            question_dir = os.path.join(self.data_dir, 'question_bank')
            solution_dir = os.path.join(self.data_dir, 'solution_bank')
            
            question_files = self._get_markdown_files(question_dir)
            solution_files = self._get_markdown_files(solution_dir)
            
            # Store file lists
            fs_results['question_files'] = [os.path.basename(f) for f in question_files]
            fs_results['solution_files'] = [os.path.basename(f) for f in solution_files]
            
            # Find unpaired files
            question_ids = {FileManager.extract_id_from_filename(os.path.basename(f)) for f in question_files}
            solution_ids = {FileManager.extract_id_from_filename(os.path.basename(f)) for f in solution_files}
            
            unpaired_questions = question_ids - solution_ids
            unpaired_solutions = solution_ids - question_ids
            
            fs_results['unpaired_files'] = {
                'questions_without_solutions': list(unpaired_questions),
                'solutions_without_questions': list(unpaired_solutions)
            }
            
            # Check for invalid filenames
            fs_results['invalid_files'] = [
                f for f in fs_results['question_files'] + fs_results['solution_files']
                if not re.match(r'^\d+_[\w-]+\.md$', f)
            ]
            
        except Exception as e:
            fs_results['error'] = str(e)
            logger.error(f"File system check failed: {str(e)}", exc_info=True)
            
        return fs_results
    
    async def check_firestore(self) -> Dict:
        """Check Firestore state and connectivity."""
        firestore_results = {
            'connection': False,
            'questions_count': 0,
            'solutions_count': 0,
            'categories_count': 0,
            'error': None
        }
        
        try:
            # Test connection
            self.firestore_manager.db.collection('questions').limit(1).get()
            firestore_results['connection'] = True
            
            # Get counts
            questions_ref = self.firestore_manager.db.collection('questions')
            solutions_ref = self.firestore_manager.db.collection('solutions')
            categories_ref = self.firestore_manager.db.collection('categories')
            
            # This is inefficient in Firestore but works for diagnostics
            questions_docs = questions_ref.stream()
            solutions_docs = solutions_ref.stream()
            categories_docs = categories_ref.stream()
            
            firestore_results['questions_count'] = sum(1 for _ in questions_docs)
            firestore_results['solutions_count'] = sum(1 for _ in solutions_docs)
            firestore_results['categories_count'] = sum(1 for _ in categories_docs)
            
        except Exception as e:
            firestore_results['error'] = str(e)
            logger.error(f"Firestore check failed: {str(e)}", exc_info=True)
            
        return firestore_results
    
    async def test_file_processing(self) -> Dict:
        """Test processing of files."""
        processing_results = {
            'processed_files': [],
            'failed_files': [],
            'errors': []
        }
        
        try:
            question_manager = QuestionManager(self.firestore_manager, self.file_manager, self.base_dir)
            
            # Get test files
            question_files = self._get_markdown_files(os.path.join(self.data_dir, 'question_bank'))
            
            # Process a sample of files
            sample_size = min(5, len(question_files))
            for file_path in question_files[:sample_size]:
                try:
                    question_id = FileManager.extract_id_from_filename(os.path.basename(file_path))
                    result = await question_manager.process_question(question_id, force_update=True)
                    
                    if result:
                        processing_results['processed_files'].append(os.path.basename(file_path))
                    else:
                        processing_results['failed_files'].append(os.path.basename(file_path))
                        
                except Exception as e:
                    processing_results['errors'].append(f"Error processing {file_path}: {str(e)}")
                    
        except Exception as e:
            processing_results['errors'].append(f"Critical processing error: {str(e)}")
            logger.error(f"File processing test failed: {str(e)}", exc_info=True)

        return processing_results
    
    @staticmethod
    def _get_markdown_files(directory: str) -> List[str]:
        """Get all markdown files from directory and subdirectories."""
        if not os.path.exists(directory):
            return []
            
        markdown_files = []
        for root, _, files in os.walk(directory):
            for file in files:
                if file.endswith('.md') and re.match(r'^(\d+)_', file):
                    markdown_files.append(os.path.join(root, file))
        return markdown_files

# Usage example
async def run_diagnostics(base_dir: str):
    """Run diagnostics on the database update process and print results."""
    diagnostic = DatabaseUpdateDiagnostic(base_dir)
    results = await diagnostic.run_diagnostics()
    
    print("\n=== Database Update Diagnostic Results ===\n")
    
    # File System Results
    print("File System Check:")
    print(f"Data Directory Exists: {results['file_system']['directory_exists']}")
    print(f"Question Files Found: {len(results['file_system'].get('question_files', []))}")
    print(f"Solution Files Found: {len(results['file_system'].get('solution_files', []))}")
    if results['file_system'].get('unpaired_files', {}).get('questions_without_solutions'):
        print("\nQuestions without solutions:", results['file_system']['unpaired_files']['questions_without_solutions'])
    if results['file_system'].get('unpaired_files', {}).get('solutions_without_questions'):
        print("\nSolutions without questions:", results['file_system']['unpaired_files']['solutions_without_questions'])
    if results['file_system'].get('invalid_files'):
        print("\nInvalid filenames found:", results['file_system']['invalid_files'])
        
    # Firestore Results
    print("\nFirestore Check:")
    print(f"Connection Successful: {results['firestore'].get('connection')}")
    print(f"Questions in Firestore: {results['firestore'].get('questions_count')}")
    print(f"Solutions in Firestore: {results['firestore'].get('solutions_count')}")
    print(f"Categories in Firestore: {results['firestore'].get('categories_count')}")
    if results['firestore'].get('error'):
        print(f"Firestore Error: {results['firestore']['error']}")
        
    # Processing Results
    print("\nProcessing Check:")
    print(f"Successfully Processed: {len(results['processing'].get('processed_files', []))}")
    print(f"Failed to Process: {len(results['processing'].get('failed_files', []))}")
    if results['processing'].get('errors'):
        print("\nProcessing Errors:")
        for error in results['processing']['errors']:
            print(f"- {error}")
            
    return results