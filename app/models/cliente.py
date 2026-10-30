import enum
from sqlalchemy import Column, String, Integer, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class FaixaRisco(str, enum.Enum):
    VERDE = "VERDE"
    AMARELO = "AMARELO"
    VERMELHO = "VERMELHO"

class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(String, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    documento = Column(String, unique=True, index=True, nullable=False)
    telefone = Column(String, nullable=False)
    health_score = Column(Integer, default=100)
    faixa_risco = Column(Enum(FaixaRisco), default=FaixaRisco.VERDE)
    ultimo_acesso = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    faturas = relationship("Fatura", back_populates="cliente")