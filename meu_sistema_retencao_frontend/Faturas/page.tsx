"use client";

import React, { useState, useEffect } from 'react';
import { PlusCircle, FileText, ArrowLeft, RefreshCw } from 'lucide-react';
import axios from 'axios';

interface Cliente {
  id: string;
  nome: string;
}

interface Fatura {
  id: string;
  cliente_id: string;
  valor: number;
  data_vencimento: string;
  status: string;
}

export default function FaturasPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [faturaId, setFaturaId] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [valor, setValor] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');

  const carregarDados = async () => {
    try {
      setLoading(true);
      const resClientes = await axios.get('http://127.0.0.1:8000/api/v1/clientes/');
      setClientes(resClientes.data);

      if (resClientes.data.length > 0) {
        setClienteId(resClientes.data[0].id);
        // Carrega faturas do primeiro cliente
        const resFaturas = await axios.get(`http://127.0.0.1:8000/api/v1/faturas/cliente/${resClientes.data[0].id}`);
        setFaturas(resFaturas.data);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleCriarFatura = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faturaId || !clienteId || !valor || !dataVencimento) return;

    try {
      setLoading(true);
      await axios.post('http://127.0.0.1:8000/api/v1/faturas/', {
        id: faturaId,
        cliente_id: clienteId,
        valor: parseFloat(valor),
        data_vencimento: new Date(dataVencimento).toISOString()
      });

      // Limpa formulário e recarrega
      setFaturaId('');
      setValor('');
      setDataVencimento('');
      alert('Fatura gerada com sucesso e Health Score recalculado!');
      carregarDados();
    } catch (error) {
      console.error("Erro ao criar fatura:", error);
      alert('Erro ao criar fatura. Verifique se o ID já existe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Topo */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <a href="/" className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100">
            <ArrowLeft size={18} />
          </a>
          <h1 className="text-2xl font-bold text-slate-800">Gestão de Faturas & Cobrança</h1>
        </div>
        <a 
          href="/retencao" 
          className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Ir para o Kanban →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form para gerar nova fatura */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <PlusCircle size={20} className="text-blue-600" />
            Emitir Nova Fatura
          </h2>

          <form onSubmit={handleCriarFatura} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">ID da Fatura</label>
              <input 
                type="text" 
                placeholder="Ex: fat_001" 
                value={faturaId} 
                onChange={(e) => setFaturaId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Cliente</label>
              <select 
                value={clienteId} 
                onChange={(e) => setClienteId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome} ({c.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Valor (R$)</label>
              <input 
                type="number" 
                step="0.01" 
                placeholder="120.00" 
                value={valor} 
                onChange={(e) => setValor(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Data Vencimento</label>
              <input 
                type="date" 
                value={dataVencimento} 
                onChange={(e) => setDataVencimento(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Salvando...' : 'Gerar Fatura'}
            </button>
          </form>
        </div>

        {/* Lista de Faturas do Cliente */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText size={20} className="text-slate-600" />
              Historico de Faturas
            </h2>
            <button 
              onClick={carregarDados} 
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase border-b border-slate-100">
                  <th className="p-3">ID Fatura</th>
                  <th className="p-3">Valor</th>
                  <th className="p-3">Vencimento</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faturas.map((fat) => (
                  <tr key={fat.id}>
                    <td className="p-3 font-medium text-slate-700">{fat.id}</td>
                    <td className="p-3 text-slate-800 font-semibold">R$ {fat.valor.toFixed(2)}</td>
                    <td className="p-3 text-slate-500">{new Date(fat.data_vencimento).toLocaleDateString('pt-BR')}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        fat.status === 'PAGA' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {fat.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {faturas.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-400">
                      Nenhuma fatura lançada para este cliente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}