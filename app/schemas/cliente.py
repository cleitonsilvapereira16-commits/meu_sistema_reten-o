from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.cliente import FaixaRisco

# Dados necessários para criar um cliente
class ClienteCreate(BaseModel):
    id: str
    nome: str
    documento: str
    telefone: str

# Dados retornados pela API
class ClienteResponse(BaseModel):
    id: str
    nome: str
    documento: str
    telefone: str
    health_score: int
    faixa_risco: FaixaRisco
    ultimo_acesso: datetime
    created_at: datetime

    class Config:
        from_attributes = True