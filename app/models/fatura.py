import enum
from sqlalchemy import Column, String, Float, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class StatusFatura(str, enum.Enum):
    PENDENTE = "PENDENTE"
    PAGO = "PAGO"
    PAUSADO_PREVENTIVO = "PAUSADO_PREVENTIVO"
    CANCELADO = "CANCELADO"

class Fatura(Base):
    __tablename__ = "faturas"

    id = Column(String, primary_key=True, index=True)
    cliente_id = Column(String, ForeignKey("clientes.id"), nullable=False)
    valor = Column(Float, nullable=False)
    data_vencimento = Column(DateTime, nullable=False)
    status = Column(Enum(StatusFatura), default=StatusFatura.PENDENTE)
    created_at = Column(DateTime, default=datetime.utcnow)

    cliente = relationship("Cliente", back_populates="faturas")