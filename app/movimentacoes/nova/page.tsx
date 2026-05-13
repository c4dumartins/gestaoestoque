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
      <style>{`
        .pagina-form { min-height: 100vh; background: #f0f6ff; padding-bottom: 40px; }
        .conteudo-principal { max-width: 500px; margin: 40px auto; }
        .container-form { background: white; padding: 30px; border-radius: 8px; border: 1px solid #d0e4f4; }
        .titulo-form { font-size: 20px; margin-bottom: 20px; color: #1a3a5c; }
        .formulario { display: flex; flex-direction: column; gap: 15px; }
        .grupo-campo { display: flex; flex-direction: column; gap: 5px; }
        label { font-size: 13px; font-weight: bold; color: #2a5a8a; }
        select, input { padding: 10px; border: 1px solid #c2d8ef; border-radius: 6px; }
        .grupo-botoes { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
        .btn-salvar { background: #2e7d32; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        .btn-cancelar { background: #999; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
      `}</style>
    </div>
  );
}