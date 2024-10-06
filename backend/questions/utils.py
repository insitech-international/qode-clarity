import os
import re
from typing import List, Dict, Optional, Any, Tuple
from dataclasses import dataclass, field
from django.conf import settings
from django.core.cache import cache
import logging
import yaml

logger = logging.getLogger(__name__)

@dataclass
class ProblemVersion:
    version_type: str
    description: str
    examples: List[Dict[str, Any]]

@dataclass
class Question:
    id: int
    title: str
    difficulty: str
    category: str
    subcategory: str
    similar_questions: Dict[str, List[str]]
    real_life_domains: List[str]
    problem_versions: List[ProblemVersion]
    constraints: List[str]
    notes: List[str]

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
    questions: List[Dict[str, Any]] = field(default_factory=list)
    diagram_path: str = ""

def parse_metadata(content: str) -> Dict[str, Any]:
    metadata = {}
    current_key = None
    for line in content.split('\n'):
        if line.strip().startswith('-'):
            key_value = line.strip('- ').split(':', 1)
            if len(key_value) == 2:
                key, value = key_value
                key = key.strip().strip('**')
                value = value.strip()
                if key == 'Similar Questions':
                    metadata[key] = {}
                    current_key = key
                else:
                    metadata[key] = value
        elif current_key == 'Similar Questions' and line.strip().startswith('-'):
            platform, question = line.strip('- ').split(':', 1)
            metadata['Similar Questions'][platform.strip()] = question.strip()
    return metadata

def parse_problem_versions(versions_content: str) -> List[ProblemVersion]:
    problem_versions = []
    version_blocks = re.split(r'\n#+\s*Version\s+\d+:', versions_content)
    
    for block in version_blocks[:]:  # Skip the first empty split
        lines = block.strip().split('\n')
        version_type = lines[0].strip()
        description = '\n'.join(lines[1:]).strip()
        
        examples = []
        example_sections = re.findall(r'Example:(.+?)(?=\n\n|\Z)', description, re.DOTALL)
        
        for example_text in example_sections:
            example = {}
            input_match = re.search(r'Input:(.+?)(?=Output:|\Z)', example_text, re.DOTALL)
            output_match = re.search(r'Output:(.+?)(?=Explanation:|\Z)', example_text, re.DOTALL)
            explanation_match = re.search(r'Explanation:(.+)', example_text, re.DOTALL)
            
            if input_match:
                example['input'] = input_match.group(1).strip()
            if output_match:
                example['output'] = output_match.group(1).strip()
            if explanation_match:
                example['explanation'] = explanation_match.group(1).strip()
            
            examples.append(example)
        
        problem_versions.append(ProblemVersion(version_type=version_type, description=description, examples=examples))
    
    return problem_versions

def parse_markdown_file(file_path: str) -> Dict[str, Any]:
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
    except FileNotFoundError:
        logger.error(f"File not found: {file_path}")
        return {}
    except IOError as e:
        logger.error(f"IO error reading file {file_path}: {str(e)}")
        return {}

    sections = {}
    current_section = None
    metadata_content = ""
    in_metadata = False

    for line in content.split('\n'):
        if line.strip() == '## Metadata':
            in_metadata = True
            current_section = None
        elif line.startswith('## '):
            in_metadata = False
            current_section = line[3:].lower().replace(' ', '_')
            sections[current_section] = ''
        elif in_metadata:
            metadata_content += line + '\n'
        elif current_section:
            sections[current_section] += line + '\n'

    sections['metadata'] = parse_metadata(metadata_content)
    return {k: v.strip() if isinstance(v, str) else v for k, v in sections.items()}

def find_file_by_id(base_dir: str, file_id: int, file_type: str = 'question') -> Optional[str]:
    if file_type == 'question':
        search_dir = os.path.join(base_dir, 'questions', 'data')
    elif file_type == 'solution':
        search_dir = os.path.join(base_dir, 'questions', 'solutions')
    else:
        raise ValueError(f"Invalid file_type: {file_type}")

    for root, dirs, files in os.walk(search_dir):
        for file in files:
            if file.startswith(f"{file_id}_") and file.endswith('.md'):
                return os.path.join(root, file)
    
    return None

