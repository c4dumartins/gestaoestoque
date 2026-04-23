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

      <style>{`
        .pagina-form {
          min-height: 100vh;
          background: #f0f6ff;
        }

        .conteudo-principal {
          max-width: 600px;
          margin: 40px auto;
          padding: 0 24px;
        }

        .container-form {
          background: #fff;
          border: 1px solid #d0e4f4;
          border-radius: 8px;
          padding: 32px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
        }

        .titulo-form {
          font-size: 22px;
          font-weight: 600;
          color: #1a3a5c;
          margin: 0 0 24px;
          border-bottom: 1px solid #edf4fc;
          padding-bottom: 16px;
        }

        .formulario {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .grupo-campo {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .linha-campos {
          display: flex;
          gap: 16px;
        }

        label {
          font-size: 13px;
          font-weight: 600;
          color: #2a5a8a;
        }

        input, textarea {
          border: 1px solid #c2d8ef;
          background: #fff;
          padding: 10px 14px;
          font-size: 14px;
          color: #1a3a5c;
          border-radius: 6px;
          outline: none;
          transition: border-color 0.15s;
          width: 100%;
        }

        input:focus, textarea:focus {
          border-color: #4a90c4;
        }

        .grupo-botoes {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 12px;
          padding-top: 24px;
          border-top: 1px solid #edf4fc;
        }

        .btn-cancelar {
          background: #fff;
          color: #6b8cae;
          border: 1px solid #c2d8ef;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-cancelar:hover {
          background: #f5f9ff;
          color: #4a7aa8;
        }

        .btn-salvar {
          background: #2a6db5;
          color: #fff;
          border: none;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .btn-salvar:hover {
          background: #1f5a9a;
        }
      `}</style>
    </div>
  );
}