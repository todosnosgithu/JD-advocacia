// src/Componentes/ContactForm.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { contactoAPI } from "../services/contactoAPI";
import "./ContactForm.css";

export default function ContactForm() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  });
  
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!form.nome || !form.email || !form.assunto || !form.mensagem) {
      setStatus({ 
        loading: false, 
        success: false, 
        error: "Por favor, preencha todos os campos obrigatórios." 
      });
      setTimeout(() => setStatus(prev => ({ ...prev, error: null })), 5000);
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setStatus({ 
        loading: false, 
        success: false, 
        error: "Por favor, insira um email válido." 
      });
      setTimeout(() => setStatus(prev => ({ ...prev, error: null })), 5000);
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      const result = await contactoAPI.sendMensagem(form);
      
      setStatus({ loading: false, success: true, error: null });
      
      // Limpar formulário
      setForm({
        nome: "",
        email: "",
        telefone: "",
        assunto: "",
        mensagem: "",
      });
      
      // Resetar mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 5000);
      
    } catch (error) {
      console.error("Erro ao enviar:", error);
      setStatus({ 
        loading: false, 
        success: false, 
        error: error.message || "Erro de conexão. Verifique sua internet e tente novamente." 
      });
      setTimeout(() => setStatus(prev => ({ ...prev, error: null })), 5000);
    }
  };

  const clearError = () => {
    setStatus(prev => ({ ...prev, error: null }));
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {/* Mensagem de Sucesso */}
      {status.success && (
        <motion.div 
          className="success-message"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <CheckCircle size={20} />
          <span>Mensagem enviada com sucesso! Entraremos em contacto brevemente.</span>
        </motion.div>
      )}

      {/* Mensagem de Erro */}
      {status.error && (
        <motion.div 
          className="error-message"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <AlertCircle size={20} />
          <span>{status.error}</span>
          <button type="button" className="close-error" onClick={clearError}>×</button>
        </motion.div>
      )}

      {/* Nome */}
      <div className="form-group">
        <label>Nome Completo *</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
          placeholder="O seu nome"
          disabled={status.loading}
        />
      </div>

      {/* Email + Telefone */}
      <div className="form-row">
        <div className="form-group">
          <label>Email *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="exemplo@email.com"
            disabled={status.loading}
          />
        </div>

        <div className="form-group">
          <label>Telefone</label>
          <input
            name="telefone"
            type="tel"
            value={form.telefone}
            onChange={handleChange}
            placeholder="+244 900 000 000"
            disabled={status.loading}
          />
        </div>
      </div>

      {/* Assunto */}
      <div className="form-group">
        <label>Assunto *</label>
        <input
          name="assunto"
          value={form.assunto}
          onChange={handleChange}
          required
          placeholder="Descreva brevemente o assunto"
          disabled={status.loading}
        />
      </div>

      {/* Mensagem */}
      <div className="form-group">
        <label>Mensagem *</label>
        <textarea
          name="mensagem"
          value={form.mensagem}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Descreva o seu caso..."
          disabled={status.loading}
        />
      </div>

      {/* Botão */}
      <motion.button
        type="submit"
        whileHover={{ scale: status.loading ? 1 : 1.01 }}
        whileTap={{ scale: status.loading ? 1 : 0.99 }}
        className={`submit-btn ${status.loading ? "loading" : ""}`}
        disabled={status.loading}
      >
        {status.loading ? (
          <>
            <Loader2 size={18} className="spin" />
            Enviando...
          </>
        ) : (
          <>
            Enviar Mensagem
            <Send size={16} />
          </>
        )}
      </motion.button>
    </form>
  );
}