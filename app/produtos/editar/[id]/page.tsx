"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "../../../components/Header";

export default function EditarProdutoPage() {
  const router = useRouter();
  // No Next.js 15 em Client Components, usamos useParams para pegar o ID da URL
  const params = useParams(); 
  const id = params.id;

  const [produto, setProduto] = useState({
    nome: "",
    descricao: "",
    preco: "",
    quantidade: "",
    estoque_minimo: "",
  });

  // Busca os dados do produto assim que a página carrega
  useEffect(() => {
    if (id) {
      const carregarProduto = async () => {
        try {
          const res = await fetch(`/api/produtos/${id}`);
          if (res.ok) {
            const dados = await res.json();
            setProduto({
              nome: dados.nome,
              descricao: dados.descricao,
              preco: dados.preco,
              quantidade: dados.quantidade,
              estoque_minimo: dados.estoque_minimo,
            });
          } else {
            alert("Produto não encontrado.");
            router.push("/produtos");
          }
        } catch (error) {
          console.error("Erro ao carregar produto:", error);
        }
      };
      carregarProduto();
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: produto.nome,
          descricao: produto.descricao,
          preco: parseFloat(produto.preco),
          quantidade: parseInt(produto.quantidade),
          estoque_minimo: parseInt(produto.estoque_minimo),
        }),
      });

      if (res.ok) {
        alert("Produto atualizado com sucesso!");
        router.push("/produtos");
      } else {
        alert("Erro ao atualizar o produto.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro de conexão ao tentar salvar.");
    }
  };

  return (
    <div className="pagina-form">
      <Header />

      <main className="conteudo-principal">
        <div className="container-form">
          <h1 className="titulo-form">Editar Produto</h1>
          
          <form onSubmit={handleSubmit} className="formulario">
            <div className="grupo-campo">
              <label>Nome do Produto</label>
              <input type="text" name="nome" value={produto.nome} onChange={handleChange} required />
            </div>

            <div className="grupo-campo">
              <label>Descrição</label>
              <textarea name="descricao" value={produto.descricao} onChange={handleChange} required rows={3} />
            </div>

            <div className="linha-campos">
              <div className="grupo-campo">
                <label>Preço (R$)</label>
                <input type="number" step="0.01" name="preco" value={produto.preco} onChange={handleChange} required />
              </div>

              <div className="grupo-campo">
                <label>Quantidade Atual</label>
                <input type="number" name="quantidade" value={produto.quantidade} onChange={handleChange} required />
              </div>

              <div className="grupo-campo">
                <label>Estoque Mínimo</label>
                <input type="number" name="estoque_minimo" value={produto.estoque_minimo} onChange={handleChange} required />
              </div>
            </div>

            <div className="grupo-botoes">
              <button type="button" className="btn-cancelar" onClick={() => router.push("/produtos")}>
                Cancelar
              </button>
              <button type="submit" className="btn-salvar">
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}