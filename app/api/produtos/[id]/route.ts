import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: Busca um produto específico pelo ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [linhas]: any = await db.query("SELECT * FROM produtos WHERE id = ?", [id]);
    
    if (linhas.length === 0) {
      return NextResponse.json({ erro: "Produto não encontrado" }, { status: 404 });
    }
    
    return NextResponse.json(linhas[0]);
  } catch (error) {
    return NextResponse.json({ erro: "Erro ao buscar produto" }, { status: 500 });
  }
}

// PUT: Atualiza um produto específico pelo ID
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { nome, descricao, preco, quantidade, estoque_minimo } = body;
    
    // CORREÇÃO AQUI: Aguardando os params no Next.js 15
    const { id } = await params;

    await db.query(
      "UPDATE produtos SET nome = ?, descricao = ?, preco = ?, quantidade = ?, estoque_minimo = ? WHERE id = ?",
      [nome, descricao, preco, quantidade, estoque_minimo, id]
    );

    return NextResponse.json({ mensagem: "Produto atualizado!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ erro: "Erro ao atualizar produto" }, { status: 500 });
  }
}

// DELETE: Exclui um produto específico pelo ID
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // CORREÇÃO AQUI: Aguardando os params no Next.js 15
    const { id } = await params;
    
    console.log(`[API DELETE] 1. Recebi o pedido para excluir o ID: ${id}`);

    const [resultado]: any = await db.query("DELETE FROM produtos WHERE id = ?", [id]);
    
    console.log(`[API DELETE] 2. O MySQL respondeu:`, resultado);

    if (resultado.affectedRows === 0) {
      console.log(`[API DELETE] 3. Erro: Nenhum produto encontrado com esse ID.`);
      return NextResponse.json({ erro: "Produto não encontrado" }, { status: 404 });
    }

    console.log(`[API DELETE] 4. Sucesso! Produto ${id} excluído.`);
    return NextResponse.json({ mensagem: "Produto excluído!" }, { status: 200 });

  } catch (error) {
    console.error("[API DELETE] Erro interno:", error);
    return NextResponse.json({ erro: "Erro ao excluir produto", detalhes: error }, { status: 500 });
  }
}