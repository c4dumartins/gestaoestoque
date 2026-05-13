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
                        {/* BOTÃO MOVIMENTAÇÕES ADICIONADO AQUI */}
                        <button 
                            className="btn-secundario"
                            onClick={() => router.push("/estoque")}
                        >
                            Movimentações
                        </button>
                        
                        <button
                            className="btn-primario"
                            onClick={() => router.push("/produtos/novo")}
                        >
                            + Novo Produto
                        </button>
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
        </div>
    );
}