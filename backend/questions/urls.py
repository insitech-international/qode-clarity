from django.urls import path, include
from rest_framework import routers
from .views import QuestionListView, QuestionDetailView, SolutionView, CategoryView

router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('categories/', CategoryView.as_view(), name='category-list'),
    path('questions/', QuestionListView.as_view(), name='question-list'),
    path('questions/<int:question_id>/', QuestionDetailView.as_view(), name='question-detail'),
    path('solutions/<int:question_id>/', SolutionView.as_view(), name='solution-detail'),
]