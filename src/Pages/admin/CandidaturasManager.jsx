// src/Admin/CandidaturasManager.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Mail,
  Clock,
  Search,
  RefreshCw,
  Filter,
  AlertCircle,
  Loader2,
  User,
  Briefcase,
  Calendar
} from "lucide-react";
import { candidaturasAPI } from "../services/candidaturasAPI";
import { auth } from "./auth";
import "./CandidaturasManager.css";

export default function CandidaturasManager() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedCandidatura, setSelectedCandidatura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = auth.getToken();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      auth.logout();
      return;
    }
    loadCandidaturas();
  }, []);

  const loadCandidaturas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!auth.isAuthenticated()) {
        auth.logout();
        return;
      }
      
      let data = [];
      try {
        const response = await candidaturasAPI.getAllCandidaturas(token);
        data = response.candidaturas || response.data || response || [];
      } catch (apiError) {
        console.error("Erro na API, usando localStorage:", apiError);
        data = JSON.parse(localStorage.getItem("candidaturas") || "[]");
      }
      
      // Ordenar por data (mais recentes primeiro)
      const sorted = Array.isArray(data) ? data.sort((a, b) => 
        new Date(b.createdAt || b.data || b.date) - new Date(a.createdAt || a.data || a.date)
      ) : [];
      
      setCandidaturas(sorted);
      localStorage.setItem("candidaturas", JSON.stringify(sorted));
    } catch (error) {
      console.error("Erro ao carregar candidaturas:", error);
      setError(error.message);
      const stored = JSON.parse(localStorage.getItem("candidaturas") || "[]");
      setCandidaturas(stored);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      if (!auth.isAuthenticated()) {
        auth.logout();
        return;
      }
      
      await candidaturasAPI.updateCandidaturaStatus(id, status, token);
      setSuccess(`Candidatura ${status === "aprovado" ? "aprovada" : status === "reprovado" ? "rejeitada" : "em análise"} com sucesso!`);
      
      // Atualizar estado local
      const updated = candidaturas.map((c) =>
        c.id === id ? { ...c, estado: status } : c
      );
      setCandidaturas(updated);
      localStorage.setItem("candidaturas", JSON.stringify(updated));
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      // Fallback para localStorage
      const updated = candidaturas.map((c) =>
        c.id === id ? { ...c, estado: status } : c
      );
      setCandidaturas(updated);
      localStorage.setItem("candidaturas", JSON.stringify(updated));
      setSuccess("Status atualizado localmente!");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const deleteCandidatura = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar esta candidatura?")) return;
    
    try {
      if (!auth.isAuthenticated()) {
        auth.logout();
        return;
      }
      
      await candidaturasAPI.deleteCandidatura(id, token);
      setSuccess("Candidatura eliminada com sucesso!");
      
      const filtered = candidaturas.filter((c) => c.id !== id);
      setCandidaturas(filtered);
      localStorage.setItem("candidaturas", JSON.stringify(filtered));
      
      if (selectedCandidatura?.id === id) {
        setSelectedCandidatura(null);
      }
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Erro ao deletar candidatura:", error);
      const filtered = candidaturas.filter((c) => c.id !== id);
      setCandidaturas(filtered);
      localStorage.setItem("candidaturas", JSON.stringify(filtered));
      if (selectedCandidatura?.id === id) {
        setSelectedCandidatura(null);
      }
      setSuccess("Candidatura eliminada localmente!");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const getStatusBadge = (estado) => {
    const config = {
      pendente: { label: "Pendente", class: "status-pending", icon: Clock },
      "em análise": { label: "Em Análise", class: "status-analyzing", icon: Clock },
      aprovado: { label: "Aprovada", class: "status-approved", icon: CheckCircle },
      reprovado: { label: "Rejeitada", class: "status-rejected", icon: XCircle },
    };
    const item = config[estado?.toLowerCase()] || config.pendente;
    const Icon = item.icon;
    return (
      <span className={`status-badge ${item.class}`}>
        <Icon size={12} />
        {item.label}
      </span>
    );
  };

  const filteredCandidaturas = candidaturas.filter((c) => {
    if (filter !== "all" && c.estado?.toLowerCase() !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        c.nome?.toLowerCase().includes(searchLower) ||
        c.email?.toLowerCase().includes(searchLower) ||
        c.assunto?.toLowerCase().includes(searchLower) ||
        c.area?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const stats = {
    total: candidaturas.length,
    pendente: candidaturas.filter((c) => c.estado === "pendente").length,
    emAnalise: candidaturas.filter((c) => c.estado === "em análise").length,
    aprovado: candidaturas.filter((c) => c.estado === "aprovado").length,
    reprovado: candidaturas.filter((c) => c.estado === "reprovado").length,
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

  if (loading) {
    return (
      <div className="candidaturas-loading">
        <Loader2 size={40} className="spin" />
        <p>Carregando candidaturas...</p>
      </div>
    );
  }

  return (
    <div className="candidaturas-manager">
      <div className="manager-header">
        <div>
          <h1>Candidaturas</h1>
          <p>Gerencie todas as candidaturas recebidas para recrutamento</p>
        </div>
        <button className="refresh-btn" onClick={loadCandidaturas}>
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{error} - Usando dados locais</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {success && (
        <div className="success-banner">
          <CheckCircle size={18} />
          <span>{success}</span>
          <button onClick={() => setSuccess(null)}>×</button>
        </div>
      )}

      {/* Stats */}
      <div className="candidaturas-stats">
        <div className="stat-item total">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item pendente">
          <span className="stat-value">{stats.pendente}</span>
          <span className="stat-label">Pendentes</span>
        </div>
        <div className="stat-item analyzing">
          <span className="stat-value">{stats.emAnalise}</span>
          <span className="stat-label">Em Análise</span>
        </div>
        <div className="stat-item aprovado">
          <span className="stat-value">{stats.aprovado}</span>
          <span className="stat-label">Aprovadas</span>
        </div>
        <div className="stat-item reprovado">
          <span className="stat-value">{stats.reprovado}</span>
          <span className="stat-label">Rejeitadas</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-buttons">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
            Todas
          </button>
          <button className={filter === "pendente" ? "active" : ""} onClick={() => setFilter("pendente")}>
            Pendentes
          </button>
          <button className={filter === "em análise" ? "active" : ""} onClick={() => setFilter("em análise")}>
            Em Análise
          </button>
          <button className={filter === "aprovado" ? "active" : ""} onClick={() => setFilter("aprovado")}>
            Aprovadas
          </button>
          <button className={filter === "reprovado" ? "active" : ""} onClick={() => setFilter("reprovado")}>
            Rejeitadas
          </button>
        </div>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Pesquisar por nome, email, assunto ou área..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="candidaturas-table-container">
        <table className="candidaturas-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Assunto</th>
              <th>Nível</th>
              <th>Área</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidaturas.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  Nenhuma candidatura encontrada
                </td>
              </tr>
            ) : (
              filteredCandidaturas.map((cand) => (
                <tr key={cand.id}>
                  <td>{cand.nome}</td>
                  <td>{cand.email}</td>
                  <td>{cand.assunto}</td>
                  <td>{cand.nivel}</td>
                  <td>{cand.area}</td>
                  <td>{formatDate(cand.createdAt || cand.data || cand.date)}</td>
                  <td>{getStatusBadge(cand.estado)}</td>
                  <td className="actions-cell">
                    <button
                      className="action-btn view"
                      onClick={() => setSelectedCandidatura(cand)}
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="action-btn mail"
                      onClick={() => window.location.href = `mailto:${cand.email}`}
                      title="Enviar email"
                    >
                      <Mail size={16} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => deleteCandidatura(cand.id)}
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
        {selectedCandidatura && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCandidatura(null)}
          >
            <motion.div
              className="modal-candidatura"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Detalhes da Candidatura</h2>
                <button onClick={() => setSelectedCandidatura(null)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="detail-group">
                  <label><User size={14} /> Nome Completo</label>
                  <p>{selectedCandidatura.nome}</p>
                </div>
                <div className="detail-group">
                  <label><Mail size={14} /> Email</label>
                  <p>{selectedCandidatura.email}</p>
                </div>
                <div className="detail-group">
                  <label><Briefcase size={14} /> Assunto</label>
                  <p>{selectedCandidatura.assunto}</p>
                </div>
                <div className="detail-group">
                  <label><Clock size={14} /> Nível de Experiência</label>
                  <p>{selectedCandidatura.nivel}</p>
                </div>
                <div className="detail-group">
                  <label><Briefcase size={14} /> Área de Interesse</label>
                  <p>{selectedCandidatura.area}</p>
                </div>
                <div className="detail-group">
                  <label><Calendar size={14} /> Data de Envio</label>
                  <p>{formatDate(selectedCandidatura.createdAt || selectedCandidatura.data || selectedCandidatura.date)}</p>
                </div>
                <div className="detail-group">
                  <label>Detalhes / Carta de Motivação</label>
                  <div className="mensagem-text">
                    {selectedCandidatura.detalhes}
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="analyze-btn"
                  onClick={() => {
                    updateStatus(selectedCandidatura.id, "em análise");
                    setSelectedCandidatura(null);
                  }}
                >
                  <Clock size={16} />
                  Em Análise
                </button>
                <button
                  className="approve-btn"
                  onClick={() => {
                    updateStatus(selectedCandidatura.id, "aprovado");
                    setSelectedCandidatura(null);
                  }}
                >
                  <CheckCircle size={16} />
                  Aprovar
                </button>
                <button
                  className="reject-btn"
                  onClick={() => {
                    updateStatus(selectedCandidatura.id, "reprovado");
                    setSelectedCandidatura(null);
                  }}
                >
                  <XCircle size={16} />
                  Rejeitar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}