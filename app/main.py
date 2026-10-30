from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.models import cliente, fatura
from app.api.v1.router import api_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema Proprietário de Retenção e Health Score",
    version="1.0.0"
)

# Configuração de CORS para autorizar o Frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def health_check():
    return {
        "status": "online", 
        "database": "SQLite (Local)",
        "system": "Retenção SaaS Python"
    }