def get_question(question_id: int) -> Optional[Question]:
    cache_key = f'question_{question_id}'
    cached_question = cache.get(cache_key)
    if cached_question:
        return cached_question

    question_file = find_file_by_id(settings.BASE_DIR, question_id, 'question')
    print(question_file)
    if not question_file:
        logger.warning(f"No question file found for ID: {question_id}")
        return None

    try:
        sections = parse_markdown_file(question_file)
        
        metadata = sections.get('metadata', {})
        problem_versions = parse_problem_versions(sections.get('versions', ''))
        
        similar_questions = metadata.get('Similar Questions', {})

        question = Question(
            id=question_id,
            title=metadata.get('Title', ''),
            difficulty=metadata.get('Difficulty', ''),
            category=metadata.get('Category', ''),
            subcategory=metadata.get('Subcategory', ''),
            similar_questions=similar_questions,
            real_life_domains=metadata.get('Real Life Domains', '').split(', ') if metadata.get('Real Life Domains') else [],
            problem_versions=problem_versions,
            constraints=sections.get('constraints', '').split('\n') if sections.get('constraints') else [],
            notes=sections.get('notes', '').split('\n') if sections.get('notes') else []
        )

        cache.set(cache_key, question, 3600)  # Cache for 1 hour
        return question
    except Exception as e:
        logger.error(f"Error loading question for ID {question_id}: {str(e)}", exc_info=True)
        return None

def get_solution(question_id: int) -> Optional[Solution]:
    cache_key = f'solution_{question_id}'
    cached_solution = cache.get(cache_key)
    if cached_solution:
        return cached_solution

    solution_file = find_file_by_id(settings.BASE_DIR, question_id, 'solution')
    
    if not solution_file:
        logger.warning(f"No solution file found for question ID: {question_id}")
        return None

    try:
        with open(solution_file, 'r', encoding='utf-8') as file:
            content = file.read()

        sections = {}
        current_section = None
        for line in content.split('\n'):
            if line.startswith('# '):
                current_section = line[2:].lower().replace(' ', '_')
                sections[current_section] = []
            elif current_section:
                sections[current_section].append(line)

        sections = {k: '\n'.join(v).strip() for k, v in sections.items()}
        
        solution = Solution(
            introduction=sections.get('introduction', ''),
            classification_reason=sections.get('classification_reason', ''),
            pythonic_implementation=sections.get('pythonic_implementation', ''),
            mathematical_abstraction=sections.get('mathematical_abstraction', ''),
            real_world_analogies=sections.get('real_world_analogies', ''),
            system_comparisons=sections.get('system_comparisons', ''),
            visual_representation=sections.get('visual_representation', '')
        )

        cache.set(cache_key, solution, 3600)  # Cache for 1 hour
        return solution
    except Exception as e:
        logger.error(f"Error loading solution for question ID {question_id}: {str(e)}", exc_info=True)
        return None
         
def get_questions_list(category: str = None, difficulty: str = None, company: str = None) -> Tuple[List[Question], int]:
    cache_key = f'questions_list_{category}_{difficulty}_{company}'
    cached_result = cache.get(cache_key)
    if cached_result:
        return cached_result

    questions_dir = os.path.join(settings.BASE_DIR, 'questions', 'data')
    all_questions = []

    try:
        for root, dirs, files in os.walk(questions_dir):
            for file in files:
                if file.endswith('.md'):
                    try:
                        question_id = int(file.split('_')[0])
                        question = get_question(question_id)
                        if question:
                            if (not category or question.category == category) and \
                            (not difficulty or question.difficulty == difficulty) and \
                            (not company or any(company.lower() in q.lower() for q in question.similar_questions.keys())):
                                all_questions.append(question)
                    except Exception as e:
                        logger.error(f"Error loading question from file {file}: {str(e)}")
    except OSError as e:
        logger.error(f"Error accessing questions directory: {str(e)}")

    total = len(all_questions)
    cache.set(cache_key, (all_questions, total), 3600)  # Cache for 1 hour
    return all_questions, total

def get_categories() -> List[Category]:
    cache_key = 'all_categories'
    cached_categories = cache.get(cache_key)
    if cached_categories:
        return cached_categories

    categories = {}
    questions_dir = os.path.join(settings.BASE_DIR, 'questions', 'data')
    diagrams_dir = os.path.join(settings.BASE_DIR, 'category_diagrams')

    try:
        for root, dirs, files in os.walk(questions_dir):
            for file in files:
                if file.endswith('.md'):
                    try:
                        question_id = int(file.split('_')[0])
                        question = get_question(question_id)
                        if question:
                            category = question.category
                            if category not in categories:
                                categories[category] = Category(
                                    name=category,
                                    count=0,
                                    questions=[],
                                    diagram_path=os.path.join(diagrams_dir, f"{category.lower().replace(' ', '_')}.png")
                                )
                            categories[category].count += 1
                            
                            solution = get_solution(question_id)
                            categories[category].questions.append({
                                'question': question,
                                'solution': solution
                            })
                    except Exception as e:
                        logger.error(f"Error loading question from file {file}: {str(e)}")
    except OSError as e:
        logger.error(f"Error accessing questions directory: {str(e)}")

    categories_list = sorted(list(categories.values()), key=lambda x: x.count, reverse=True)
    cache.set(cache_key, categories_list, 3600)  # Cache for 1 hour
    return categories_list