from fastapi import APIRouter, Request, Query, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.fatura import Fatura, StatusFatura
from app.services.health_score import recalcular_health_score_cliente

router = APIRouter()

# Validação inicial do Webhook exigida pela Meta
@router.get("/whatsapp")
def verificar_webhook(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_token: str = Query(None, alias="hub.verify_token"),
    hub_challenge: str = Query(None, alias="hub.challenge")
):
    VERIFY_TOKEN = "meu_token_secreto_retencao"
    if hub_mode == "subscribe" and hub_token == VERIFY_TOKEN:
        return int(hub_challenge)
    raise HTTPException(status_code=403, detail="Token de verificação inválido.")

# Processamento de respostas recebidas do cliente
@router.post("/whatsapp")
async def receber_mensagem_whatsapp(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    
    try:
        entry = data["entry"][0]["changes"][0]["value"]
        if "messages" in entry:
            mensagem = entry["messages"][0]
            telefone_remetente = mensagem["from"]
            
            # Se o cliente respondeu clicando em um botão interativo
            if mensagem.type == "interactive":
                button_id = mensagem["interactive"]["button_reply"]["id"]
                
                # Regra de negócio: Pausa Inteligente
                if button_id == "btn_pausa_30d":
                    # Lógica para pausar contrato/fatura
                    pass
                elif button_id == "btn_prorrogar_7d":
                    # Lógica para alterar vencimento
                    pass

    except KeyError:
        pass

    return {"status": "success"}