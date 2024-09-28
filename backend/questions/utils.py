# questions/utils.py
import json
import os
from django.conf import settings

def load_question(question_id):
    file_path = os.path.join(settings.BASE_DIR, 'questions', 'data', 'questions', f'q{question_id:04d}_*.json')
    matching_files = glob.glob(file_path)
    if not matching_files:
        return None
    with open(matching_files[0], 'r') as f:
        return json.load(f)

def load_all_questions():
    questions_dir = os.path.join(settings.BASE_DIR, 'questions', 'data', 'questions')
    questions = []
    for filename in os.listdir(questions_dir):
        if filename.endswith('.json'):
            with open(os.path.join(questions_dir, filename), 'r') as f:
                questions.append(json.load(f))
    return sorted(questions, key=lambda q: q['id'])