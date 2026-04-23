"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; erro: boolean } | null>(null);
  const [erro, setErro] = useState("");
  const router = useRouter();

  const showToast = (msg: string, erro: boolean) => {
    setToast({ msg, erro });
    setTimeout(() => setToast(null), 2800);
  };

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setErro(""); // Limpa qualquer erro anterior na tela

  try {
    // Aqui fazemos a chamada POST para a API que criamos no Passo 4
    const resposta = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    // Converte a resposta da API de volta para objeto JavaScript
    const dados = await resposta.json();

    if (resposta.ok) {
      // Se deu status 200 (OK), o login funcionou! 
      // Redireciona o usuário para a página de estoque/dashboard
      router.push("/estoque"); 
    } else {
      // Se deu erro (ex: 401), pega a mensagem da API e joga no estado de erro
      setErro(dados.erro);
    }
  } catch (error) {
    // Se o servidor estiver fora do ar ou der pau na internet
    setErro("Erro de conexão. Tente novamente mais tarde.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-8">
      <div className="relative w-full max-w-sm bg-white/80 border border-blue-200 rounded-xl p-10 overflow-hidden">

        {/* Barra topo */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 rounded-t-xl" />

        {/* Ícone */}
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            <line x1="12" y1="12" x2="12" y2="16" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
          </svg>
        </div>

        <h1 className="text-lg font-medium text-blue-800 text-center mb-1">
          Sistema de Gestão de Estoque
        </h1>
        <p className="text-sm text-blue-400 text-center mb-8">Faça login para continuar</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">

            {/* Se a variável 'erro' tiver algum texto, mostra essa div vermelha */}
{erro && (
  <div className="flex items-center gap-2 bg-red-50 border border-red-500 text-red-700 p-3 rounded-lg mb-4 text-sm">
    
    <svg 
      className="w-4 h-4 text-red-500 flex-shrink-0" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>

    <span className="font-medium">
      {erro}
    </span>
  </div>
)}

          {/* E-mail */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-blue-800">E-mail</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full pl-10 pr-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900 placeholder-blue-300 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Senha */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-blue-800">Senha</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                className="w-full pl-10 pr-10 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900 placeholder-blue-300 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-500 transition-colors"
              >
                {mostrarSenha ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <a href="#" className="text-xs text-blue-500 hover:text-blue-700 hover:underline text-right -mt-2">
            Esqueceu a senha?
          </a>

          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium text-white transition-all ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 active:scale-95"
            }`}
          >
            {loading ? "Entrando..." : "Entrar"}
            {!loading && (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            )}
          </button>
        </form>

        {/* Badge de segurança */}
        <div className="flex items-center gap-2 mt-5 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
          <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-xs text-blue-700">Conexão segura — dados criptografados</span>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            toast.erro
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-blue-50 border border-blue-200 text-blue-700"
          }`}>
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  );
}