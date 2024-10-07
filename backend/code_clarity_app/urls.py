from django.urls import path
from .views import QuestionListView, QuestionDetailView, SolutionView, CategoryView, FeaturedQuestionsView

urlpatterns = [
    path('categories/', CategoryView.as_view(), name='category-list'),
    path('questions/', QuestionListView.as_view(), name='question-list'),
    path('questions/<int:question_id>/', QuestionDetailView.as_view(), name='question-detail'),
    path('solutions/<int:question_id>/', SolutionView.as_view(), name='solution-detail'),
    path('featured-questions/', FeaturedQuestionsView.as_view(), name='featured-questions'),
]