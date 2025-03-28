# repositories/question_repository.py
from firebase_admin import firestore
from models.question import Question
from backend.qode_clarity_fastapi.app.firebase_client import get_firestore_client
import logging

logger = logging.getLogger(__name__)

class QuestionRepository:
    def __init__(self):
        self.db = get_firestore_client()
        self.collection = self.db.collection('questions')
    
    async def get_all(self, limit=100, category=None):
        try:
            query = self.collection.limit(limit)
            
            if category:
                query = query.where('categoryPath', '==', category)
                
            docs = query.stream()
            questions = []
            
            for doc in docs:
                data = doc.to_dict()
                data['id'] = doc.id
                questions.append(Question(**data))
                
            return questions
        except Exception as e:
            logger.error(f"Error retrieving questions: {e}")
            raise
    
    async def get_by_id(self, question_id: str):
        try:
            doc = self.collection.document(question_id).get()
            
            if not doc.exists:
                return None
                
            data = doc.to_dict()
            data['id'] = doc.id
            return Question(**data)
        except Exception as e:
            logger.error(f"Error retrieving question {question_id}: {e}")
            raise
    
    async def create(self, question: Question):
        try:
            question_dict = question.dict(exclude={'id'})
            question_dict['createdAt'] = firestore.SERVER_TIMESTAMP
            
            # If ID is provided, use it, otherwise let Firestore generate one
            if question.id:
                doc_ref = self.collection.document(question.id)
            else:
                doc_ref = self.collection.document()
                
            doc_ref.set(question_dict)
            
            created = await self.get_by_id(doc_ref.id)
            return created
        except Exception as e:
            logger.error(f"Error creating question: {e}")
            raise
    
    async def update(self, question_id: str, question_data: dict):
        try:
            # Remove id from update data
            if 'id' in question_data:
                del question_data['id']
                
            question_data['updatedAt'] = firestore.SERVER_TIMESTAMP
            
            doc_ref = self.collection.document(question_id)
            doc_ref.update(question_data)
            
            updated = await self.get_by_id(question_id)
            return updated
        except Exception as e:
            logger.error(f"Error updating question {question_id}: {e}")
            raise
    
    async def delete(self, question_id: str):
        try:
            doc_ref = self.collection.document(question_id)
            doc_ref.delete()
            return True
        except Exception as e:
            logger.error(f"Error deleting question {question_id}: {e}")
            raise