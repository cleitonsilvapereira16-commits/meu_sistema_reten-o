'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  FolderKanban, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Users,
  DollarSign,
  Kanban
} from 'lucide-react';

interface Cliente {
  id: number;
  nome: string;
  email: string;
  health_score: number;
  faixa_risco: 'VERDE' | 'AMARELO' | 'VERMELHO';
}

export default function DashboardPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      // Utiliza a variável de ambiente se existir, caso contrário usa o localhost para desenvolvimento
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await axios.get(`${API_URL}/api/v1/clientes/`);
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao carregar clientes do backend:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      {/* Cabeçalho */}
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-emerald-400" />
          <h1 className="text-2xl font-bold tracking-tight">Painel de Retenção e Clientes</h1>
        </div>
        <button 
          onClick={carregarClientes}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar Dados
        </button>
      </header>

      {/* Cards de Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Total de Clientes</p>
            <h3 className="text-3xl font-bold mt-1">{clientes.length}</h3>
          </div>
          <Users className="w-10 h-10 text-blue-400" />
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Clientes em Risco (Vermelho)</p>
            <h3 className="text-3xl font-bold mt-1 text-red-400">
              {clientes.filter(c => c.faixa_risco === 'VERMELHO').length}
            </h3>
          </div>
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Clientes Estáveis (Verde)</p>
            <h3 className="text-3xl font-bold mt-1 text-emerald-400">
              {clientes.filter(c => c.faixa_risco === 'VERDE').length}
            </h3>
          </div>
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
      </div>

      {/* Tabela de Listagem */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-emerald-400" />
          <h2 className="font-semibold text-lg">Carteira de Clientes Ativos</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">A carregar dados do servidor...</div>
        ) : clientes.length === 0 ? (
          <div className="p-12 text-center text-slate-400">Nenhum cliente encontrado ou backend desconectado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-700/50 text-slate-300 text-xs uppercase tracking-wider">
                  <th className="py-3 px-6">ID</th>
                  <th className="py-3 px-6">Nome</th>
                  <th className="py-3 px-6">E-mail</th>
                  <th className="py-3 px-6">Health Score</th>
                  <th className="py-3 px-6">Risco</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-sm">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-6 font-mono text-slate-400">#{cliente.id}</td>
                    <td className="py-4 px-6 font-medium text-white">{cliente.nome}</td>
                    <td className="py-4 px-6 text-slate-300">{cliente.email}</td>
                    <td className="py-4 px-6">{cliente.health_score}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        cliente.faixa_risco === 'VERDE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        cliente.faixa_risco === 'AMARELO' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {cliente.faixa_risco}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}