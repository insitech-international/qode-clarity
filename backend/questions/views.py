# questions/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .utils import load_question, load_all_questions

class QuestionList(APIView):
    def get(self, request):
        questions = load_all_questions()
        return Response(questions)

class QuestionDetail(APIView):
    def get(self, request, pk):
        question = load_question(pk)
        if question is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(question)