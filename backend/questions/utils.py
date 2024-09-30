import os
import json
import re
from django.conf import settings
import logging
from dataclasses import dataclass
from typing import List, Optional, Dict, Any

logger = logging.getLogger(__name__)

@dataclass
class Solution:
    problem_classification: str
    problem_explanation: str
    approach_explanation: str
    algorithm_steps: str
    complexity_analysis: str
    code_implementation: str

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
class Question:
    id: int
    title: str
    difficulty: str
    category: str
    subcategory: str
    similar_question: SimilarQuestion
    real_life_domains: List[str]
    scenario: str
    task: str
    examples: List[Example]
    constraints: List[str]
    solution: Optional[Solution] = None

@dataclass
class Category:
    name: str
    count: int
    questions: List[Dict[str, Any]]
    diagram_path: str

def get_question(question_id: int) -> Optional[Question]:
    if not isinstance(question_id, int) or question_id <= 0:
        raise ValueError("Invalid question ID")

    pattern = re.compile(rf'^{question_id}_.*\.json$')
    questions_dir = os.path.join(settings.BASE_DIR, 'questions', 'data')

    for root, dirs, files in os.walk(questions_dir):
        for file in files:
            if pattern.match(file):
                question_path = os.path.join(root, file)
                try:
                    with open(question_path, 'r') as f:
                        data = json.load(f)
                        return Question(**data)
                except Exception as e:
                    logger.error(f"Error loading question for ID {question_id}: {str(e)}")
                    return None

    logger.warning(f"No question file found for ID: {question_id}")
    return None

def get_solution(question_id: int) -> Optional[Solution]:
    if not isinstance(question_id, int) or question_id <= 0:
        raise ValueError("Invalid question ID")

    pattern = re.compile(rf'^{question_id}_.*\.py$')
    solutions_dir = os.path.join(settings.BASE_DIR, 'questions', 'solutions')

    for root, dirs, files in os.walk(solutions_dir):
        for file in files:
            if pattern.match(file):
                solution_path = os.path.join(root, file)
                try:
                    with open(solution_path, 'r') as f:
                        content = f.read()

                    sections = {
                        'problem_classification': '',
                        'problem_explanation': '',
                        'approach_explanation': '',
                        'algorithm_steps': '',
                        'complexity_analysis': '',
                        'code_implementation': ''
                    }

                    current_section = None
                    for line in content.split('\n'):
                        if line.startswith('# CLASSIFICATION REASON:'):
                            current_section = 'problem_classification'
                        elif line.startswith('# LOGIC EXPLANATION:'):
                            current_section = 'problem_explanation'
                        elif line.startswith('# BEST APPROACH:'):
                            current_section = 'approach_explanation'
                        elif line.startswith('# PSEUDOCODE:'):
                            current_section = 'algorithm_steps'
                        elif line.startswith('# COMPLEXITY:'):
                            current_section = 'complexity_analysis'
                        elif line.startswith('# IMPLEMENTATION:'):
                            current_section = 'code_implementation'
                        elif current_section:
                            sections[current_section] += line.lstrip('# ') + '\n'

                    # Clean up the sections
                    for key in sections:
                        sections[key] = sections[key].strip()

                    return Solution(**sections)
                except Exception as e:
                    logger.error(f"Error loading solution for question ID {question_id}: {str(e)}")
                    return None

    logger.warning(f"No solution file found for question ID: {question_id}")
    return None

def get_questions_list(page: int = 1, per_page: int = 10, category: str = None, difficulty: str = None) -> tuple:
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

    start = (page - 1) * per_page
    end = start + per_page

    return all_questions[start:end], len(all_questions)

def get_categories() -> List[Category]:
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
    categories_list = list(categories.values())
    return sorted(categories_list, key=lambda x: x.count, reverse=True)

def get_mind_map_data() -> Dict[str, Dict[str, List[Dict[str, Any]]]]:
    mind_map = {}
    questions_dir = os.path.join(settings.BASE_DIR, 'questions', 'data')

    for root, dirs, files in os.walk(questions_dir):
        for file in files:
            if file.endswith('.json'):
                try:
                    with open(os.path.join(root, file), 'r') as f:
                        question_data = json.load(f)
                        if question_data:
                            question = Question(**question_data)
                            category = question.category
                            subcategory = question.subcategory
                            if category:
                                if category not in mind_map:
                                    mind_map[category] = {}
                                if subcategory:
                                    if subcategory not in mind_map[category]:
                                        mind_map[category][subcategory] = []
                                    mind_map[category][subcategory].append({
                                        'id': question.id,
                                        'title': question.title
                                    })
                except json.JSONDecodeError:
                    logger.error(f"Error decoding JSON from file {file}")
                except Exception as e:
                    logger.error(f"Error loading question from file {file}: {str(e)}")

    return mind_map