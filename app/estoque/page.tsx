"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

export default function EstoquePage() {
  const [produtos, setProdutos] = useState([]);
  const [historico, setHistorico] = useState([]);
  const router = useRouter();

  const carregarDados = async () => {
    const resProd = await fetch("/api/produtos");
    const resMov = await fetch("/api/movimentacoes");
    setProdutos(await resProd.json());
    setHistorico(await resMov.json());
  };

  useEffect(() => { carregarDados(); }, []);

  // Filtra produtos para o alerta amarelo
  const alertas = produtos.filter((p: any) => p.quantidade <= p.estoque_minimo);

  return (
    <div className="pagina-dashboard">
      <Header />
      <main className="conteudo-principal">
        <div className="cabecalho-secao">
          <h1 className="titulo-secao">Gestão de Estoque</h1>
          <p className="subtitulo">Registro de movimentações de entrada e saída</p>
        </div>

        {/* Alerta de Estoque Baixo */}
        {alertas.length > 0 && (
          <div className="alerta-estoque">
            <strong>Alertas de Estoque:</strong>
            {alertas.map((p: any) => (
              <p key={p.id}>"{p.nome}" está abaixo do mínimo ({p.quantidade}/{p.estoque_minimo})</p>
            ))}
          </div>
        )}

        {/* Tabela de Produtos Ordenados */}
        <div className="secao-tabela">
          <div className="barra-topo">
            <h2 className="titulo-tabela">Produtos ordenados alfabeticamente</h2>
            <div className="botoes">
              <button className="btn-preto" onClick={() => router.push("/movimentacoes/nova")}>+ Nova Movimentação</button>
              <button className="btn-cinza" onClick={() => router.push("/produtos")}>Config. Produtos</button>
            </div>
          </div>
          
          <table className="tabela-estilizada">
            <thead>
              <tr>
                <th>ID</th><th>Produto</th><th>Quantidade</th><th>Est. Mínimo</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p: any) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nome}</td>
                  <td>{p.quantidade}</td>
                  <td>{p.estoque_minimo}</td>
                  <td>
                    <span className={p.quantidade <= p.estoque_minimo ? "status-baixo" : "status-normal"}>
                      {p.quantidade <= p.estoque_minimo ? "Abaixo do mínimo" : "Normal"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Histórico de Movimentações */}
        <div className="secao-tabela" style={{marginTop: '40px'}}>
          <h2 className="titulo-tabela">Histórico de Movimentações</h2>
          <table className="tabela-estilizada">
            <thead>
              <tr>
                <th>Data</th><th>Produto</th><th>Tipo</th><th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((m: any) => (
                <tr key={m.id}>
                  <td>{new Date(m.data).toLocaleDateString('pt-BR')}</td>
                  <td>{m.produto}</td>
                  <td><span className={m.tipo === 'entrada' ? "tipo-entrada" : "tipo-saida"}>{m.tipo.toUpperCase()}</span></td>
                  <td>{m.quantidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}