// src/Pages/admin/DashboardOverview.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  Image,
  Mail,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  AlertCircle,
  MessageSquare,
  Shield
} from "lucide-react";
import { candidaturasAPI } from "../services/candidaturasAPI";
import { contactoAPI } from "../services/contactoAPI";
import { usuariosAPI } from "../services/usuariosAPI";
import { auth } from "./auth";
import "../admin/DashboardOveriew.css";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalCandidaturas: 0,
    pendingCandidaturas: 0,
    approvedCandidaturas: 0,
    rejectedCandidaturas: 0,
    totalGaleria: 0,
    totalServicos: 0,
    totalVagas: 0,
    totalMensagens: 0,
    mensagensNaoLidas: 0,
    totalUsuarios: 0,
    totalAdmins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = auth.getToken();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      auth.logout();
      return;
    }
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!auth.isAuthenticated()) {
        auth.logout();
        return;
      }
      
      // Carregar candidaturas da API
      let candidaturas = [];
      try {
        candidaturas = await candidaturasAPI.getAllCandidaturas(token);
      } catch (error) {
        console.error("Erro ao carregar candidaturas:", error);
        candidaturas = JSON.parse(localStorage.getItem("candidaturas") || "[]");
      }
      
      // Carregar mensagens de contacto
      let mensagens = [];
      try {
        mensagens = await contactoAPI.getAllMensagens(token);
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
        mensagens = JSON.parse(localStorage.getItem("contacto_mensagens") || "[]");
      }
      
      // Carregar usuários do sistema
      let usuarios = [];
      try {
        usuarios = await usuariosAPI.getAllUsuarios(token);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        usuarios = JSON.parse(localStorage.getItem("admin_usuarios") || "[]");
      }
      
      // Carregar dados do localStorage
      const galeria = JSON.parse(localStorage.getItem("galeria_fotos") || "[]");
      const servicos = JSON.parse(localStorage.getItem("servicos_content") || "[]");
      const vagas = JSON.parse(localStorage.getItem("recrutamento_positions") || "[]");

      setStats({
        totalCandidaturas: candidaturas.length,
        pendingCandidaturas: candidaturas.filter(c => c.estado === "pendente" || c.estado === "em análise").length,
        approvedCandidaturas: candidaturas.filter(c => c.estado === "aprovado").length,
        rejectedCandidaturas: candidaturas.filter(c => c.estado === "reprovado").length,
        totalGaleria: galeria.length,
        totalServicos: servicos.length || 8,
        totalVagas: vagas.filter(v => v.active === true).length,
        totalMensagens: mensagens.length,
        mensagensNaoLidas: mensagens.filter(m => !m.lido).length,
        totalUsuarios: usuarios.length,
        totalAdmins: usuarios.filter(u => u.cargo === "admin").length,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      if (error.message.includes("401") || error.message.includes("não autenticado")) {
        auth.logout();
      } else {
        setError("Erro ao carregar estatísticas. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: Image, label: "Adicionar Foto", color: "#8b5cf6", path: "/admin/galeria" },
    { icon: Briefcase, label: "Editar Serviços", color: "#3b82f6", path: "/admin/servicos" },
    { icon: MessageSquare, label: "Ver Mensagens", color: "#10b981", path: "/admin/mensagens" },
    { icon: Mail, label: "Ver Candidaturas", color: "#f59e0b", path: "/admin/recrutamento" },
    { icon: Users, label: "Ver Vagas", color: "#ef4444", path: "/admin/recrutamento" },
    { icon: Shield, label: "Gerir Usuários", color: "#6366f1", path: "/admin/usuarios" },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader2 size={40} className="spin" />
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <AlertCircle size={48} />
        <p>{error}</p>
        <button onClick={loadStats}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Bem-vindo ao painel administrativo da Fulano Advocacia</p>
      </div>

      <div className="stats-grid">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon" style={{ background: "#3b82f6" }}>
            <Mail size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalCandidaturas}</h3>
            <p>Total de Candidaturas</p>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="stat-icon" style={{ background: "#10b981" }}>
            <MessageSquare size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalMensagens}</h3>
            <p>Mensagens Recebidas</p>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon" style={{ background: "#f59e0b" }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingCandidaturas}</h3>
            <p>Em Análise</p>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="stat-icon" style={{ background: "#f59e0b" }}>
            <Eye size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.mensagensNaoLidas}</h3>
            <p>Mensagens Não Lidas</p>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-icon" style={{ background: "#8b5cf6" }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.approvedCandidaturas}</h3>
            <p>Aprovadas</p>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="stat-icon" style={{ background: "#ef4444" }}>
            <Briefcase size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalVagas}</h3>
            <p>Vagas Ativas</p>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="stat-icon" style={{ background: "#8b5cf6" }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalUsuarios}</h3>
            <p>Usuários do Sistema</p>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="stat-icon" style={{ background: "#6366f1" }}>
            <Shield size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalAdmins}</h3>
            <p>Administradores</p>
          </div>
        </motion.div>
      </div>

      <div className="quick-actions">
        <h2>Ações Rápidas</h2>
        <div className="actions-grid">
          {quickActions.map((action, i) => (
            <motion.a
              key={action.label}
              href={action.path}
              className="action-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="action-icon" style={{ background: action.color }}>
                <action.icon size={24} />
              </div>
              <span>{action.label}</span>
            </motion.a>
          ))}
        </div>
      </div>

      <div className="recent-candidaturas">
        <h2>Últimas Candidaturas</h2>
        <RecentCandidaturasList />
      </div>

      <div className="recent-mensagens">
        <h2>Últimas Mensagens</h2>
        <RecentMensagensList />
      </div>
    </div>
  );
}

