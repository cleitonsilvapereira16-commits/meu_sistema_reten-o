from datetime import datetime
from sqlalchemy.orm import Session
from app.models.cliente import Cliente, FaixaRisco
from app.models.fatura import Fatura, StatusFatura

def recalcular_health_score_cliente(cliente_id: str, db: Session) -> Cliente:
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        return None

    # Busca faturas pendentes e verifica dias de atraso
    faturas_pendentes = db.query(Fatura).filter(
        Fatura.cliente_id == cliente_id,
        Fatura.status == StatusFatura.PENDENTE
    ).all()

    score = 100
    hoje = datetime.utcnow()

    total_dias_atraso = 0
    for fatura in faturas_pendentes:
        if hoje > fatura.data_vencimento:
            atraso = (hoje - fatura.data_vencimento).days
            total_dias_atraso += atraso

    # Penalização: -10 pontos por cada dia de atraso acumulado
    score -= (total_dias_atraso * 10)

    # Limites entre 0 e 100
    score = max(0, min(100, score))

    # Atualiza a Faixa de Risco
    if score >= 80:
        faixa = FaixaRisco.VERDE
    elif score >= 50:
        faixa = FaixaRisco.AMARELO
    else:
        faixa = FaixaRisco.VERMELHO

    cliente.health_score = score
    cliente.faixa_risco = faixa

    db.commit()
    db.refresh(cliente)
    return cliente