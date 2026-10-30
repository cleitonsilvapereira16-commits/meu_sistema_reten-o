"use client";

import React, { useEffect, useState } from 'react';
import { RefreshCw, MessageSquare, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  health_score: number;
  faixa_risco: 'VERDE' | 'AMARELO' | 'VERMELHO';
}

export default function KanbanRetencaoPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/v1/clientes/');
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  // Classificação temporária dos clientes por coluna do Kanban
  const clientesEmAtraso = clientes.filter(c => c.faixa_risco === 'VERMELHO');
  const clientesEmContato = clientes.filter(c => c.faixa_risco === 'AMARELO');
  const clientesRetidos = clientes.filter(c => c.faixa_risco === 'VERDE');

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kanban de Retenção & Ações Preventivas</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie fluxos automatizados de recuperação e pausa preventiva</p>
        </div>
        <button 
          onClick={carregarClientes}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors text-sm font-medium shadow-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Atualizar Quadro
        </button>
      </div>

      {/* Columns do Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Coluna 1: Alto Risco / Em Atraso */}
        <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-rose-500" size={18} />
              <h2 className="font-bold text-slate-700 text-sm uppercase">Em Atraso (Risco Alto)</h2>
            </div>
            <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-xs font-bold">
              {clientesEmAtraso.length}
            </span>
          </div>

          <div className="space-y-3">
            {clientesEmAtraso.map((cliente) => (
              <div key={cliente.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 text-sm">{cliente.nome}</h3>
                  <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-xs font-bold">
                    {cliente.health_score} pts
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Tel: {cliente.telefone}</p>
                <button className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-1.5">
                  <MessageSquare size={14} /> Disparar WhatsApp Preventivo
                </button>
              </div>
            ))}

            {clientesEmAtraso.length === 0 && (
              <p className="text-xs text-center text-slate-400 py-8">Nenhum cliente em alto risco no momento.</p>
            )}
          </div>
        </div>

        {/* Coluna 2: Em Negociação / Risco Médio */}
        <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="text-amber-500" size={18} />
              <h2 className="font-bold text-slate-700 text-sm uppercase">Contato / Oferta Enviada</h2>
            </div>
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold">
              {clientesEmContato.length}
            </span>
          </div>

          <div className="space-y-3">
            {clientesEmContato.map((cliente) => (
              <div key={cliente.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 text-sm">{cliente.nome}</h3>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-xs font-bold">
                    {cliente.health_score} pts
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Aguardando escolha no WhatsApp</p>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded">Pausa 30d</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded">Prorrogar 7d</span>
                </div>
              </div>
            ))}

            {clientesEmContato.length === 0 && (
              <p className="text-xs text-center text-slate-400 py-8">Nenhum cliente aguardando resposta.</p>
            )}
          </div>
        </div>

        {/* Coluna 3: Retidos / Saudáveis */}
        <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-emerald-500" size={18} />
              <h2 className="font-bold text-slate-700 text-sm uppercase">Retidos / Em Dia</h2>
            </div>
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold">
              {clientesRetidos.length}
            </span>
          </div>

          <div className="space-y-3">
            {clientesRetidos.map((cliente) => (
              <div key={cliente.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 text-sm">{cliente.nome}</h3>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-xs font-bold">
                    {cliente.health_score} pts
                  </span>
                </div>
                <p className="text-xs text-emerald-600 font-medium">✔ Sem pendências financeiras</p>
              </div>
            ))}

            {clientesRetidos.length === 0 && (
              <p className="text-xs text-center text-slate-400 py-8">Nenhum cliente nesta categoria.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}