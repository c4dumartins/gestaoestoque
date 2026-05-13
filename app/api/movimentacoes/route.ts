import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: Busca o histórico de movimentações
export async function GET() {
  try {
    const query = `
      SELECT m.id, p.nome as produto, m.tipo, m.quantidade, m.data 
      FROM movimentacoes m 
      JOIN produtos p ON m.produto_id = p.id 
      ORDER BY m.data DESC, m.id DESC LIMIT 10
    `;
    const [linhas] = await db.query(query);
    return NextResponse.json(linhas);
  } catch (error) {
    return NextResponse.json({ erro: "Erro ao buscar movimentações" }, { status: 500 });
  }
}

// POST: Registra uma nova movimentação e ATUALIZA o estoque do produto
export async function POST(request: Request) {
  try {
    const { produto_id, tipo, quantidade, data } = await request.json();
    const qtdNum = parseInt(quantidade);

    // 1. Insere a movimentação
    await db.query(
      "INSERT INTO movimentacoes (produto_id, tipo, quantidade, data) VALUES (?, ?, ?, ?)",
      [produto_id, tipo, qtdNum, data]
    );

    // 2. Atualiza a quantidade na tabela produtos
    // Se for entrada, soma. Se for saída, subtrai.
    const ajuste = tipo === 'entrada' ? qtdNum : -qtdNum;
    await db.query(
      "UPDATE produtos SET quantidade = quantidade + ? WHERE id = ?",
      [ajuste, produto_id]
    );

    return NextResponse.json({ mensagem: "Movimentação registrada com sucesso!" });
  } catch (error) {
    return NextResponse.json({ erro: "Erro ao registrar movimentação" }, { status: 500 });
  }
}