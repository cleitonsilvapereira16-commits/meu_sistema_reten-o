import httpx
from app.core.config import settings

# Exemplo de envio de mensagem interativa com botões via WhatsApp Cloud API
async def enviar_mensagem_retencao(telefone: str, nome_cliente: str, valor: float, link_pix: str):
    url = f"https://graph.facebook.com/v18.0/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
    
    headers = {
        "Authorization": f"Bearer {settings.WHATSAPP_API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "messaging_product": "whatsapp",
        "to": telefone,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {
                "text": f"Olá, {nome_cliente}! Identificamos um imprevisto na sua fatura de R$ {valor:.2f}.\n\nPara evitar a interrupção da sua internet, como prefere resolver?"
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "btn_pausa_30d",
                            "title": "Pausar 30 dias"
                        }
                    },
                    {
                        "type": "reply",
                        "reply": {
                            "id": "btn_prorrogar_7d",
                            "title": "Prorrogar 7 dias"
                        }
                    }
                ]
            }
        }
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        return response.json()