import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: Busca todos os produtos do banco
export async function GET() {
  try {
    const [linhas] = await db.query("SELECT * FROM produtos ORDER BY nome ASC");
    return NextResponse.json(linhas);
  } catch (error) {
    return NextResponse.json({ erro: "Erro ao buscar produtos" }, { status: 500 });
  }
}

// POST: Cria um novo produto
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, descricao, preco, quantidade, estoque_minimo } = body;

    const [result]: any = await db.query(
      "INSERT INTO produtos (nome, descricao, preco, quantidade, estoque_minimo) VALUES (?, ?, ?, ?, ?)",
      [nome, descricao, preco, quantidade, estoque_minimo]
    );

    return NextResponse.json({ id: result.insertId, mensagem: "Produto criado!" });
  } catch (error) {
    return NextResponse.json({ erro: "Erro ao criar produto" }, { status: 500 });
  }
}