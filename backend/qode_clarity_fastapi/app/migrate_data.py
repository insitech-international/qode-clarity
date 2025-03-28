"""
Data migration script for Qode Clarity.
This script imports data from the file system directly to Firestore.
"""
import os
import re
import glob
import logging
import asyncio
from typing import Dict, List, Optional, Set
from pathlib import Path

# Firebase/Firestore
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore import Client as FirestoreClient

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Base directory and paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DATA_DIR = os.path.join(BASE_DIR, 'qode_clarity_fastapi', 'data')
QUESTION_BANK_DIR = os.path.join(DATA_DIR, 'question_bank')
SOLUTION_BANK_DIR = os.path.join(DATA_DIR, 'solution_bank')

# Firestore setup
FIREBASE_CRED_PATH = os.environ.get("QODE_CLARITY_FIREBASE_CREDENTIALS_PATH", "firebase-key.json")

def initialize_firestore() -> FirestoreClient:
    """Initialize and return the Firestore client."""
    try:
        if os.path.exists(FIREBASE_CRED_PATH):
            cred = credentials.Certificate(FIREBASE_CRED_PATH)
            firebase_admin.initialize_app(cred)
        else:
            # For GCP environment, use application default credentials
            firebase_admin.initialize_app()
            
        return firestore.client()
    except Exception as e:
        logger.error(f"Error initializing Firestore: {e}")
        raise

def extract_id_from_filename(filename: str) -> int:
    """Extract the numeric ID from a filename."""
    try:
        match = re.search(r'^(\d+)', filename)
        return int(match.group(1)) if match else 0
    except (AttributeError, ValueError) as e:
        logger.error(f"Error extracting ID from filename {filename}: {str(e)}")
        return 0

def parse_markdown_sections(content: str) -> Dict[str, str]:
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

def parse_metadata(content: str) -> Dict[str, any]:
    """Parse metadata from markdown content."""
    metadata = {}
    list_fields = {'similar_questions', 'real_life_domains', 'tags'}
    
    try:
        # Check for YAML front matter
        if content.startswith('---'):
            end_marker = content.find('---', 3)
            if end_marker > 0:
                yaml_content = content[3:end_marker].strip()
                for line in yaml_content.split('\n'):
                    if ':' in line:
                        key, value = line.split(':', 1)
                        key = key.strip().lower().replace(' ', '_')
                        value = value.strip()
                        
                        if key in list_fields:
                            metadata[key] = [item.strip() for item in value.split(',') if item.strip()]
                        else:
                            metadata[key] = value
                
                return metadata
        
        # If no YAML front matter, look for metadata lines with - prefix
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
                    logger.warning(f"Error parsing metadata line '{line}': {str(e)}")
                    continue
                    
        return metadata
    except Exception as e:
        logger.error(f"Error parsing metadata: {str(e)}")
        return metadata

async def process_question_file(file_path: str, db: FirestoreClient) -> Dict:
    """Process a question file and upload to Firestore."""
    try:
        # Read file content
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
            
        # Extract data
        filename = os.path.basename(file_path)
        question_id = extract_id_from_filename(filename)
        sections = parse_markdown_sections(content)
        metadata = parse_metadata(content)
        
        # Get category path
        category_path = os.path.relpath(
            os.path.dirname(file_path),
            QUESTION_BANK_DIR
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
            'notes': sections.get('notes', '').splitlines(),
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP
        }
        
        # Upload to Firestore
        db.collection('questions').document(str(question_id)).set(question_data)
        logger.info(f"Uploaded question {question_id}: {metadata.get('title', '')}")
        
        return question_data
    
    except Exception as e:
        logger.error(f"Error processing question file {file_path}: {e}")
        return None

async def process_solution_file(file_path: str, db: FirestoreClient) -> Dict:
    """Process a solution file and upload to Firestore."""
    try:
        # Read file content
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
            
        # Extract data
        filename = os.path.basename(file_path)
        solution_id = extract_id_from_filename(filename)
        sections = parse_markdown_sections(content)
        metadata = parse_metadata(content)
        
        # Get category path
        category_path = os.path.relpath(
            os.path.dirname(file_path),
            SOLUTION_BANK_DIR
        )
        if category_path == '.':
            category_path = ''
            
        # Create solution data
        solution_data = {
            'questionId': solution_id,
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
            'visualRepresentation': sections.get('visual_representation', ''),
            'createdAt': firestore.SERVER_TIMESTAMP,
            'updatedAt': firestore.SERVER_TIMESTAMP
        }
        
        # Upload to Firestore
        db.collection('solutions').document(str(solution_id)).set(solution_data)
        logger.info(f"Uploaded solution {solution_id}")
        
        return solution_data
    
    except Exception as e:
        logger.error(f"Error processing solution file {file_path}: {e}")
        return None

