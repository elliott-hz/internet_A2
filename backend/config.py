"""
Application Configuration
Environment variables and settings
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application
    APP_NAME: str = "Internet A2 Shopping Cart"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = True
    
    # Database - SQLite Configuration
    DATABASE_TYPE: str = "sqlite"  # Options: "sqlite" or "mysql"
    
    # MySQL Configuration (only needed if DATABASE_TYPE is "mysql")
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: int = 3306
    DATABASE_NAME: str = "internet_a2"
    DATABASE_USER: str = "root"
    DATABASE_PASSWORD: str = ""
    
    # JWT Authentication
    SECRET_KEY: str = "your-super-secret-key-change-in-production-2024-internet-a2"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    @property
    def database_url(self) -> str:
        """Construct database URL based on type"""
        if self.DATABASE_TYPE == "sqlite":
            # Use SQLite for development (no installation required)
            # Database file will be created in root_path/database/internet_a2.db
            db_dir = os.path.join(os.path.dirname(__file__), "..", "database")
            # Ensure directory exists
            os.makedirs(db_dir, exist_ok=True)
            db_path = os.path.join(db_dir, "internet_a2.db")
            return f"sqlite:///{db_path}"
        else:
            # MySQL connection string
            return (
                f"mysql+pymysql://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}"
                f"@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
            )

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
