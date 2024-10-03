import os
import json
import re
from django.conf import settings
import logging
from dataclasses import dataclass
from typing import List, Optional, Dict, Any
from django.core.cache import cache

logger = logging.getLogger(__name__)

@dataclass
class SimilarQuestion:
    platforms: List[Dict[str, int]]
    companies: List[str]

@dataclass
class Example:
    input: str
    output: str
    explanation: str

@dataclass
class Category:
    name: str
    count: int
    questions: List[Dict[str, Any]]
    diagram_path: str

@dataclass
class Solution:
    problem_classification: str
    real_world_relevance: str
    approach_selection: str
    constraint_influence: str
    code_design: str

@dataclass
class Question:
    id: int
    title: str
    difficulty: str
    category: str
    subcategory: str
    similar_question: Dict[str, Any]
    real_life_domains: List[str]
    scenario: str
    task: str
    examples: List[Dict[str, str]]
    constraints: List[str]
    solution: Optional[Solution] = None

def get_question(question_id: int) -> Optional[Question]:
    if not isinstance(question_id, int) or question_id <= 0:
        raise ValueError("Invalid question ID")

    cache_key = f'question_{question_id}'
    cached_question = cache.get(cache_key)
    if cached_question:
        return cached_question

    pattern = re.compile(rf'^{question_id}_.*\.json$')
    questions_dir = os.path.join(settings.BASE_DIR, 'questions', 'data')

    for root, dirs, files in os.walk(questions_dir):
        for file in files:
            if pattern.match(file):
                question_path = os.path.join(root, file)
                try:
                    with open(question_path, 'r') as f:
                        data = json.load(f)
                        question = Question(**data)
                        
                        # Fetch the solution
                        solution = get_solution(question_id)
                        if solution:
                            question.solution = solution
                        
                        cache.set(cache_key, question, 3600)  # Cache for 1 hour
                        return question
                except Exception as e:
                    logger.error(f"Error loading question for ID {question_id}: {str(e)}")
                    return None

    logger.warning(f"No question file found for ID: {question_id}")
    return None

def get_solution(question_id: int) -> Optional[Solution]:
    if not isinstance(question_id, int) or question_id <= 0:
        raise ValueError("Invalid question ID")

    cache_key = f'solution_{question_id}'
    cached_solution = cache.get(cache_key)
    if cached_solution:
        return cached_solution

    solutions_dir = os.path.join(settings.BASE_DIR, 'questions', 'solutions')
    logger.info(f"Searching for solution in directory: {solutions_dir}")

    for root, dirs, files in os.walk(solutions_dir):
        for file in files:
            if file.startswith(f"{question_id}_") and file.endswith(".py"):
                solution_path = os.path.join(root, file)
                logger.info(f"Found solution file: {solution_path}")
                try:
                    with open(solution_path, 'r') as f:
                        content = f.read()

                    sections = extract_sections(content)
                    
                    if all(sections.values()):
                        solution = Solution(**sections)
                        cache.set(cache_key, solution, 3600)  # Cache for 1 hour
                        return solution
                    else:
                        logger.warning(f"Some sections are empty in solution file: {solution_path}")
                        return None
                except Exception as e:
                    logger.error(f"Error loading solution for question ID {question_id}: {str(e)}")
                    return None

    logger.warning(f"No solution file found for question ID: {question_id}")
    return None

def extract_sections(content: str) -> dict:
    sections = {
        'problem_classification': '',
        'real_world_relevance': '',
        'approach_selection': '',
        'constraint_influence': '',
        'code_design': ''
    }

    section_patterns = {
        'problem_classification': r'# CLASSIFICATION REASON:.*?(?=# LOGIC EXPLANATION:|$)',
        'real_world_relevance': r'# LOGIC EXPLANATION:.*?(?=# BEST APPROACH:|$)',
        'approach_selection': r'# BEST APPROACH:.*?(?=# CONSTRAINTS:|$)',
        'constraint_influence': r'# CONSTRAINTS:.*?(?=# CODE DESIGN:|$)',
        'code_design': r'# CODE DESIGN:.*'
    }

    for section, pattern in section_patterns.items():
        print(section)
        match = re.search(pattern, content, re.DOTALL)
        if match:
            section_content = match.group(0)
            # Remove the section header and leading/trailing whitespace
            cleaned_content = re.sub(r'^#.*?\n', '', section_content, flags=re.MULTILINE).strip()
            sections[section] = cleaned_content
        else:
            logger.warning(f"Section '{section}' not found in the solution file.")

    return sections

def get_questions_list(category: str = None, difficulty: str = None) -> tuple:
    cache_key = f'questions_list_{category}_{difficulty}'
    cached_result = cache.get(cache_key)
    if cached_result:
        return cached_result

    questions_dir = os.path.join(settings.BASE_DIR, 'questions', 'data')
    all_questions = []

    for root, dirs, files in os.walk(questions_dir):
        for file in files:
            if file.endswith('.json'):
                try:
                    with open(os.path.join(root, file), 'r') as f:
                        question_data = json.load(f)
                        if question_data:  # Only process non-empty files
                            question = Question(**question_data)
                            if (not category or question.category == category) and \
                               (not difficulty or question.difficulty == difficulty):
                                all_questions.append(question)
                except json.JSONDecodeError:
                    logger.error(f"Error decoding JSON from file {file}")
                except Exception as e:
                    logger.error(f"Error loading question from file {file}: {str(e)}")

    result = (all_questions, len(all_questions))
    cache.set(cache_key, result, 3600)  # Cache for 1 hour
    return result

def get_categories() -> List[Category]:
    cache_key = 'all_categories'
    cached_categories = cache.get(cache_key)
    if cached_categories:
        return cached_categories

    categories = {}
    questions_dir = os.path.join(settings.BASE_DIR, 'questions', 'data')
    diagrams_dir = os.path.join(settings.BASE_DIR, 'questions', 'category_diagrams')

    for root, dirs, files in os.walk(questions_dir):
        for file in files:
            if file.endswith('.json'):
                try:
                    with open(os.path.join(root, file), 'r') as f:
                        question_data = json.load(f)
                        if question_data:  # Only process non-empty files
                            question = Question(**question_data)
                            category = question.category
                            if category:
                                if category not in categories:
                                    categories[category] = Category(
                                        name=category,
                                        count=0,
                                        questions=[],
                                        diagram_path=os.path.join(diagrams_dir, f"{category.lower().replace(' ', '_')}.png")
                                    )
                                categories[category].count += 1
                                
                                # Fetch the corresponding solution
                                solution = get_solution(question.id)
                                question = get_question(question.id)

                                # Add question and solution to the category
                                categories[category].questions.append({
                                    'question': question,
                                    'solution': solution
                                })
                except json.JSONDecodeError:
                    logger.error(f"Error decoding JSON from file {file}")
                except Exception as e:
                    logger.error(f"Error loading question from file {file}: {str(e)}")

    # Convert dictionary to list and sort by count
    categories_list = sorted(list(categories.values()), key=lambda x: x.count, reverse=True)
    cache.set(cache_key, categories_list, 3600)  # Cache for 1 hour
    return categories_list

