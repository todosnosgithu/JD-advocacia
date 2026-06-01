// src/Pages/admin/AdminLogin.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Shield, Mail, Loader2 } from "lucide-react";
import { usuariosAPI } from "../services/usuariosAPI";
import { auth } from "./auth";
import "./AdminLogin.css";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirecionar se já estiver logado
  React.useEffect(() => {
    if (auth.isAuthenticated()) {
      window.location.href = "/admin/dashboard";
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !senha) {
      setError("Por favor, preencha email e senha.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await usuariosAPI.login({ email, senha: senha });
      
      if (response.token && response.token.trim() !== "") {
        auth.setLoginData(response.token, response.user);
        
        if (onLogin && typeof onLogin === 'function') {
          onLogin(true);
        }
        
        window.location.href = "/admin/dashboard";
      } else {
        setError("Token não recebido. Credenciais inválidas.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setError(error.message || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-bg"></div>

      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <div className="login-icon">
            <Shield size={40} />
          </div>
          <h1>Painel Administrativo</h1>
          <p>Fulano Advocacia</p>
          <p className="demo-credentials">Demo: admin@advoca.com / admin123</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-input-group">
            <Mail size={20} className="input-icon" />
            <input
              type="email"
              placeholder="Email de acesso"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="login-input-group">
            <Lock size={20} className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha de acesso"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <div className="login-error">{error}</div>}

          <motion.button
            type="submit"
            className="login-button"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                A entrar...
              </>
            ) : (
              "Aceder ao Painel"
            )}
          </motion.button>
        </form>

        <div className="login-footer">
          <p>Área restrita - Acesso autorizado apenas para administradores</p>
        </div>
      </motion.div>
    </div>
  );
}