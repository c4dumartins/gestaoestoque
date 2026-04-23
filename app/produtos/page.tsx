"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useRouter } from "next/navigation";

export default function ProdutosPage() {
    const [produtos, setProdutos] = useState([]);
    const [busca, setBusca] = useState("");
    const router = useRouter();

    // Função para buscar produtos da API real
    const carregarProdutos = async () => {
        try {
            const res = await fetch("/api/produtos");
            const dados = await res.json();
            setProdutos(dados);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        }
    };

    // Carrega os dados assim que a página abre
    useEffect(() => {
        carregarProdutos();
    }, []);

    // Função para excluir do banco de dados
    const handleExcluir = async (id: number, nome: string) => {
        if (confirm(`Deseja excluir o produto "${nome}"?`)) {
            try {
                const res = await fetch(`/api/produtos/${id}`, { method: "DELETE" });

                if (!res.ok) {
                    // Se a API retornou erro (404, 500, etc), a gente captura aqui
                    const erroData = await res.json();
                    alert(`Falha ao excluir: ${erroData.erro}`);
                    return;
                }

                carregarProdutos(); // Recarrega a lista após excluir com sucesso
            } catch (error) {
                console.error("Erro na comunicação com a API:", error);
                alert("Erro de conexão ao tentar excluir.");
            }
        }
    };

    // Regra visual de estoque baixo
    const estoqueAbaixoMin = (estoque: number, min: number) => estoque < min;

    // Filtro de busca
    const produtosFiltrados = produtos.filter((p: any) =>
        p.nome.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="pagina-produtos">
            <Header />

            <main className="conteudo-principal">
                <div className="cabecalho-pagina">
                    <div>
                        <h1 className="titulo-pagina">Cadastro de Produtos</h1>
                        <p className="subtitulo-pagina">
                            Gerencie o catálogo de produtos do sistema
                        </p>
                    </div>
                </div>

                <div className="barra-acoes">
                    <input
                        type="text"
                        placeholder="Buscar produto por nome..."
                        className="campo-busca"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                    <div className="grupo-botoes">
                        <button
                            className="btn-primario"
                            onClick={() => router.push("/produtos/novo")}
                        >
                            + Novo Produto
                        </button>
                        <button className="btn-secundario">Voltar</button>
                    </div>
                </div>

                <div className="container-tabela">
                    <table className="tabela-produtos">
                        <thead>
                            <tr>
                                <th className="col-id">ID</th>
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th className="col-preco">Preço (R$)</th>
                                <th className="col-num">Estoque</th>
                                <th className="col-num">Estoque Mín.</th>
                                <th className="col-acoes">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtosFiltrados.map((produto: any) => {
                                // Aqui usamos as colunas reais do banco: quantidade e estoque_minimo
                                const alerta = estoqueAbaixoMin(
                                    produto.quantidade,
                                    produto.estoque_minimo
                                );

                                return (
                                    <tr key={produto.id} className={alerta ? "linha-alerta" : ""}>
                                        <td className="col-id texto-muted">{produto.id}</td>
                                        <td className="nome-produto">{produto.nome}</td>
                                        <td className="texto-muted">{produto.descricao}</td>
                                        <td className="col-preco">
                                            R$ {Number(produto.preco).toFixed(2)}
                                        </td>
                                        <td className={`col-num ${alerta ? "estoque-baixo" : ""}`}>
                                            {produto.quantidade}
                                            {alerta && <span className="badge-alerta">baixo</span>}
                                        </td>
                                        <td className="col-num texto-muted">
                                            {produto.estoque_minimo}
                                        </td>
                                        <td className="col-acoes">
                                            <div className="grupo-acoes">
                                                <button
                                                    className="btn-editar"
                                                    onClick={() => router.push(`/produtos/editar/${produto.id}`)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn-excluir"
                                                    onClick={() => handleExcluir(produto.id, produto.nome)}
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <p className="rodape-tabela">
                    {produtosFiltrados.length} produtos encontrados
                </p>
            </main>

            <style>{`
        .pagina-produtos {
          min-height: 100vh;
          background: #f0f6ff;
        }

        .conteudo-principal {
          max-width: 1024px;
          margin: 0 auto;
          padding: 32px 24px;
        }

        .cabecalho-pagina {
          margin-bottom: 28px;
        }

        .titulo-pagina {
          font-size: 22px;
          font-weight: 600;
          color: #1a3a5c;
          margin: 0 0 4px;
          letter-spacing: -0.3px;
        }

        .subtitulo-pagina {
          font-size: 13px;
          color: #6b8cae;
          margin: 0;
        }

        .barra-acoes {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          gap: 12px;
        }

        .campo-busca {
          border: 1px solid #c2d8ef;
          background: #fff;
          padding: 8px 14px;
          width: 280px;
          font-size: 13px;
          color: #1a3a5c;
          border-radius: 6px;
          outline: none;
          transition: border-color 0.15s;
        }

        .campo-busca::placeholder {
          color: #9bb5cc;
        }

        .campo-busca:focus {
          border-color: #4a90c4;
        }

        .grupo-botoes {
          display: flex;
          gap: 8px;
        }

        .btn-primario {
          background: #2a6db5;
          color: #fff;
          border: none;
          padding: 8px 16px;
          font-size: 13px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .btn-primario:hover {
          background: #1f5a9a;
        }

        .btn-secundario {
          background: #fff;
          color: #4a7aa8;
          border: 1px solid #c2d8ef;
          padding: 8px 16px;
          font-size: 13px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-secundario:hover {
          background: #eaf3ff;
          border-color: #4a90c4;
        }

        .container-tabela {
          background: #fff;
          border: 1px solid #d0e4f4;
          border-radius: 8px;
          overflow: hidden;
        }

        .tabela-produtos {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .tabela-produtos thead tr {
          background: #daeaf8;
        }

        .tabela-produtos th {
          padding: 11px 14px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
          color: #2a5a8a;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          border-bottom: 1px solid #c2d8ef;
        }

        .tabela-produtos td {
          padding: 11px 14px;
          color: #2c4a68;
          border-bottom: 1px solid #edf4fc;
        }

        .tabela-produtos tbody tr:last-child td {
          border-bottom: none;
        }

        .tabela-produtos tbody tr:hover {
          background: #f5f9ff;
        }

        .linha-alerta {
          background: #fff8f0;
        }

        .linha-alerta:hover {
          background: #fff3e6 !important;
        }

        .col-id {
          width: 52px;
        }

        .col-preco {
          width: 110px;
          font-variant-numeric: tabular-nums;
        }

        .col-num {
          width: 110px;
          text-align: center;
        }

        .col-acoes {
          width: 130px;
          text-align: center;
        }

        .texto-muted {
          color: #6b8cae;
        }

        .nome-produto {
          font-weight: 500;
          color: #1a3a5c;
        }

        .estoque-baixo {
          color: #c0541a;
          font-weight: 600;
        }

        .badge-alerta {
          display: inline-block;
          margin-left: 6px;
          background: #fde8d4;
          color: #b84c10;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .grupo-acoes {
          display: flex;
          justify-content: center;
          gap: 6px;
        }

        .btn-editar {
          background: #e8f3fd;
          color: #2a6db5;
          border: 1px solid #b8d8f0;
          padding: 5px 12px;
          font-size: 12px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-editar:hover {
          background: #cce4f8;
          border-color: #4a90c4;
        }

        .btn-excluir {
          background: #fdeaea;
          color: #c0392b;
          border: 1px solid #f0c0bc;
          padding: 5px 12px;
          font-size: 12px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-excluir:hover {
          background: #f9d0cc;
          border-color: #e08078;
        }

        .rodape-tabela {
          margin: 10px 0 0;
          font-size: 12px;
          color: #8aabca;
          text-align: right;
        }
      `}</style>
        </div>
    );
}