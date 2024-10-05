import os
import re
from typing import List, Dict, Optional, Tuple, Any
from dataclasses import dataclass
from django.conf import settings
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)

@dataclass
class ProblemVersion:
    version_type: str
    description: str
    examples: List[Dict[str, str]]

@dataclass
class Question:
    id: int
    title: str
    difficulty: str
    category: str
    subcategory: str
    similar_questions: Dict[str, Any]
    real_life_domains: List[str]
    problem_versions: List[ProblemVersion]
    constraints: List[str]

@dataclass
class Solution:
    introduction: str
    classification_reason: str
    pythonic_implementation: str
    mathematical_abstraction: str
    real_world_analogies: str
    system_comparisons: str
    visual_representation: str

@dataclass
class Category:
    name: str
    count: int
    questions: List[Dict[str, Any]]
    diagram_path: str


def parse_markdown_file(file_path: str) -> Dict[str, str]:
    sections = {}
    current_section = None

    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
    except UnicodeDecodeError:
        # If UTF-8 fails, try with ISO-8859-1 encoding
        with open(file_path, 'r', encoding='iso-8859-1') as file:
            content = file.read()

    for line in content.split('\n'):
        if line.startswith('# '):
            current_section = line[2:].lower().replace(' ', '_')
            sections[current_section] = ''
        elif current_section:
            sections[current_section] += line + '\n'

    return {k: v.strip() for k, v in sections.items()}

def get_question(question_id: int) -> Optional[Question]:
    cache_key = f'question_{question_id}'
    cached_question = cache.get(cache_key)
    if cached_question:
        return cached_question

    questions_dir = os.path.join(settings.BASE_DIR, 'questions', 'data')
    for root, dirs, files in os.walk(questions_dir):
        for file in files:
            if file.startswith(f"{question_id}_") and file.endswith('.md'):
                question_path = os.path.join(root, file)
                try:
                    sections = parse_markdown_file(question_path)
                    
                    problem_versions = []
                    for i in range(1, 4):  # Assuming up to 3 versions
                        version_key = f'version_{i}'
                        if version_key in sections:
                            version_data = sections[version_key].split('\n\n')
                            problem_versions.append(ProblemVersion(
                                version_type=version_data[0],
                                description=version_data[1],
                                examples=[{'input': ex.split('\n')[0], 'output': ex.split('\n')[1]} for ex in version_data[2:]]
                            ))

                    question = Question(
                        id=question_id,
                        title=sections['title'],
                        difficulty=sections['difficulty'],
                        category=os.path.basename(os.path.dirname(os.path.dirname(question_path))),
                        subcategory=os.path.basename(os.path.dirname(question_path)),
                        similar_questions=eval(sections['similar_questions']),
                        real_life_domains=sections['real_life_domains'].split(', '),
                        problem_versions=problem_versions,
                        constraints=sections['constraints'].split('\n')
                    )

                    cache.set(cache_key, question, 3600)  # Cache for 1 hour
                    return question
                except Exception as e:
                    logger.error(f"Error loading question for ID {question_id}: {str(e)}")

    logger.warning(f"No question file found for ID: {question_id}")
    return None

def get_solution(question_id: int) -> Optional[Solution]:
    cache_key = f'solution_{question_id}'
    cached_solution = cache.get(cache_key)
    if cached_solution:
        return cached_solution

    solutions_dir = os.path.join(settings.BASE_DIR, 'questions', 'solutions')
    for root, dirs, files in os.walk(solutions_dir):
        for file in files:
            if file.startswith(f"{question_id}_") and file.endswith('.md'):
                solution_path = os.path.join(root, file)
                print(solution_path)
                try:
                    sections = parse_markdown_file(solution_path)
                    
                    solution = Solution(
                        introduction=sections['introduction'],
                        classification_reason=sections['classification_reason'],
                        pythonic_implementation=sections['pythonic_implementation'],
                        mathematical_abstraction=sections['mathematical_abstraction'],
                        real_world_analogies=sections['real_world_analogies'],
                        system_comparisons=sections['system_comparisons'],
                        visual_representation=sections['visual_representation']
                    )

                    cache.set(cache_key, solution, 3600)  # Cache for 1 hour
                    return solution
                except Exception as e:
                    logger.error(f"Error loading solution for question ID {question_id}: {str(e)}")

    logger.warning(f"No solution file found for question ID: {question_id}")
    return None

def get_questions_list(category: str = None, difficulty: str = None, company: str = None) -> Tuple[List[Question], int]:
    cache_key = f'questions_list_{category}_{difficulty}_{company}'
    cached_result = cache.get(cache_key)
    if cached_result:
        return cached_result

    questions_dir = os.path.join(settings.BASE_DIR, 'questions', 'data')
    all_questions = []

    for root, dirs, files in os.walk(questions_dir):
        for file in files:
            if file.endswith('.md'):
                try:
                    question_id = int(file.split('_')[0])
                    question = get_question(question_id)
                    if question:
                        if (not category or question.category == category) and \
                           (not difficulty or question.difficulty == difficulty) and \
                           (not company or company.lower() in [c.lower() for c in question.similar_questions.get('companies', [])]):
                            all_questions.append(question)
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
            if file.endswith('.md'):
                try:
                    question_id = int(file.split('_')[0])
                    question = get_question(question_id)
                    if question:
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
                            solution = get_solution(question_id)

                            # Add question and solution to the category
                            categories[category].questions.append({
                                'question': question,
                                'solution': solution
                            })
                except Exception as e:
                    logger.error(f"Error loading question from file {file}: {str(e)}")

    # Convert dictionary to list and sort by count
    categories_list = sorted(list(categories.values()), key=lambda x: x.count, reverse=True)
    cache.set(cache_key, categories_list, 3600)  # Cache for 1 hour
    return categories_list