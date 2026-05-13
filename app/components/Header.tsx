"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    // No futuro vamos limpar a sessão aqui, por enquanto só volta pro login
    router.push("/login");
  };

  return (
    <header className="site-header">
      <div className="header-title">Gestão de Estoque</div>
      <div className="header-identity">
        <span>Olá, <strong>Administrador</strong></span>
        <button onClick={handleLogout} className="btn-logout">Sair</button>
      </div>
    </header>
  );
}