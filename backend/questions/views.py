from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from .utils import (
    get_question,
    get_solution,
    get_questions_list,
    get_categories,
    get_mind_map_data
)
import dataclasses

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000

class QuestionListView(APIView):
    pagination_class = StandardResultsSetPagination

    def get(self, request):
        paginator = self.pagination_class()
        
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 10))
        category = request.GET.get('category')
        difficulty = request.GET.get('difficulty')
        
        questions, total = get_questions_list(page=page, per_page=per_page, category=category, difficulty=difficulty)
        
        paginated_result = paginator.paginate_queryset(questions, request)
        
        # Fetch solutions for each question
        for question in paginated_result:
            question.solution = get_solution(question.id)

        return Response({
            'questions': [dataclasses.asdict(q) for q in paginated_result],
            'total': total,
            'page': page,
            'per_page': per_page
        })

class QuestionDetailView(APIView):
    def get(self, request, question_id):
        question = get_question(question_id)
        if question:
            # Fetch the corresponding solution
            question.solution = get_solution(question_id)
            return Response(dataclasses.asdict(question))
        return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)

class SolutionView(APIView):
    def get(self, request, question_id):
        solution = get_solution(question_id)
        if solution:
            return Response(dataclasses.asdict(solution))
        return Response({'error': 'Solution not found'}, status=status.HTTP_404_NOT_FOUND)

class CategoryView(APIView):
    pagination_class = StandardResultsSetPagination

    def get(self, request):
        paginator = self.pagination_class()
        categories = get_categories()
        total = len(categories)
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 10))

        start = (page - 1) * per_page
        end = start + per_page
        paginated_categories = categories[start:end]

        mind_map_data = get_mind_map_data()

        return Response({
            'categories': [dataclasses.asdict(c) for c in paginated_categories],
            'total': total,
            'page': page,
            'per_page': per_page,
            'mind_map': mind_map_data
        })