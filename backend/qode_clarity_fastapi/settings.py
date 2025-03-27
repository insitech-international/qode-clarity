"""
Settings module for Qode Clarity.
This module provides application configuration from environment variables.
"""
import enum
import os
from functools import lru_cache
from pathlib import Path
from typing import Optional, List, Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Environment(str, enum.Enum):
    """Possible environment types."""
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
    
    @classmethod
    def from_string(cls, value: str) -> "Environment":
        """Convert various string formats to valid environment enum."""
        value_map = {
            "dev": cls.DEVELOPMENT,
            "development": cls.DEVELOPMENT,
            "stage": cls.STAGING,
            "staging": cls.STAGING,
            "prod": cls.PRODUCTION,
            "production": cls.PRODUCTION
        }
        normalized = value.lower().strip()
        if normalized not in value_map:
            raise ValueError(
                f"Invalid environment '{value}'. Must be one of: {', '.join(value_map.keys())}"
            )
        return value_map[normalized]

class Settings:
    """Application settings."""
    
    # Environment Settings
    environment: Environment = Environment.from_string(os.getenv("QODE_CLARITY_ENVIRONMENT", "development"))
    debug: bool = os.getenv("QODE_CLARITY_DEBUG", "true").lower() == "true"
    base_dir: Optional[Path] = None
    app_name: str = "Qode Clarity API"
    app_version: str = "1.0.0"
    app_description: str = "API for coding questions and solutions"
    
    # API Settings
    host: str = os.getenv("QODE_CLARITY_HOST", "127.0.0.1")
    port: int = int(os.getenv("QODE_CLARITY_PORT", "8000"))
    workers_count: int = int(os.getenv("QODE_CLARITY_WORKERS_COUNT", "1"))
    reload: bool = os.getenv("QODE_CLARITY_RELOAD", "false").lower() == "true"
    
    # Firestore Settings
    firebase_project_id: str = os.getenv("QODE_CLARITY_FIREBASE_PROJECT_ID", "")
    firebase_credentials_path: str = os.getenv("QODE_CLARITY_FIREBASE_CREDENTIALS_PATH", "firebase-key.json")
    use_firebase_emulator: bool = os.getenv("QODE_CLARITY_USE_FIREBASE_EMULATOR", "false").lower() == "true"
    firebase_emulator_host: str = os.getenv("QODE_CLARITY_FIREBASE_EMULATOR_HOST", "localhost")
    firestore_emulator_port: int = int(os.getenv("QODE_CLARITY_FIRESTORE_EMULATOR_PORT", "8080"))
    
    # GCP Settings
    gcp_project_id: str = os.getenv("QODE_CLARITY_GCP_PROJECT_ID", "")
    
    # CORS Settings
    allowed_origins: List[str] = os.getenv("QODE_CLARITY_ALLOWED_ORIGINS", "").split(",") if os.getenv("QODE_CLARITY_ALLOWED_ORIGINS") else []
    
    # Cache Configuration
    cache_ttl: int = int(os.getenv("QODE_CLARITY_CACHE_TTL", "3600"))
    enable_cache: bool = os.getenv("QODE_CLARITY_ENABLE_CACHE", "true").lower() == "true"
    
    # Feature Flags
    enable_real_time_updates: bool = os.getenv("QODE_CLARITY_ENABLE_REAL_TIME_UPDATES", "false").lower() == "true"
    enable_offline_support: bool = os.getenv("QODE_CLARITY_ENABLE_OFFLINE_SUPPORT", "false").lower() == "true"
    
    def __init__(self):
        """Initialize settings with environment-specific overrides."""
        self._set_base_dir()
        self._set_debug_mode()
        self._validate_settings()

    def _set_base_dir(self) -> None:
        """Set the base directory for the application."""
        if self.base_dir is None:
            current_file = Path(__file__)
            project_root = current_file.parent.parent
            self.base_dir = project_root

    def _set_debug_mode(self) -> None:
        """Set debug mode based on environment."""
        if self.environment == Environment.PRODUCTION:
            self.debug = False
            self.reload = False

    def _validate_settings(self) -> None:
        """Validate critical settings."""
        if self.environment == Environment.PRODUCTION:
            if not self.firebase_project_id and not self.gcp_project_id:
                logger.warning("No Firebase or GCP project ID set for production")
                
            if not self.allowed_origins:
                logger.warning("No allowed origins set for CORS in production")

@lru_cache()
def get_settings() -> Settings:
    """Create cached instance of settings."""
    return Settings()

settings = get_settings()