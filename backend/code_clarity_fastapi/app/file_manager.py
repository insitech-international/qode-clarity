import os
import re
import logging
from typing import List, Dict, Optional, Any, Tuple
from pymongo import MongoClient
from fastapi import FastAPI
from typing import Dict, Any, Optional
from pymongo import MongoClient
from code_clarity_fastapi.app.schemas import QuestionSchema, SolutionSchema
from code_clarity_fastapi.settings import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

class DatabaseManager:
    def __init__(self):
        self.client = MongoClient(str(settings.db_url))
        self.db = self.client[settings.db_base]
    
    def upsert_document(self, collection: str, document: Dict):
        query = {"question_id": document["question_id"]}
        # Remove the '_id' field from the document before updating
        document_without_id = {k: v for k, v in document.items() if k != '_id'}
        self.db[collection].update_one(query, {"$set": document_without_id}, upsert=True)

    def get_document(self, collection: str, query: Dict) -> Optional[Dict]:
        return self.db[collection].find_one(query)

    def get_questions_list(self, filters: Dict[str, Any], skip: int = 0, limit: Optional[int] = None) -> Tuple[List[Dict], int]:
        cursor = self.db.questions.find(filters).skip(skip)
        if limit:
            cursor = cursor.limit(limit)
        
        questions = list(cursor)
        total = self.db.questions.count_documents(filters)
        
        return questions, total

    def get_categories(self) -> List[str]:
        return self.db.questions.distinct("category")

class FileManager:
    @staticmethod
    def read_file(file_path: str) -> str:
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except FileNotFoundError:
            logger.error(f"File not found: {file_path}")
        except IOError as e:
            logger.error(f"IO error reading file {file_path}: {str(e)}")
        return ""

    @staticmethod
    def parse_markdown_file(content: str) -> Dict[str, Any]:
        sections = {}
        current_section = None
        section_content = ""

        lines = content.split('\n')

        for line in lines:
            if line.startswith('# '):
                if current_section and section_content.strip():
                    sections[current_section] = section_content.strip()
                
                current_section = line[2:].lower().replace(' ', '_')
                section_content = ""
            else:
                section_content += line + '\n'

        if current_section and section_content.strip():
            sections[current_section] = section_content.strip()
            
        return sections

    @staticmethod
    def parse_metadata(content: str) -> Dict[str, Any]:
        metadata = {}
        for line in content.split('\n'):
            if line.strip().startswith('-'):
                key, value = map(str.strip, line.strip('- ').split(':', 1))
                key = key.strip('**').lower().replace(' ', '_')
                if value.strip():  # Only include non-empty values
                    if key in ['similar_questions', 'real_life_domains']:
                        metadata[key] = [item.strip() for item in value.split(',') if item.strip()]
                    else:
                        metadata[key] = value
        return metadata

    @staticmethod
    def extract_id_from_filename(file_name: str) -> int:
        match = re.search(r'^(\d+)', file_name)
        return int(match.group(0)) if match else 0

    @staticmethod
    def parse_problem_versions(versions_content: str) -> List[str]:
        problem_versions = []
        # Updated regex pattern to capture everything including the version title
        version_blocks = re.findall(r'(##\s*Version\s*\d+:.+?)(?=\n##\s*Version|\Z)', versions_content, re.DOTALL)

        for block in version_blocks:
            version = block.strip()
            problem_versions.append(version)

        return problem_versions
    
    @staticmethod
    def parse_question_file(content: str, file_name: str) -> QuestionSchema:
        sections = FileManager.parse_markdown_file(content)
        problem_versions = FileManager.parse_problem_versions(sections.get('versions', ''))
        question_id = FileManager.extract_id_from_filename(file_name)

        metadata = FileManager.parse_metadata(sections.get('metadata', ''))
        logger.info(f"MetaData: {metadata}")
        question_data = {
            # "question_id": question_id,
            "question_id": metadata.get('id', question_id),
            "title": metadata.get('title', ''),
            "difficulty": metadata.get('difficulty', ''),
            "category": metadata.get('category', ''),
            "subcategory": metadata.get('subcategory', ''),
            "similar_questions": metadata.get('similar_questions', []),
            "real_life_domains": metadata.get('real_life_domains', []),
            "problem_description": sections.get('problem_description', ''),
            "problem_versions": problem_versions,
            "constraints": [c.strip() for c in sections.get('constraints', '').split('\n') if c.strip()],
            "notes": [n.strip() for n in sections.get('notes', '').split('\n') if n.strip()],
            "content": content
        }

        return QuestionSchema(**question_data)

    @staticmethod
    def parse_solution_file(content: str, file_name: str) -> SolutionSchema:
        sections = FileManager.parse_markdown_file(content)
        question_id = FileManager.extract_id_from_filename(file_name)

        metadata = FileManager.parse_metadata(sections.get('metadata', ''))
        
        solution_data = {
            "question_id": question_id,
            "category": metadata.get('category', ''),
            "subcategory": metadata.get('subcategory', ''),
            "classification_rationale": sections.get('classification_rationale', ''),
            "introduction": sections.get('introduction', ''),
            "mathematical_abstraction": sections.get('mathematical_abstraction', ''),
            "pythonic_implementation": sections.get('pythonic_implementation', ''),
            "bucesr_framework": sections.get('bucesr_framework', ''),
            "complexity_analysis": sections.get('complexity_analysis', ''),
            "real_world_analogies": sections.get('real_world_analogies', ''),
            "storytelling_approach": sections.get('storytelling_approach', ''),
            "visual_representation": sections.get('visual_representation', ''),
            "content": content
        }

        return SolutionSchema(**solution_data)

    @staticmethod
    def find_file_by_id(base_dir: str, file_id: int, file_type: str) -> Optional[str]:
        search_dir = os.path.join(base_dir, 'data', file_type)
        for root, _, files in os.walk(search_dir):
            for file in files:
                if file.endswith('.md'):
                    file_path = os.path.join(root, file)
                    if FileManager.extract_id_from_filename(file) == file_id:
                        return file_path

        logger.warning(f"No file found for ID: {file_id} in {file_type}")
        return None

