from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.cliente import Cliente
from app.schemas.cliente import ClienteCreate, ClienteResponse

router = APIRouter()

@router.post("/", response_model=ClienteResponse, status_code=status.HTTP_201_CREATED)
def criar_cliente(cliente_in: ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = db.query(Cliente).filter(Cliente.id == cliente_in.id).first()
    if db_cliente:
        raise HTTPException(status_code=400, detail="Cliente com este ID já existe.")
    
    novo_cliente = Cliente(
        id=cliente_in.id,
        nome=cliente_in.nome,
        documento=cliente_in.documento,
        telefone=cliente_in.telefone
    )
    db.add(novo_cliente)
    db.commit()
    db.refresh(novo_cliente)
    return novo_cliente

@router.get("/", response_model=List[ClienteResponse])
def listar_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clientes = db.query(Cliente).offset(skip).limit(limit).all()
    return clientes