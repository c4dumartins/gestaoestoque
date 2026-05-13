"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

export default function NovoProdutoPage() {
  const router = useRouter();
  
  // Estado para armazenar os dados do formulário
  const [produto, setProduto] = useState({
    nome: "",
    descricao: "",
    preco: "",
    quantidade: "",
    estoque_minimo: "",
  });

  // Função para lidar com a digitação nos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduto((prev) => ({ ...prev, [name]: value }));
  };

  // Função para enviar os dados para a API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue

    try {
      const res = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: produto.nome,
          descricao: produto.descricao,
          // Converte para número antes de enviar ao banco
          preco: parseFloat(produto.preco),
          quantidade: parseInt(produto.quantidade),
          estoque_minimo: parseInt(produto.estoque_minimo),
        }),
      });

      if (res.ok) {
        alert("Produto cadastrado com sucesso!");
        router.push("/produtos"); // Volta para a lista de produtos
      } else {
        alert("Erro ao cadastrar o produto.");
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
          <h1 className="titulo-form">Novo Produto</h1>
          
          <form onSubmit={handleSubmit} className="formulario">
            <div className="grupo-campo">
              <label>Nome do Produto</label>
              <input 
                type="text" 
                name="nome" 
                value={produto.nome} 
                onChange={handleChange} 
                required 
                placeholder="Ex: Caderno 10 Matérias"
              />
            </div>

            <div className="grupo-campo">
              <label>Descrição</label>
              <textarea 
                name="descricao" 
                value={produto.descricao} 
                onChange={handleChange} 
                required
                placeholder="Detalhes do produto..."
                rows={3}
              />
            </div>

            <div className="linha-campos">
              <div className="grupo-campo">
                <label>Preço (R$)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="preco" 
                  value={produto.preco} 
                  onChange={handleChange} 
                  required 
                  placeholder="0.00"
                />
              </div>

              <div className="grupo-campo">
                <label>Quantidade Inicial</label>
                <input 
                  type="number" 
                  name="quantidade" 
                  value={produto.quantidade} 
                  onChange={handleChange} 
                  required 
                  placeholder="0"
                />
              </div>

              <div className="grupo-campo">
                <label>Estoque Mínimo</label>
                <input 
                  type="number" 
                  name="estoque_minimo" 
                  value={produto.estoque_minimo} 
                  onChange={handleChange} 
                  required 
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grupo-botoes">
              <button type="button" className="btn-cancelar" onClick={() => router.push("/produtos")}>
                Cancelar
              </button>
              <button type="submit" className="btn-salvar">
                Salvar Produto
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Removido o CSS inline para usar apenas os estilos globais do projeto */}
    </div>
  );
}