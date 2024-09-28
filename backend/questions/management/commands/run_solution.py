# questions/management/commands/run_solution.py
import importlib
from django.core.management.base import BaseCommand
from questions.utils import load_question

class Command(BaseCommand):
    help = 'Run solution for a specific question'

    def add_arguments(self, parser):
        parser.add_argument('question_id', type=int)

    def handle(self, *args, **options):
        question_id = options['question_id']
        question = load_question(question_id)
        
        if question is None:
            self.stdout.write(self.style.ERROR(f'Question {question_id} not found'))
            return
        
        module_name = f'questions.solutions.q{question_id:04d}_{question["title"].lower().replace(" ", "_")}'
        solution_module = importlib.import_module(module_name)
        
        solution = solution_module.Solution()
        result = solution.solve()
        
        self.stdout.write(self.style.SUCCESS(f'Solution result: {result}'))