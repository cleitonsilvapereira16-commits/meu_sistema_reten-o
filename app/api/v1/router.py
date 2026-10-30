from fastapi import APIRouter
from app.api.v1.endpoints import clientes, faturas, webhooks

api_router = APIRouter()
api_router.include_router(clientes.router, prefix="/clientes", tags=["Clientes"])
api_router.include_router(faturas.router, prefix="/faturas", tags=["Faturas"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["Webhooks"])