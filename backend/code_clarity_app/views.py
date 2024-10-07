from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.core.exceptions import ValidationError
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class ListPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    max_page_size = 100

class QuestionListView(APIView):
    pagination_class = ListPagination

    def get(self, request):
        try:
            paginator = self.pagination_class()
            
            category = request.GET.get('category')
            difficulty = request.GET.get('difficulty')
            company = request.GET.get('company')
            
            query = {}
            if category:
                query['category'] = category
            if difficulty:
                query['difficulty'] = difficulty
            if company:
                query['similar_questions'] = {'$regex': company, '$options': 'i'}
            
            questions = settings.mongo_db.questions.find(query)
            
            if not questions:
                return Response({'message': 'No questions found'}, status=status.HTTP_404_NOT_FOUND)

            paginated_questions = paginator.paginate_queryset(list(questions), request)
            
            return paginator.get_paginated_response(paginated_questions)
        except Exception as e:
            logger.error(f"Unexpected error in QuestionListView: {str(e)}")
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class QuestionDetailView(APIView):
    def get(self, request, question_id):
        try:
            question = settings.mongo_db.questions.find_one({'id': question_id})
            if question:
                solution = settings.mongo_db.solutions.find_one({'question_id': question_id})
                if solution:
                    question['solution'] = solution
                return Response(question)
            logger.info(f"Question not found: {question_id}")
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in QuestionDetailView: {str(e)}")
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SolutionView(APIView):
    def get(self, request, question_id):
        try:
            solution = settings.mongo_db.solutions.find_one({'question_id': question_id})
            if solution:
                return Response(solution)
            logger.info(f"Solution not found for question: {question_id}")
            return Response({'error': 'Solution not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error in SolutionView: {str(e)}")
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class CategoryView(APIView):
    pagination_class = ListPagination

    def get(self, request):
        try:
            paginator = self.pagination_class()
            categories = settings.mongo_db.categories.find()
            
            paginated_categories = paginator.paginate_queryset(list(categories), request)

            return paginator.get_paginated_response(paginated_categories)
        except Exception as e:
            logger.error(f"Unexpected error in CategoryView: {str(e)}")
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class FeaturedQuestionsView(APIView):
    def get(self, request):
        try:
            categories = settings.mongo_db.categories.find()
            featured_questions = {}

            for category in categories:
                questions = settings.mongo_db.questions.find({'category': category['name']}).limit(6)
                featured_questions[category['name']] = list(questions)

            return Response(featured_questions)
        except Exception as e:
            logger.error(f"Unexpected error in FeaturedQuestionsView: {str(e)}")
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)