from fastapi import APIRouter, HTTPException, Query, Request, Depends
from typing import List, Optional, Dict, Any
from code_clarity_fastapi.app.schemas import QuestionSchema, SolutionSchema, CategorySchema
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

@router.get("/questions/", response_model=Dict[str, Any])
def list_questions(
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
        questions, total = db_manager.get_questions_list(filters, skip, limit)
        if not questions:
            return {"questions": [], "total": 0, "skip": skip, "limit": limit}
        
        # Convert ObjectId to string
        questions_json = json.loads(json_util.dumps(questions))
        return {"questions": questions_json, "total": total, "skip": skip, "limit": limit}
    except Exception as e:
        logger.error(f"Error fetching questions: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

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
async def list_question_ids():
    try:
        question_ids = list(db_manager.db.questions.distinct("question_id"))
        return {"question_ids": question_ids}
    except Exception as e:
        logger.error(f"Error listing question IDs: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")