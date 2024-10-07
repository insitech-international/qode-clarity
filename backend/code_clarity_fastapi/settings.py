import enum
from pathlib import Path
from tempfile import gettempdir
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict

TEMP_DIR = Path(gettempdir())

class LogLevel(str, enum.Enum):
    """Possible log levels."""

    NOTSET = "NOTSET"
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    FATAL = "FATAL"

class Settings(BaseSettings):
    """
    Application settings.

    These parameters can be configured
    with environment variables.
    """

    host: str = "127.0.0.1"
    port: int = 8000
    workers_count: int = 1
    reload: bool = False

    environment: str = "dev"

    log_level: LogLevel = LogLevel.INFO
    
    db_host: str = "localhost"
    db_port: int = 27017
    db_user: Optional[str] = None
    db_pass: Optional[str] = None
    db_base: str = "code-clarity-db"
    db_auth_source: Optional[str] = None
    db_echo: bool = False

    base_dir: Optional[str] = None

    @property
    def db_url(self) -> str:
        """
        Assemble database URL from settings.

        :return: database URL.
        """
        if self.db_user and self.db_pass:
            return f"mongodb://{self.db_user}:{self.db_pass}@{self.db_host}:{self.db_port}/{self.db_base}"
        else:
            return f"mongodb://{self.db_host}:{self.db_port}/{self.db_base}"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="CODE_CLARITY_",
        env_file_encoding="utf-8",
    )

settings = Settings()