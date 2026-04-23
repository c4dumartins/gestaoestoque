"use client";

import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    // No futuro vamos limpar a sessão aqui, por enquanto só volta pro login
    router.push("/login");
  };

  return (
    <header className="bg-[#2b2b2b] text-white p-4 flex justify-between items-center">
      <div className="font-bold text-lg">
        Gestão de Estoque
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">Olá, <strong>Administrador</strong></span>
        <button 
          onClick={handleLogout}
          className="bg-[#cc0000] hover:bg-red-700 text-white px-4 py-1 rounded text-sm transition-colors"
        >
          Sair
        </button>
      </div>
    </header>
  );
}