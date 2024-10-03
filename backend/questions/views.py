from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.core.exceptions import ValidationError
from .utils import (
    get_question,
    get_solution,
    get_questions_list,
    get_categories,
)
from dataclasses import asdict
import logging

logger = logging.getLogger(__name__)

class ListPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        try:
            return super().paginate_queryset(queryset, request, view)
        except Exception as e:
            logger.error(f"Pagination error: {str(e)}")
            raise ValidationError(f"Invalid pagination parameters: {str(e)}")

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })

class QuestionListView(APIView):
    pagination_class = ListPagination

    def get(self, request):
        try:
            paginator = self.pagination_class()
            
            category = request.GET.get('category')
            difficulty = request.GET.get('difficulty')
            
            questions, total = get_questions_list(category=category, difficulty=difficulty)
            
            paginated_questions = paginator.paginate_queryset(questions, request)
            
            # Fetch solutions for each question
            for question in paginated_questions:
                solution = get_solution(question.id)
                if solution:
                    question.solution = asdict(solution)
                else:
                    question.solution = None

            return paginator.get_paginated_response([asdict(q) for q in paginated_questions])
        except ValidationError as e:
            logger.warning(f"Validation error in QuestionListView: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error in QuestionListView: {str(e)}")
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class QuestionDetailView(APIView):
    def get(self, request, question_id):
        try:
            question = get_question(question_id)
            if question:
                solution = get_solution(question_id)
                if solution:
                    question.solution = asdict(solution)
                else:
                    question.solution = None
                return Response(asdict(question))
            logger.info(f"Question not found: {question_id}")
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            logger.warning(f"Validation error in QuestionDetailView: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error in QuestionDetailView: {str(e)}")
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SolutionView(APIView):
    def get(self, request, question_id):
        try:
            solution = get_solution(question_id)
            if solution:
                return Response(asdict(solution))
            logger.info(f"Solution not found for question: {question_id}")
            return Response({'error': 'Solution not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            logger.warning(f"Validation error in SolutionView: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error in SolutionView: {str(e)}")
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class CategoryView(APIView):
    pagination_class = ListPagination

    def get(self, request):
        try:
            paginator = self.pagination_class()
            categories = get_categories()
            
            paginated_categories = paginator.paginate_queryset(categories, request)

            return paginator.get_paginated_response({
                'categories': [asdict(c) for c in paginated_categories],
            })
        except ValidationError as e:
            logger.warning(f"Validation error in CategoryView: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error in CategoryView: {str(e)}")
            return Response({'error': 'An unexpected error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)