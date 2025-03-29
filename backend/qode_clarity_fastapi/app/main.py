"""
Main application module for Qode Clarity API.
This module initializes the FastAPI application and sets up routes.
"""
import logging
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Local imports
from qode_clarity_fastapi.app.routes import router, initialize
from qode_clarity_fastapi.app.file_manager import FileManager, FirestoreManager, QuestionManager, update_database
from qode_clarity_fastapi.settings import settings

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version,
    # Update OpenAPI URL paths to include /api prefix
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Configure CORS
origins = settings.allowed_origins or [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:8000",
    "https://clarity.insitechinternational.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
    expose_headers=["*"],
    max_age=3600,
)

# Ensure base_dir is properly set
base_dir = Path(__file__).parent.parent.parent
settings.base_dir = base_dir

# Initialize managers
file_manager = FileManager()
firestore_manager = FirestoreManager()
question_manager = QuestionManager(firestore_manager, file_manager, base_dir)

# Initialize the managers in the routes
initialize(question_manager, firestore_manager, file_manager)

# Include the router with the /api prefix
app.include_router(router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    """Initialize the application on startup."""
    logger.info(f"Starting up the application from {base_dir}")
    try:
        # Verify Firestore connection
        firestore_db = firestore_manager.db
        firestore_db.collection('questions').limit(1).get()
        logger.info("Firestore connection verified")
        
        # Update database from files
        await update_database(base_dir)
        logger.info("Database update completed successfully")
        
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}", exc_info=True)
        # Don't raise the exception - log it and continue startup
        # This allows the app to start even if there are data issues

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
        log_level="info",
    )