async def process_categories(db: FirestoreClient, question_paths: List[str]) -> None:
    """Process categories from file paths and upload to Firestore."""
    try:
        # Extract unique category paths
        category_paths: Set[str] = set()
        for file_path in question_paths:
            rel_path = os.path.relpath(os.path.dirname(file_path), QUESTION_BANK_DIR)
            if rel_path != '.':
                category_paths.add(rel_path)
                
                # Add parent categories too
                parts = rel_path.split(os.path.sep)
                for i in range(1, len(parts)):
                    parent_path = os.path.sep.join(parts[:i])
                    category_paths.add(parent_path)
        
        # Count questions per category
        category_counts: Dict[str, int] = {}
        for file_path in question_paths:
            rel_path = os.path.relpath(os.path.dirname(file_path), QUESTION_BANK_DIR)
            if rel_path == '.':
                rel_path = ''
            category_counts[rel_path] = category_counts.get(rel_path, 0) + 1
        
        # Upload each category
        for category_path in sorted(category_paths):
            if not category_path:
                continue
                
            # Extract name from path
            parts = category_path.split(os.path.sep)
            category_name = ' '.join(part.replace('_', ' ') for part in parts)
            
            # Create category data
            category_data = {
                'name': category_name,
                'path': category_path,
                'questionCount': category_counts.get(category_path, 0),
                'parentPath': os.path.dirname(category_path) if os.path.sep in category_path else '',
                'level': len(parts),
                'createdAt': firestore.SERVER_TIMESTAMP,
                'updatedAt': firestore.SERVER_TIMESTAMP
            }
            
            # Generate ID from path
            category_id = category_path.replace(os.path.sep, '_').replace(' ', '_').lower()
            if not category_id:
                category_id = 'root'
                
            # Store in Firestore
            db.collection('categories').document(category_id).set(category_data)
            logger.info(f"Uploaded category: {category_name}")
            
        # Add root category if needed
        if '' in category_counts and category_counts[''] > 0:
            root_data = {
                'name': 'Root',
                'path': '',
                'questionCount': category_counts[''],
                'parentPath': '',
                'level': 0,
                'createdAt': firestore.SERVER_TIMESTAMP,
                'updatedAt': firestore.SERVER_TIMESTAMP
            }
            db.collection('categories').document('root').set(root_data)
            logger.info("Uploaded root category")
            
    except Exception as e:
        logger.error(f"Error processing categories: {e}")

async def main():
    """Main execution function."""
    logger.info(f"Starting migration from files to Firestore")
    logger.info(f"Base directory: {BASE_DIR}")
    logger.info(f"Data directory: {DATA_DIR}")
    
    try:
        # Initialize Firestore
        db = initialize_firestore()
        
        # Check if data directories exist
        if not os.path.exists(QUESTION_BANK_DIR):
            logger.error(f"Question bank directory not found: {QUESTION_BANK_DIR}")
            return
            
        if not os.path.exists(SOLUTION_BANK_DIR):
            logger.warning(f"Solution bank directory not found: {SOLUTION_BANK_DIR}")
        
        # Find all markdown files
        question_files = glob.glob(f"{QUESTION_BANK_DIR}/**/*.md", recursive=True)
        solution_files = glob.glob(f"{SOLUTION_BANK_DIR}/**/*.md", recursive=True)
        
        logger.info(f"Found {len(question_files)} question files and {len(solution_files)} solution files")
        
        # Process categories (need to do this first for data relationships)
        await process_categories(db, question_files)
        
        # Process files with asyncio for better performance
        question_tasks = [process_question_file(file_path, db) for file_path in question_files]
        question_results = await asyncio.gather(*question_tasks)
        question_count = sum(1 for result in question_results if result)
        
        solution_tasks = [process_solution_file(file_path, db) for file_path in solution_files]
        solution_results = await asyncio.gather(*solution_tasks)
        solution_count = sum(1 for result in solution_results if result)
        
        # Log results
        logger.info(f"Migration completed successfully")
        logger.info(f"Uploaded {question_count}/{len(question_files)} questions")
        logger.info(f"Uploaded {solution_count}/{len(solution_files)} solutions")
        
        # Verify pairs
        question_ids = {extract_id_from_filename(os.path.basename(f)) for f in question_files}
        solution_ids = {extract_id_from_filename(os.path.basename(f)) for f in solution_files}
        
        missing_solutions = question_ids - solution_ids
        missing_questions = solution_ids - question_ids
        
        if missing_solutions:
            logger.warning(f"Found {len(missing_solutions)} questions without solutions: {missing_solutions}")
            
        if missing_questions:
            logger.warning(f"Found {len(missing_questions)} solutions without questions: {missing_questions}")
        
    except Exception as e:
        logger.error(f"Migration failed: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main())