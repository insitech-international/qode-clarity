"""
API routes for Qode Clarity.
This module defines all FastAPI routes for the application.
"""
import re
import logging
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query, Request, Depends
from google.cloud import firestore

# Local imports
from qode_clarity_fastapi.app.firebase_client import get_firestore_client
from qode_clarity_fastapi.app.file_manager import (
    FileManager, 
    FirestoreManager, 
    QuestionManager, 
    update_database
)
from qode_clarity_fastapi.app.schemas import QuestionSchema, SolutionSchema, CategorySchema
from qode_clarity_fastapi.settings import settings

# Set up logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Global managers to be initialized
question_manager = None
firestore_manager = None
file_manager = None
db = None

def initialize(qm: QuestionManager, fm: FirestoreManager, fl: FileManager):
    """Initialize the global managers."""
    global question_manager, firestore_manager, file_manager, db
    question_manager = qm
    firestore_manager = fm
    file_manager = fl
    db = get_firestore_client()

@router.get("/")
async def root():
    """Root endpoint that provides API information."""
    return {
        "status": "online",
        "version": settings.app_version,
        "endpoints": {
            "categories": "/categories/",
            "questions": "/questions/",
            "solutions": "/solutions/{question_id}",
            "featured": "/featured_questions/"
        }
    }

@router.get("/categories/")
async def list_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    """List all categories."""
    try:
        if not firestore_manager:
            raise HTTPException(
                status_code=500,
                detail="Firestore manager not initialized"
            )

        # Get categories from Firestore
        categories_ref = db.collection('categories')
        query = categories_ref.order_by('name').offset(skip).limit(limit)
        
        # Execute query
        categories = []
        for doc in query.stream():
            category_data = doc.to_dict()
            categories.append(CategorySchema(
                id=doc.id,
                name=category_data.get('name', ''),
                count=category_data.get('questionCount', 0)
            ))
            
        return categories
        
    except Exception as e:
        logger.error(f"Error fetching categories: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/featured_questions/")
async def featured_questions():
    """Get featured questions for each category."""
    try:
        # Get all categories
        categories_ref = db.collection('categories')
        categories_docs = categories_ref.stream()
        
        # Create map of category name to featured questions
        featured_questions = {}
        
        for cat_doc in categories_docs:
            category_data = cat_doc.to_dict()
            category_name = category_data.get('name')
            
            if not category_name:
                continue
                
            # Get questions for this category (limit 6)
            questions_ref = db.collection('questions')
            query = questions_ref.where('category', '==', category_name).limit(6)
            questions = []
            
            for question_doc in query.stream():
                question_data = question_doc.to_dict()
                question_data['id'] = question_doc.id
                questions.append(QuestionSchema(**question_data))
            
            # Only add categories with questions
            if questions:
                featured_questions[category_name] = questions
                
        return featured_questions
        
    except Exception as e:
        logger.error(f"Error fetching featured questions: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/questions/", response_model=Dict[str, Any])
async def list_questions(
    search: Optional[str] = None,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    """List questions with optional filtering."""
    try:
        # Build query
        questions_ref = db.collection('questions')
        query = questions_ref
        
        # Apply filters
        if category:
            query = query.where('category', '==', category)
            
        if difficulty:
            query = query.where('difficulty', '==', difficulty)
            
        # Note: Full-text search isn't directly supported in Firestore
        # For basic search, we'll need to implement it on the client side
        # or use a service like Algolia

        # Get total count (inefficient but necessary for pagination)
        # In a production app, consider using a counter document
        all_docs = query.stream()
        filtered_docs = []
        
        # Apply search filter manually (if needed)
        if search:
            search_lower = search.lower()
            for doc in all_docs:
                data = doc.to_dict()
                
                # Check title, content, tags
                if (search_lower in data.get('title', '').lower() or
                    search_lower in data.get('content', '').lower() or
                    any(search_lower in tag.lower() for tag in data.get('tags', []))):
                    filtered_docs.append(doc)
        else:
            filtered_docs = list(all_docs)
            
        # Apply pagination
        total = len(filtered_docs)
        paginated_docs = filtered_docs[skip:skip+limit]
        
        # Convert to schemas
        questions = []
        for doc in paginated_docs:
            data = doc.to_dict()
            data['id'] = doc.id
            questions.append(QuestionSchema(**data))
            
        return {
            "questions": questions,
            "total": total,
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        logger.error(f"Error fetching questions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/questions/{question_id}", response_model=QuestionSchema)
async def get_question(question_id: int):
    """Get a specific question by ID."""
    try:
        # Get question from Firestore
        doc_ref = db.collection('questions').document(str(question_id))
        doc = doc_ref.get()
        
        if not doc.exists:
            logger.warning(f"Question not found in Firestore: {question_id}")
            raise HTTPException(status_code=404, detail="Question not found")
        
        # Convert to schema
        question_data = doc.to_dict()
        question_data['id'] = doc.id
        
        return QuestionSchema(**question_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching question {question_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/questions/{question_id}/content")
async def get_question_content(question_id: int):
    """Get only the content field of a question."""
    try:
        # Get question from Firestore
        doc_ref = db.collection('questions').document(str(question_id))
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Question not found")
            
        question_data = doc.to_dict()
        return {"content": question_data.get("content", "")}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching content for question {question_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/solutions/{question_id}", response_model=SolutionSchema)
async def get_solution(question_id: int):
    """Get a solution for a specific question."""
    try:
        # Get solution from Firestore
        doc_ref = db.collection('solutions').document(str(question_id))
        doc = doc_ref.get()
        
        if not doc.exists:
            logger.warning(f"Solution not found in Firestore for question ID: {question_id}")
            raise HTTPException(status_code=404, detail="Solution not found")
        
        # Convert to schema
        solution_data = doc.to_dict()
        solution_data['id'] = doc.id
        
        return SolutionSchema(**solution_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching solution for question {question_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/test-db-connection")
async def test_db_connection():
    """Test Firestore connection."""
    try:
        # Simple query to test connection
        doc = db.collection('questions').limit(1).get()
        return {
            "status": "success", 
            "message": "Firestore connection successful",
            "documents_found": len(list(doc)) > 0
        }
    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

@router.api_route("/update-database", methods=["GET", "POST"])
async def trigger_database_update(request: Request):
    """Manually trigger a database update from files."""
    try:
        if not question_manager:
            raise HTTPException(
                status_code=500,
                detail="Question manager not initialized"
            )

        logger.info(f"Triggering database update with base_dir: {settings.base_dir}")
        
        # Get current document count before update
        pre_update_count = 0
        questions_docs = db.collection('questions').stream()
        for _ in questions_docs:
            pre_update_count += 1
            
        logger.info(f"Pre-update document count: {pre_update_count}")
        
        # Perform the database update
        try:
            await update_database(settings.base_dir)
        except Exception as update_error:
            logger.error(f"Error during update_database call: {str(update_error)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to update database: {str(update_error)}"
            )
        
        # Get document count after update
        post_update_count = 0
        questions_docs = db.collection('questions').stream()
        for _ in questions_docs:
            post_update_count += 1
            
        logger.info(f"Post-update document count: {post_update_count}")
        
        # Compare counts to determine if update occurred
        return {
            "message": "Database updated successfully",
            "status": "success",
            "previous_count": pre_update_count,
            "current_count": post_update_count,
            "documents_difference": post_update_count - pre_update_count
        }
            
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error during database update: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Database update failed: {str(e)}"
        )