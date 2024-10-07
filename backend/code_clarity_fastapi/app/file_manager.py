import os
import re
import logging
from typing import List, Dict, Optional, Any, Tuple
from pymongo import MongoClient
from fastapi import FastAPI
from bson import ObjectId

from code_clarity_fastapi.app.schemas import QuestionSchema, SolutionSchema, ProblemVersionSchema
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

    def get_questions_list(
        self, 
        filters: Dict[str, str] = None, 
        skip: int = 0, 
        limit: Optional[int] = None
    ) -> Tuple[List[Dict], int]:
        filters = filters or {}
        cursor = self.db.questions.find(filters).skip(skip)
        if limit:
            cursor = cursor.limit(limit)
        
        questions = list(cursor)
        total = self.db.questions.count_documents(filters)
        
        return questions, total

import re
import logging
from typing import Dict, Any, Optional
from pymongo import MongoClient
from bson import ObjectId
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

        logger.info(f"Parsed sections: {sections.keys()}")
        return sections

    @staticmethod
    def parse_solution_file(content: str, file_name: str) -> Dict[str, Any]:
        sections = FileManager.parse_markdown_file(content)
        question_id = FileManager.extract_id_from_filename(file_name)

        solution_data = {
            "question_id": question_id,
            "content": content
        }

        # Extract metadata
        if 'metadata' in sections:
            metadata = FileManager.parse_metadata(sections['metadata'])
            solution_data.update(metadata)

        # Extract other sections, only including populated fields
        for field in SolutionSchema.__annotations__:
            if field in sections and sections[field].strip():
                solution_data[field] = sections[field].strip()

        logger.info(f"Parsed solution data: {solution_data}")
        return solution_data

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
        return int(match.group(1)) if match else 0

    @staticmethod
    def parse_problem_versions(versions_content: str) -> List[Dict]:
        problem_versions = []
        version_blocks = re.split(r'\n#+\s*Version\s+\d+:', versions_content)
        
        for block in version_blocks[1:]:
            lines = block.strip().split('\n')
            version_type = lines[0].strip()
            description = '\n'.join(lines[1:]).strip()
            
            examples = []
            example_sections = re.findall(r'Example:(.+?)(?=\n\n|\Z)', description, re.DOTALL)
            
            for example_text in example_sections:
                example = {}
                for field in ['Input', 'Output', 'Explanation']:
                    match = re.search(rf'{field}:(.+?)(?={"|".join(["Input", "Output", "Explanation"])}:|\Z)', example_text, re.DOTALL)
                    if match:
                        example[field.lower()] = match.group(1).strip()
                
                examples.append(example)
            
            problem_versions.append({
                "version_type": version_type,
                "description": description,
                "examples": examples
            })
        
        return problem_versions

    @staticmethod
    def parse_question_file(content: str, file_name: str) -> Dict[str, Any]:
        sections = FileManager.parse_markdown_file(content)
        problem_versions = FileManager.parse_problem_versions(sections.get('versions', ''))
        question_id = FileManager.extract_id_from_filename(file_name)

        # If 'metadata' section is missing, try to extract metadata from other sections
        metadata = sections.get('metadata', {})
        if not metadata:
            for key in ['title', 'difficulty', 'category', 'subcategory', 'similar_questions', 'real_life_domains']:
                if key in sections:
                    metadata[key] = sections[key]

        return {
            "question_id": question_id,
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

    @staticmethod
    def parse_solution_file(content: str, file_name: str) -> Dict[str, Any]:
        sections = FileManager.parse_markdown_file(content)
        question_id = FileManager.extract_id_from_filename(file_name)

        # Ensure all required fields are present, even if empty
        solution_parts = [
            "introduction", "mathematical_abstraction",
            "pythonic_implementation", "real_world_analogies",
            "storytelling_approach", "visual_representation"
        ]

        solution_data = {
            "question_id": question_id,
            "content": content
        }

        # Extract metadata
        if 'metadata' in sections:
            metadata = FileManager.parse_metadata(sections['metadata'])
            solution_data.update(metadata)

        # Extract other sections
        for part in solution_parts:
            solution_data[part] = sections.get(part, '').strip()

        return solution_data

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
                update_data = {k: v for k, v in question_data.items() if v}
                self.db_manager.upsert_document('questions', update_data)
            
            # Merge existing data with new data
            if existing_question:
                existing_question.update(update_data)
                return QuestionSchema.model_validate(existing_question)
            else:
                return QuestionSchema.model_validate(update_data)
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
                update_data = {k: v for k, v in solution_data.items() if v}
                self.db_manager.upsert_document('solutions', update_data)
            
            # Merge existing data with new data
            if existing_solution:
                existing_solution.update(update_data)
                return SolutionSchema.model_validate(existing_solution)
            else:
                return SolutionSchema.model_validate(update_data)
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