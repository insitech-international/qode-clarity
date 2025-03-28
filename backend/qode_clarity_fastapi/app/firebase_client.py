"""
Firebase and Firestore client for Qode Clarity.
This module handles connections and operations with Firebase services.
"""
import os
import logging
import firebase_admin
from firebase_admin import credentials, firestore
from firebase_admin import auth as firebase_auth

# Configure logging
logger = logging.getLogger(__name__)

# Initialize Firebase
firebase_app = None
firestore_client = None

def get_firebase_app():
    """
    Initialize and return the Firebase app instance.
    Uses service account credentials file specified in environment variable or default path.
    """
    global firebase_app

    if firebase_app is None:
        try:
            # Get environment variables
            cred_path = os.environ.get("QODE_CLARITY_FIREBASE_CREDENTIALS_PATH", "firebase-key.json")
            project_id = os.environ.get("QODE_CLARITY_FIREBASE_PROJECT_ID")
            use_emulator = os.environ.get("QODE_CLARITY_USE_FIREBASE_EMULATOR", "false").lower() == "true"

            # Initialize Firebase app
            if os.path.exists(cred_path):
                # Using service account credentials file
                cred = credentials.Certificate(cred_path)
                firebase_app = firebase_admin.initialize_app(cred, {
                    'projectId': project_id,
                })
                logger.info(f"Firebase initialized with service account credentials from {cred_path}")
            else:
                # For production in GCP, which uses Application Default Credentials
                firebase_app = firebase_admin.initialize_app(options={
                    'projectId': project_id,
                })
                logger.info("Firebase initialized with application default credentials")

            # Configure Firebase emulator if enabled
            if use_emulator:
                emulator_host = os.environ.get("QODE_CLARITY_FIREBASE_EMULATOR_HOST", "localhost")
                firestore_port = os.environ.get("QODE_CLARITY_FIRESTORE_EMULATOR_PORT", "8090")

                os.environ["FIRESTORE_EMULATOR_HOST"] = f"{emulator_host}:{firestore_port}"
                logger.info(f"Using Firestore emulator at {emulator_host}:{firestore_port}")

        except Exception as e:
            logger.error(f"Error initializing Firebase: {str(e)}")
            raise

    return firebase_app

def get_firestore_client():
    """
    Get the Firestore client instance.
    Initializes Firebase app if not already initialized.

    Returns:
        The Firestore client instance
    """
    global firestore_client

    if firestore_client is None:
        try:
            # Ensure Firebase is initialized
            get_firebase_app()

            # Get Firestore client - removed database parameter which was causing errors
            firestore_client = firestore.client()

            # Enable offline persistence if configured
            enable_offline = os.environ.get("QODE_CLARITY_ENABLE_OFFLINE_SUPPORT", "false").lower() == "true"
            if enable_offline:
                # This is likely not supported in the way it was implemented
                # Instead, log a message about the feature
                logger.info("Offline persistence requested but may not be supported in this client library version")
                
        except Exception as e:
            logger.error(f"Error getting Firestore client: {str(e)}")
            raise
    
    return firestore_client

def get_auth_client():
    """
    Get the Firebase Auth client.
    Initializes Firebase app if not already initialized.
    
    Returns:
        The Firebase Auth client
    """
    # Ensure Firebase is initialized
    get_firebase_app()
    return firebase_auth

def collection_reference(collection_name: str):
    """
    Get a reference to a Firestore collection.
    
    Args:
        collection_name: Name of the collection
        
    Returns:
        CollectionReference: Firestore collection reference
    """
    client = get_firestore_client()
    return client.collection(collection_name)

def document_reference(collection_name: str, document_id: str):
    """
    Get a reference to a Firestore document.
    
    Args:
        collection_name: Name of the collection
        document_id: ID of the document
        
    Returns:
        DocumentReference: Firestore document reference
    """
    client = get_firestore_client()
    return client.collection(collection_name).document(document_id)