class QuestionManager:
    def __init__(self, db_manager: DatabaseManager, file_manager: FileManager, base_dir: str):
        self.db_manager = db_manager
        self.file_manager = file_manager
        self.base_dir = base_dir

    def get_question(self, question_id: int, force_update: bool = False) -> Optional[QuestionSchema]:
        question_file = self.file_manager.find_file_by_id(self.base_dir, question_id, 'question_bank')
        if not question_file:
            return None

        try:
            content = self.file_manager.read_file(question_file)
            file_name = os.path.basename(question_file)
            question_data = self.file_manager.parse_question_file(content, file_name)

            existing_question = self.db_manager.get_document('questions', {"question_id": question_id})
            if force_update or not existing_question or existing_question.get('content') != content:
                # Only update fields that are present in the parsed data
                update_data = question_data.dict(exclude_unset=True)
                self.db_manager.upsert_document('questions', update_data)
            
            # Merge existing data with new data
            if existing_question:
                existing_question.update(update_data)
                return QuestionSchema(**existing_question)
            else:
                return question_data
        except Exception as e:
            logger.error(f"Error loading question for ID {question_id}: {str(e)}", exc_info=True)
            return None
           
    def get_solution(self, question_id: int, force_update: bool = False) -> Optional[SolutionSchema]:
        solution_file = self.file_manager.find_file_by_id(self.base_dir, question_id, 'solution_bank')
        if not solution_file:
            return None

        try:
            content = self.file_manager.read_file(solution_file)
            file_name = os.path.basename(solution_file)
            solution_data = self.file_manager.parse_solution_file(content, file_name)

            existing_solution = self.db_manager.get_document('solutions', {"question_id": question_id})
            if force_update or not existing_solution or existing_solution.get('content') != content:
                # Only update fields that are present in the parsed data
                update_data = solution_data.dict(exclude_unset=True)
                self.db_manager.upsert_document('solutions', update_data)
            
            # Merge existing data with new data
            if existing_solution:
                existing_solution.update(update_data)
                return SolutionSchema(**existing_solution)
            else:
                return solution_data
        except Exception as e:
            logger.error(f"Error loading solution for question ID {question_id}: {str(e)}", exc_info=True)
            return None

def update_database(base_dir: str):
    db_manager = DatabaseManager()
    file_manager = FileManager()
    question_manager = QuestionManager(db_manager, file_manager, base_dir)

    questions_dir = os.path.join(base_dir, 'data')
    if not os.path.exists(questions_dir):
        logger.error(f"Questions directory does not exist: {questions_dir}")
        return

    question_count = 0
    solution_count = 0

    for root, _, files in os.walk(questions_dir):
        for file in files:
            if file.endswith('.md') and re.match(r'^(\d+)_', file):
                try:
                    question_id = FileManager.extract_id_from_filename(file)
                    
                    if 'question_bank' in root:
                        if question_manager.get_question(question_id, force_update=True):
                            question_count += 1
                    elif 'solution_bank' in root:
                        if question_manager.get_solution(question_id, force_update=True):
                            solution_count += 1

                except Exception as e:
                    logger.error(f"Error processing file {file}: {str(e)}", exc_info=True)

    logger.info(f"Processed {question_count} questions and {solution_count} solutions")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)