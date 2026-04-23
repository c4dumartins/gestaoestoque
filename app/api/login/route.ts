import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Importando nossa conexão com o banco
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    // 1. Pega os dados do Front-end
    const body = await request.json();
    const { email, senha } = body;
    
    console.log("--- INICIANDO TENTATIVA DE LOGIN ---");
    console.log("1. Tentando logar com o email:", email); // Espião 1

    // 2. Procura no banco de dados
    const [linhas]: any = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    console.log("2. O que voltou do banco de dados:", linhas); // Espião 2

    // 3. Verifica se achou alguém
    if (linhas.length === 0) {
      console.log("3. Erro: Usuário não encontrado no banco."); // Espião 3
      return NextResponse.json(
        { erro: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    const usuario = linhas[0]; 

    // 4. Compara a senha digitada com o Hash do banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    
    console.log("4. A senha bateu com o hash?", senhaValida); // Espião 4

    // 5. Verifica se a senha estava certa
    if (!senhaValida) {
      console.log("5. Erro: A senha digitada está incorreta."); // Espião 5
      return NextResponse.json(
        { erro: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    // 6. Sucesso
    console.log("6. Sucesso! Login liberado."); 
    return NextResponse.json(
      { mensagem: "Login realizado com sucesso!", usuarioId: usuario.id },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro na API de login:", error);
    return NextResponse.json(
      { erro: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}