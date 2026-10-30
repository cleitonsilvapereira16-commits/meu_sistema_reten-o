import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sistema Proprietário de Retenção e Health Score"
    API_V1_STR: str = "/api/v1"
    
    # Usando SQLite localmente (não exige Docker)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./retencao.db"
    )

    class Config:
        case_sensitive = True

settings = Settings()