"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    msg: string;
    erro: boolean;
  } | null>(null);

  const router = useRouter();

  const showToast = (msg: string, erro: boolean) => {
    setToast({ msg, erro });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const resposta = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        showToast("Login realizado com sucesso!", false);

        setTimeout(() => {
          router.push("/produtos");
        }, 1200);
      } else {
        showToast(dados.erro || "E-mail ou senha inválidos.", true);
      }
    } catch {
      showToast(
        "Erro de conexão. Tente novamente mais tarde.",
        true
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-login">
        <div className="login-card">

          <div className="login-topbar" />

          <div className="login-icon">
            🔒
          </div>

          <h1 className="login-title">
            Sistema de Gestão de Estoque
          </h1>

          <p className="login-subtitle">
            Faça login para continuar
          </p>

          <form
            onSubmit={handleLogin}
            className="login-form"
          >
            <div className="login-field">
              <label>E-mail</label>

              <input
                type="email"
                placeholder="seu@email.com"
                className="login-input"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="login-field">
              <label>Senha</label>

              <div className="senha-wrapper">
                <input
                  type={
                    mostrarSenha
                      ? "text"
                      : "password"
                  }
                  placeholder="Digite sua senha"
                  className="login-input"
                  value={senha}
                  onChange={(e) =>
                    setSenha(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() =>
                    setMostrarSenha(!mostrarSenha)
                  }
                >
                  {mostrarSenha ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <a href="#" className="login-link">
              Esqueceu a senha?
            </a>

            <button
              type="submit"
              disabled={loading}
              className={`login-submit ${
                loading ? "disabled" : ""
              }`}
            >
              {loading
                ? "Entrando..."
                : "Entrar"}
            </button>
          </form>

          <div className="login-badge">
            🔐 Conexão segura
          </div>

          {toast && (
            <div
              className={`toast ${
                toast.erro
                  ? "toast-error"
                  : "toast-success"
              }`}
            >
              {toast.msg}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .page-login {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: linear-gradient(
            135deg,
            #0f172a,
            #1e40af
          );
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 24px;
          padding: 32px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.25);
        }

        .login-topbar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
          background: linear-gradient(
            to right,
            #2563eb,
            #60a5fa
          );
        }

        .login-icon {
          width: 75px;
          height: 75px;
          background: #eff6ff;
          border-radius: 20px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 34px;
        }

        .login-title {
          text-align: center;
          font-size: 28px;
          font-weight: 700;
          color: #111827;
        }

        .login-subtitle {
          text-align: center;
          color: #6b7280;
          margin-top: 8px;
          margin-bottom: 30px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .login-field label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .login-input {
          width: 100%;
          height: 52px;
          border: 1px solid #d1d5db;
          border-radius: 14px;
          padding: 0 16px;
          font-size: 15px;
          outline: none;
          transition: 0.2s;
        }

        .login-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.15);
        }

        .senha-wrapper {
          position: relative;
        }

        .toggle-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
        }

        .login-link {
          text-align: right;
          color: #2563eb;
          font-size: 14px;
          text-decoration: none;
        }

        .login-link:hover {
          text-decoration: underline;
        }

        .login-submit {
          height: 52px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(
            to right,
            #2563eb,
            #3b82f6
          );
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.25s;
        }

        .login-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(37,99,235,0.3);
        }

        .disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-badge {
          margin-top: 22px;
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
          padding: 12px;
          border-radius: 12px;
          text-align: center;
          font-size: 13px;
        }

        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 14px 18px;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          z-index: 999;
          animation: fadeIn 0.3s ease;
        }

        .toast-error {
          background: #dc2626;
        }

        .toast-success {
          background: #16a34a;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}