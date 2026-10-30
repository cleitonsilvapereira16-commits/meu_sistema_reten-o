from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.fatura import Fatura, StatusFatura
from app.models.cliente import Cliente
from app.schemas.fatura import FaturaCreate, FaturaResponse, FaturaUpdateStatus
from app.services.health_score import recalcular_health_score_cliente

router = APIRouter()

@router.post("/", response_model=FaturaResponse, status_code=status.HTTP_201_CREATED)
def criar_fatura(fatura_in: FaturaCreate, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == fatura_in.cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")

    nova_fatura = Fatura(
        id=fatura_in.id,
        cliente_id=fatura_in.cliente_id,
        valor=fatura_in.valor,
        data_vencimento=fatura_in.data_vencimento
    )
    db.add(nova_fatura)
    db.commit()
    db.refresh(nova_fatura)

    # Recalcula o score após gerar nova fatura
    recalcular_health_score_cliente(fatura_in.cliente_id, db)

    return nova_fatura

@router.get("/cliente/{cliente_id}", response_model=List[FaturaResponse])
def listar_faturas_cliente(cliente_id: str, db: Session = Depends(get_db)):
    faturas = db.query(Fatura).filter(Fatura.cliente_id == cliente_id).all()
    return faturas

@router.patch("/{fatura_id}/status", response_model=FaturaResponse)
def atualizar_status_fatura(fatura_id: str, status_in: FaturaUpdateStatus, db: Session = Depends(get_db)):
    fatura = db.query(Fatura).filter(Fatura.id == fatura_id).first()
    if not fatura:
        raise HTTPException(status_code=404, detail="Fatura não encontrada.")

    fatura.status = status_in.status
    db.commit()
    db.refresh(fatura)

    # Recalcula o Health Score do cliente ao baixar/alterar a fatura
    recalcular_health_score_cliente(fatura.cliente_id, db)

    return fatura