function RecentCandidaturasList() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = auth.getToken();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      auth.logout();
      return;
    }
    loadRecentCandidaturas();
  }, []);

  const loadRecentCandidaturas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!auth.isAuthenticated()) {
        auth.logout();
        return;
      }
      
      let allCandidaturas = [];
      try {
        allCandidaturas = await candidaturasAPI.getAllCandidaturas(token);
      } catch (error) {
        allCandidaturas = JSON.parse(localStorage.getItem("candidaturas") || "[]");
      }
      
      setCandidaturas(allCandidaturas.slice(-5).reverse());
    } catch (error) {
      console.error("Erro ao carregar candidaturas:", error);
      if (error.message.includes("401") || error.message.includes("não autenticado")) {
        auth.logout();
      } else {
        setError("Erro ao carregar candidaturas");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (estado) => {
    const statusConfig = {
      pendente: { label: "Pendente", class: "status-pending", icon: Clock },
      "em análise": { label: "Em Análise", class: "status-pending", icon: Clock },
      aprovado: { label: "Aprovada", class: "status-approved", icon: CheckCircle },
      reprovado: { label: "Rejeitada", class: "status-rejected", icon: XCircle },
    };
    const config = statusConfig[estado] || statusConfig.pendente;
    const Icon = config.icon;
    return (
      <span className={`status-badge ${config.class}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading-candidaturas">
        <Loader2 size={24} className="spin" />
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-candidaturas">
        <p>{error}</p>
        <button onClick={loadRecentCandidaturas}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="candidaturas-table">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Área</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {candidaturas.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                Nenhuma candidatura recebida
              </td>
            </tr>
          ) : (
            candidaturas.map((cand, i) => (
              <tr key={i}>
                <td>{cand.nome}</td>
                <td>{cand.email}</td>
                <td>{cand.area}</td>
                <td>{new Date(cand.createdAt || cand.date).toLocaleDateString("pt-PT")}</td>
                <td>{getStatusBadge(cand.estado)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function RecentMensagensList() {
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = auth.getToken();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      auth.logout();
      return;
    }
    loadRecentMensagens();
  }, []);

  const loadRecentMensagens = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!auth.isAuthenticated()) {
        auth.logout();
        return;
      }
      
      let allMensagens = [];
      try {
        allMensagens = await contactoAPI.getAllMensagens(token);
      } catch (error) {
        allMensagens = JSON.parse(localStorage.getItem("contacto_mensagens") || "[]");
      }
      
      setMensagens(allMensagens.slice(-5).reverse());
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      if (error.message.includes("401") || error.message.includes("não autenticado")) {
        auth.logout();
      } else {
        setError("Erro ao carregar mensagens");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-mensagens">
        <Loader2 size={24} className="spin" />
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-mensagens">
        <p>{error}</p>
        <button onClick={loadRecentMensagens}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="mensagens-table">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Assunto</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {mensagens.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                Nenhuma mensagem recebida
              </td>
            </tr>
          ) : (
            mensagens.map((msg, i) => (
              <tr key={i} className={!msg.lido ? "unread-row" : ""}>
                <td>{msg.nome}</td>
                <td>{msg.email}</td>
                <td>{msg.assunto}</td>
                <td>{new Date(msg.createdAt || msg.data || msg.date).toLocaleDateString("pt-PT")}</td>
                <td>
                  <span className={`status-badge ${msg.lido ? "read" : "unread"}`}>
                    {msg.lido ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {msg.lido ? "Lida" : "Não lida"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
