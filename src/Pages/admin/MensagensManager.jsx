// src/Admin/MensagensManager.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  User,
  Phone,
  Calendar,
  X
} from "lucide-react";
import { contactoAPI } from "../services/contactoAPI";
import { auth } from "./auth";
import "./MensagensManager.css";

export default function MensagensManager() {
  const [mensagens, setMensagens] = useState([]);
  const [filteredMensagens, setFilteredMensagens] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMensagem, setSelectedMensagem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = auth.getToken();

  useEffect(() => {
    loadMensagens();
  }, []);

  useEffect(() => {
    filterMensagens();
  }, [searchTerm, mensagens]);

  const loadMensagens = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await contactoAPI.getAllMensagens(token);
      console.log("Mensagens carregadas:", data);
      
      // Ordenar por data (mais recentes primeiro)
      const sorted = Array.isArray(data) ? data.sort((a, b) => 
        new Date(b.createdAt || b.data || b.date) - new Date(a.createdAt || a.data || a.date)
      ) : [];
      
      setMensagens(sorted);
      localStorage.setItem("contacto_mensagens", JSON.stringify(sorted));
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      // Fallback para localStorage
      const stored = JSON.parse(localStorage.getItem("contacto_mensagens") || "[]");
      setMensagens(stored);
      setError("Erro ao conectar com servidor. Mostrando dados locais.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const filterMensagens = () => {
    let filtered = [...mensagens];
    
    if (searchTerm) {
      filtered = filtered.filter(msg =>
        msg.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.assunto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.mensagem?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredMensagens(filtered);
  };

  const deleteMensagem = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar esta mensagem?")) return;
    
    try {
      await contactoAPI.deleteMensagem(id, token);
      const newMensagens = mensagens.filter(m => m.id !== id);
      setMensagens(newMensagens);
      localStorage.setItem("contacto_mensagens", JSON.stringify(newMensagens));
      setSelectedMensagem(null);
      setSuccess("Mensagem eliminada com sucesso!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Erro ao deletar mensagem:", error);
      const newMensagens = mensagens.filter(m => m.id !== id);
      setMensagens(newMensagens);
      localStorage.setItem("contacto_mensagens", JSON.stringify(newMensagens));
      setSelectedMensagem(null);
      setSuccess("Mensagem eliminada localmente!");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const marcarComoLida = async (id, lido) => {
    if (lido) return;
    
    try {
      await contactoAPI.marcarComoLida(id, token);
      const updated = mensagens.map(m => 
        m.id === id ? { ...m, lido: true } : m
      );
      setMensagens(updated);
      localStorage.setItem("contacto_mensagens", JSON.stringify(updated));
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
      const updated = mensagens.map(m => 
        m.id === id ? { ...m, lido: true } : m
      );
      setMensagens(updated);
      localStorage.setItem("contacto_mensagens", JSON.stringify(updated));
    }
  };

  const getStatusBadge = (lido) => {
    if (lido) {
      return (
        <span className="status-badge read">
          <CheckCircle size={12} />
          Lida
        </span>
      );
    }
    return (
      <span className="status-badge unread">
        <Clock size={12} />
        Não lida
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "Data desconhecida";
    try {
      return new Date(date).toLocaleString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Data inválida";
    }
  };

  const stats = {
    total: mensagens.length,
    unread: mensagens.filter(m => !m.lido).length,
    read: mensagens.filter(m => m.lido).length,
  };

  if (loading) {
    return (
      <div className="mensagens-loading">
        <Loader2 size={40} className="spin" />
        <p>Carregando mensagens...</p>
      </div>
    );
  }

  return (
    <div className="mensagens-manager">
      <div className="manager-header">
        <div>
          <h1>Mensagens de Contacto</h1>
          <p>Gerencie as mensagens enviadas pelo formulário de contacto</p>
        </div>
        <button className="refresh-btn" onClick={loadMensagens}>
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {success && (
        <div className="success-message">
          <CheckCircle size={20} />
          <span>{success}</span>
          <button onClick={() => setSuccess(null)}>×</button>
        </div>
      )}

      <div className="mensagens-stats">
        <div className="stat-item total">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item unread">
          <span className="stat-value">{stats.unread}</span>
          <span className="stat-label">Não lidas</span>
        </div>
        <div className="stat-item read">
          <span className="stat-value">{stats.read}</span>
          <span className="stat-label">Lidas</span>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Pesquisar por nome, email, assunto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mensagens-table-container">
        <table className="mensagens-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Assunto</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredMensagens.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  Nenhuma mensagem encontrada
                </td>
              </tr>
            ) : (
              filteredMensagens.map((msg) => (
                <tr key={msg.id} className={!msg.lido ? "unread-row" : ""}>
                  <td>{msg.nome}</td>
                  <td>{msg.email}</td>
                  <td>{msg.assunto}</td>
                  <td>{formatDate(msg.createdAt || msg.data || msg.date)}</td>
                  <td>{getStatusBadge(msg.lido)}</td>
                  <td className="actions-cell">
                    <button
                      className="action-btn view"
                      onClick={() => {
                        setSelectedMensagem(msg);
                        if (!msg.lido) marcarComoLida(msg.id, msg.lido);
                      }}
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="action-btn reply"
                      onClick={() => window.location.href = `mailto:${msg.email}`}
                      title="Responder"
                    >
                      <Mail size={16} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => deleteMensagem(msg.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                   </td>
                 </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalhes */}
      <AnimatePresence>
        {selectedMensagem && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMensagem(null)}
          >
            <motion.div
              className="modal-mensagem"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Detalhes da Mensagem</h2>
                <button onClick={() => setSelectedMensagem(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-group">
                  <label><User size={14} /> Nome</label>
                  <p>{selectedMensagem.nome}</p>
                </div>
                <div className="detail-group">
                  <label><Mail size={14} /> Email</label>
                  <p>{selectedMensagem.email}</p>
                </div>
                {selectedMensagem.telefone && (
                  <div className="detail-group">
                    <label><Phone size={14} /> Telefone</label>
                    <p>{selectedMensagem.telefone}</p>
                  </div>
                )}
                <div className="detail-group">
                  <label>Assunto</label>
                  <p><strong>{selectedMensagem.assunto}</strong></p>
                </div>
                <div className="detail-group">
                  <label><Calendar size={14} /> Data de Envio</label>
                  <p>{formatDate(selectedMensagem.createdAt || selectedMensagem.data || selectedMensagem.date)}</p>
                </div>
                <div className="detail-group">
                  <label>Mensagem</label>
                  <div className="mensagem-text">
                    {selectedMensagem.mensagem}
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="reply-btn"
                  onClick={() => window.location.href = `mailto:${selectedMensagem.email}`}
                >
                  <Mail size={16} />
                  Responder por Email
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteMensagem(selectedMensagem.id)}
                >
                  <Trash2 size={16} />
                  Eliminar Mensagem
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}