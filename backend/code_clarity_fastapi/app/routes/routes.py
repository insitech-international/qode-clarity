import re
from fastapi import APIRouter, HTTPException, Query, Request
from typing import List, Optional, Dict, Any
from code_clarity_fastapi.app.schemas import QuestionSchema, SolutionSchema
from code_clarity_fastapi.app.file_manager import update_database, DatabaseManager, FileManager, QuestionManager
from code_clarity_fastapi.settings import settings
import logging
import json
from bson import json_util

router = APIRouter()
logger = logging.getLogger(__name__)

# Global managers to be initialized
question_manager = None
db_manager = None

def initialize(qm: QuestionManager, dbm: DatabaseManager):
    global question_manager, db_manager
    question_manager = qm
    db_manager = dbm

@router.get("/featured_questions/")
def featured_questions():
    try:
        categories = db_manager.get_categories()
        featured_questions = {}
        for category in categories:
            questions, _ = db_manager.get_questions_list({"category": category}, limit=6)
            # Convert ObjectId to string
            questions_json = json.loads(json_util.dumps(questions))
            featured_questions[category] = questions_json
        return featured_questions
    except Exception as e:
        logger.error(f"Error fetching featured questions: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/categories/", response_model=List[str])
def list_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    try:
        categories = db_manager.get_categories()
        return categories[skip:skip + limit]
    except Exception as e:
        logger.error(f"Error fetching categories: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/questions/{question_id}", response_model=QuestionSchema)
def get_question(question_id: int):
    try:
        logger.info(f"Attempting to fetch question with ID: {question_id}")
        question = db_manager.db.questions.find_one({"question_id": question_id})
        if not question:
            logger.warning(f"Question not found in database: {question_id}")
            raise HTTPException(status_code=404, detail="Question not found")
        logger.info(f"Question found: {question}")
        return QuestionSchema(**question)
    except Exception as e:
        logger.error(f"Error fetching question {question_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/questions/{question_id}/content")
def get_question_content(question_id: int):
    try:
        question = db_manager.db.questions.find_one({"question_id": question_id})
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        return {"content": question.get("content")}
    except Exception as e:
        logger.error(f"Error fetching content for question {question_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/solutions/{question_id}", response_model=SolutionSchema)
def get_solution(question_id: int):
    try:
        logger.info(f"Attempting to fetch solution for question ID: {question_id}")
        solution = db_manager.db.solutions.find_one({"question_id": question_id})
        if not solution:
            logger.warning(f"Solution not found in database for question ID: {question_id}")
            raise HTTPException(status_code=404, detail="Solution not found")
        logger.info(f"Solution found: {solution}")
        return SolutionSchema(**solution)
    except Exception as e:
        logger.error(f"Error fetching solution for question {question_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/solutions/{question_id}/content")
def get_solution_content(question_id: int):
    try:
        solution = db_manager.db.solutions.find_one({"question_id": question_id})
        if not solution:
            raise HTTPException(status_code=404, detail="Solution not found")
        return {"content": solution.get("content")}
    except Exception as e:
        logger.error(f"Error fetching content for solution {question_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.api_route("/update-database", methods=["GET", "POST"])
def trigger_database_update(request: Request):
    try:
        logger.info(f"Triggering database update with base_dir: {settings.base_dir}")
        update_database(settings.base_dir)
        return {"message": "Database update triggered successfully"}
    except Exception as e:
        logger.error(f"Error triggering database update: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/test-db-connection")
async def test_db_connection():
    try:
        # Attempt to fetch one document from the questions collection
        question = db_manager.db.questions.find_one()
        if question:
            return {"status": "success", "message": "Database connection successful"}
        else:
            return {"status": "warning", "message": "Database connected, but no questions found"}
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

@router.get("/list-question-ids")
def get_questions_list(self, filters: Dict[str, Any], skip: int, limit: int):
    try:
        total = self.db.questions.count_documents(filters)
        questions = list(self.db.questions.find(filters).skip(skip).limit(limit))
        return questions, total
    except Exception as e:
        logger.error(f"Error in get_questions_list: {str(e)}")
        raise

@router.get("/questions/", response_model=Dict[str, Any])
def list_questions(
    search: Optional[str] = None,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    company: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    filters: Dict[str, Any] = {}
    if category:
        filters['category'] = category
    if difficulty:
        filters['difficulty'] = difficulty
    if company:
        filters['company'] = company

    try:
        if search:
            # Split the search query into words
            search_words = search.lower().split()
            
            # Create a regex pattern that matches any of the search words
            regex_pattern = '|'.join(map(re.escape, search_words))
            
            # Add the search filter to match against title, content, or tags
            filters['$or'] = [
                {'title': {'$regex': regex_pattern, '$options': 'i'}},
                {'content': {'$regex': regex_pattern, '$options': 'i'}},
                {'tags': {'$in': search_words}}
            ]

        questions, total = db_manager.get_questions_list(filters, skip, limit)
        if not questions:
            return {"questions": [], "total": 0, "skip": skip, "limit": limit}
        
        # Convert ObjectId to string
        questions_json = json.loads(json_util.dumps(questions))
        return {"questions": questions_json, "total": total, "skip": skip, "limit": limit}
    except Exception as e:
        logger.error(f"Error fetching questions: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/posts/", response_model=Dict[str, Any])
def list_posts_by_category(
    category: Optional[str] = None,
    subcategory: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    filters: Dict[str, Any] = {}
    if category:
        filters['category'] = category
    if subcategory:
        filters['subcategory'] = subcategory

    try:
        if search:
            # Create a regex pattern to match search keywords in post title/content
            search_words = search.lower().split()
            regex_pattern = '|'.join(map(re.escape, search_words))
            
            # Add search filter to match title or content
            filters['$or'] = [
                {'title': {'$regex': regex_pattern, '$options': 'i'}},
                {'content': {'$regex': regex_pattern, '$options': 'i'}}
            ]

        # Fetch posts based on filters, pagination applied by skip and limit
        posts, total = db_manager.get_posts_list(filters, skip, limit)
        if not posts:
            return {"posts": [], "total": 0, "skip": skip, "limit": limit}
        
        # Convert ObjectId to string for response
        posts_json = json.loads(json_util.dumps(posts))
        return {"posts": posts_json, "total": total, "skip": skip, "limit": limit}
    except Exception as e:
        logger.error(f"Error fetching posts: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


def get_posts_list(self, filters: Dict[str, Any], skip: int, limit: int):
    try:
        total = self.db.posts.count_documents(filters)
        posts = list(self.db.posts.find(filters).skip(skip).limit(limit))
        return posts, total
    except Exception as e:
        logger.error(f"Error fetching posts list: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch posts")
