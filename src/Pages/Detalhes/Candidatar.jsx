// src/Candidatar.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { candidaturasAPI } from "../services/candidaturasAPI";
import "./Candidatar.css";

function Candidatar() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    assunto: "",
    nivel: "",
    area: "",
    detalhes: "",
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
    if (!form.nome || !form.email || !form.assunto || !form.nivel || !form.area || !form.detalhes) {
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
      // Enviar para a API
      const result = await candidaturasAPI.sendCandidatura(form);
      
      console.log("Resposta da API:", result);
      
      setStatus({ loading: false, success: true, error: null });
      
      // Limpar formulário
      setForm({
        nome: "",
        email: "",
        assunto: "",
        nivel: "",
        area: "",
        detalhes: "",
      });
      
      // Resetar mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 5000);
      
    } catch (error) {
      console.error("Erro ao enviar candidatura:", error);
      setStatus({ 
        loading: false, 
        success: false, 
        error: error.message || "Erro ao enviar candidatura. Tente novamente." 
      });
      
      // Resetar erro após 5 segundos
      setTimeout(() => {
        setStatus(prev => ({ ...prev, error: null }));
      }, 5000);
    }
  };

  return (
    <motion.div 
      className="candidatar-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="candidatar-card">
        <button className="back-button" onClick={() => navigate("/recrutamento")}>
          <ArrowLeft size={18} /> Voltar
        </button>
        
        <h1>Candidatura Espontânea</h1>
        <p>Preencha o formulário abaixo para se candidatar às nossas vagas.</p>

        {status.success && (
          <div className="success-message">
            <CheckCircle size={20} />
            <span>Candidatura enviada com sucesso! Entraremos em contato em breve.</span>
          </div>
        )}

        {status.error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{status.error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nome Completo *</label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Assunto *</label>
              <input
                type="text"
                name="assunto"
                value={form.assunto}
                onChange={handleChange}
                placeholder="Ex: Candidatura para Advogado Sénior"
                required
              />
            </div>

            <div className="form-group">
              <label>Nível de Experiência *</label>
              <select name="nivel" value={form.nivel} onChange={handleChange} required>
                <option value="">Selecione...</option>
                <option value="junior">Júnior (1-3 anos)</option>
                <option value="pleno">Pleno (3-6 anos)</option>
                <option value="senior">Sénior (6+ anos)</option>
                <option value="estagio">Estágio</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Área de Interesse *</label>
              <select name="area" value={form.area} onChange={handleChange} required>
                <option value="">Selecione...</option>
                <option value="comercial">Direito Comercial</option>
                <option value="civil">Direito Civil</option>
                <option value="penal">Direito Penal</option>
                <option value="trabalho">Direito do Trabalho</option>
                <option value="internacional">Direito Internacional</option>
                <option value="tecnologico">Direito Tecnológico</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Detalhes / Carta de Motivação *</label>
            <textarea
              name="detalhes"
              value={form.detalhes}
              onChange={handleChange}
              rows="6"
              placeholder="Conte-nos sobre sua experiência, motivações e por que deseja fazer parte da nossa equipa..."
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={status.loading}
          >
            {status.loading ? (
              <>
                <Loader2 className="spinner" size={18} />
                Enviando...
              </>
            ) : (
              <>
                <Send size={18} />
                Enviar Candidatura
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default Candidatar;