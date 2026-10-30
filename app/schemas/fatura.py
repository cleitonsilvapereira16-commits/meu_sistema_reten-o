from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.fatura import StatusFatura

# Dados para emitir uma nova fatura
class FaturaCreate(BaseModel):
    id: str
    cliente_id: str
    valor: float
    data_vencimento: datetime

# Resposta da API ao consultar faturas
class FaturaResponse(BaseModel):
    id: str
    cliente_id: str
    valor: float
    data_vencimento: datetime
    status: StatusFatura
    created_at: datetime

    class Config:
        from_attributes = True

# Schema para atualização de status da fatura
class FaturaUpdateStatus(BaseModel):
    status: StatusFatura