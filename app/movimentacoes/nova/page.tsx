"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

export default function NovaMovimentacaoPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({ produto_id: "", tipo: "entrada", quantidade: 0, data: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    fetch("/api/produtos").then(res => res.json()).then(setProdutos);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/movimentacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("Movimentação registrada!");
      router.push("/estoque");
    }
  };

  return (
    <div className="pagina-form">
      <Header />
      <main className="conteudo-principal">
        <div className="container-form">
          <h1 className="titulo-form">Nova Movimentação</h1>
          <form onSubmit={handleSubmit} className="formulario">
            <div className="grupo-campo">
              <label>Produto</label>
              <select required value={form.produto_id} onChange={e => setForm({...form, produto_id: e.target.value})}>
                <option value="">Selecione um produto...</option>
                {produtos.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.nome} (Atual: {p.quantidade})</option>
                ))}
              </select>
            </div>
            <div className="grupo-campo">
              <label>Tipo de Movimentação</label>
              <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>
            <div className="grupo-campo">
              <label>Quantidade</label>
              <input type="number" min="1" required value={form.quantidade} onChange={e => setForm({...form, quantidade: parseInt(e.target.value)})} />
            </div>
            <div className="grupo-campo">
              <label>Data</label>
              <input type="date" required value={form.data} onChange={e => setForm({...form, data: e.target.value})} />
            </div>
            <div className="grupo-botoes">
              <button type="button" className="btn-cancelar" onClick={() => router.push("/estoque")}>Cancelar</button>
              <button type="submit" className="btn-salvar">Registrar</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}