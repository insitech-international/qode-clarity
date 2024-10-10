# from fastapi import APIRouter, HTTPException, Query, Request, Depends
# from typing import List, Optional, Dict, Any
# from code_clarity_fastapi.app.schemas import QuestionSchema, SolutionSchema, CategorySchema
# from code_clarity_fastapi.app.file_manager import update_database, DatabaseManager, FileManager, QuestionManager
# from code_clarity_fastapi.settings import settings
# import logging

# router = APIRouter()
# logger = logging.getLogger(__name__)

# # Global managers to be initialized
# question_manager = None
# db_manager = None

# def initialize(qm: QuestionManager, dbm: DatabaseManager):
#     global question_manager, db_manager
#     question_manager = qm
#     db_manager = dbm


# # Question routes
# @router.get("/questions/", response_model=List[QuestionSchema])
# def list_questions(
#     category: Optional[str] = None,
#     difficulty: Optional[str] = None,
#     company: Optional[str] = None,
#     skip: int = Query(0, ge=0),
#     limit: int = Query(10, ge=1, le=100)
# ):
#     filters: Dict[str, Any] = {}

#     if category:
#         filters['category'] = category
#     if difficulty:
#         filters['difficulty'] = difficulty
#     if company:
#         filters['company'] = company

#     try:
#         questions, total = db_manager.get_questions_list(filters, skip, limit)
#         if not questions:
#             raise HTTPException(status_code=404, detail="No questions found")
#     except Exception as e:
#         logger.error(f"Error fetching questions: {str(e)}")
#         raise HTTPException(status_code=500, detail="Internal server error")
    
#     return {"questions": questions, "total": total, "skip": skip, "limit": limit}


# @router.get("/questions/{question_id}", response_model=QuestionSchema)
# def get_question(question_id: str):
#     try:
#         question = question_manager.get_question(question_id)
#         if not question:
#             raise HTTPException(status_code=404, detail="Question not found")
#         return question
#     except Exception as e:
#         logger.error(f"Error fetching question {question_id}: {str(e)}")
#         raise HTTPException(status_code=500, detail="Internal server error")


# @router.get("/featured_questions/")
# def featured_questions():
#     try:
#         categories = db_manager.get_categories()
#         featured_questions = {}

#         for category in categories:
#             questions, _ = db_manager.get_questions_list({"category": category['_id']}, limit=6)
#             featured_questions[category['_id']] = questions
        
#         return featured_questions
#     except Exception as e:
#         logger.error(f"Error fetching featured questions: {str(e)}")
#         raise HTTPException(status_code=500, detail="Internal server error")


# @router.get("/questions/{question_id}/content")
# def get_question_content(question_id: str):
#     try:
#         question = question_manager.get_question(question_id)
#         if not question:
#             raise HTTPException(status_code=404, detail="Question not found")
#         return {"content": question.get("content")}
#     except Exception as e:
#         logger.error(f"Error fetching content for question {question_id}: {str(e)}")
#         raise HTTPException(status_code=500, detail="Internal server error")


# # Solution routes
# @router.get("/solutions/{question_id}", response_model=SolutionSchema)
# def get_solution(question_id: str):
#     try:
#         solution = question_manager.get_solution(question_id)
#         if not solution:
#             raise HTTPException(status_code=404, detail="Solution not found")
#         return solution
#     except Exception as e:
#         logger.error(f"Error fetching solution for question {question_id}: {str(e)}")
#         raise HTTPException(status_code=500, detail="Internal server error")


# @router.get("/solutions/{question_id}/content")
# def get_solution_content(question_id: str):
#     try:
#         solution = question_manager.get_solution(question_id)
#         if not solution:
#             raise HTTPException(status_code=404, detail="Solution not found")
#         return {"content": solution.get("content")}
#     except Exception as e:
#         logger.error(f"Error fetching content for solution {question_id}: {str(e)}")
#         raise HTTPException(status_code=500, detail="Internal server error")


# # Category routes
# @router.get("/categories/", response_model=List[CategorySchema])
# def list_categories(
#     skip: int = Query(0, ge=0),
#     limit: int = Query(10, ge=1, le=100)
# ):
#     try:
#         categories = db_manager.get_categories()
#         return categories[skip:skip + limit]
#     except Exception as e:
#         logger.error(f"Error fetching categories: {str(e)}")
#         raise HTTPException(status_code=500, detail="Internal server error")


# # Endpoint to trigger database update
# @router.api_route("/update-database", methods=["GET", "POST"])
# def trigger_database_update(request: Request):
#     try:
#         logger.info(f"Triggering database update with base_dir: {settings.base_dir}")
#         update_database(settings.base_dir)
#         return {"message": "Database update triggered successfully"}
#     except Exception as e:
#         logger.error(f"Error triggering database update: {str(e)}")
#         raise HTTPException(status_code=500, detail="Internal server error")

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from bson import ObjectId
from code_clarity_fastapi.app.schemas import QuestionSchema, SolutionSchema, CategorySchema
from code_clarity_fastapi.app.models import Question, Solution, Category

router = APIRouter()

@router.get("/questions/{question_id}", response_model=QuestionSchema)
async def get_question(question_id: int):
    question = Question.collection.find_one({"question_id": question_id})
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.get("/questions", response_model=List[QuestionSchema])
async def get_questions(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    difficulty: Optional[str] = None
):
    query = {}
    if category:
        query["category"] = category
    if difficulty:
        query["difficulty"] = difficulty

    questions = list(Question.collection.find(query).skip(skip).limit(limit))
    return questions

@router.get("/solutions/{question_id}", response_model=SolutionSchema)
async def get_solution(question_id: int):
    solution = Solution.collection.find_one({"question_id": question_id})
    if solution is None:
        raise HTTPException(status_code=404, detail="Solution not found")
    return solution

@router.get("/categories", response_model=List[CategorySchema])
async def get_categories():
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$project": {"name": "$_id", "count": 1, "_id": 0}}
    ]
    categories = list(Question.collection.aggregate(pipeline))
    return categories

@router.get("/search", response_model=List[QuestionSchema])
async def search_questions(
    q: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    query = {"$text": {"$search": q}}
    questions = list(Question.collection.find(query).skip(skip).limit(limit))
    return questions