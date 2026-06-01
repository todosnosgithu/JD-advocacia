// src/Pages/admin/DashboardOverview.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, Briefcase, Calendar, MessageSquare, TrendingUp, TrendingDown, 
  RefreshCw, FileText, Star, Clock, CheckCircle, 
  XCircle, AlertCircle, Activity, UserPlus, UserCheck, 
  Settings, PlusCircle, Edit3, CheckSquare, Zap, Shield, Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usuariosAPI } from "../services/usuariosAPI";
import { equipaAPI } from "../services/equipaAPI";
import { candidaturasAPI } from "../services/candidaturasAPI";
import { contactoAPI } from "../services/contactoAPI";
import { auth } from "./auth";
import "./DashboardOverview.css";

const StatCard = ({ title, value, icon: Icon, trend, color, subtitle, link, onClick }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (onClick) onClick();
    if (link) navigate(link);
  };
  
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
    >
      <div className="stat-card-header">
        <div className={`stat-icon ${color}`}>
          <Icon size={24} />
        </div>
        {trend !== undefined && trend !== null && (
          <div className="stat-trend positive">
            <TrendingUp size={14} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </motion.div>
  );
};

const ActivityItem = ({ icon, title, time, status, color, onClick }) => (
  <div className="activity-item" onClick={onClick}>
    <div className={`activity-icon ${color}`}>
      {icon}
    </div>
    <div className="activity-content">
      <div className="activity-title">{title}</div>
      <div className="activity-time">{time}</div>
    </div>
    {status === "success" && <CheckCircle size={14} className="status-success" />}
    {status === "pending" && <Clock size={14} className="status-pending" />}
  </div>
);

const PendingTask = ({ task, deadline, priority, onClick }) => (
  <div className="pending-task-item" onClick={onClick}>
    <div className={`task-priority ${priority}`} />
    <div className="task-content">
      <div className="task-title">{task}</div>
      <div className="task-deadline">
        <Clock size={12} />
        <span>{deadline}</span>
      </div>
    </div>
    <button className="task-action">Ver</button>
  </div>
);

export default function DashboardOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalEquipa: 0,
    totalServicos: 0,
    totalAgendamentos: 0,
    novosUsuariosPeriodo: 0,
    crescimentoPercentual: 0,
    usuariosAtivos: 0,
    usuariosInativos: 0,
    candidaturasPendentes: 0,
    mensagensNaoLidas: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("semana");
  const [allUsuarios, setAllUsuarios] = useState([]);
  const [allMensagens, setAllMensagens] = useState([]);
  const [allCandidaturas, setAllCandidaturas] = useState([]);

  useEffect(() => {
    loadStats();
  }, [selectedPeriod]);

  const getDateFilter = () => {
    const now = new Date();
    switch(selectedPeriod) {
      case "semana":
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return weekAgo;
      case "mes":
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return monthAgo;
      case "ano":
        const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        return yearAgo;
      default:
        return new Date(now.setDate(now.getDate() - 7));
    }
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");

      if (!auth.isAuthenticated()) {
        window.location.href = "/admin/login";
        return;
      }

      const token = auth.getToken();
      const dateFilter = getDateFilter();
      
      // Carregar usuários da API
      let usuarios = [];
      try {
        const usuariosData = await usuariosAPI.getAllUsuarios(token);
        usuarios = Array.isArray(usuariosData) ? usuariosData : [];
        setAllUsuarios(usuarios);
      } catch (err) {
        console.error("Erro ao carregar usuários:", err);
        usuarios = [];
      }

      // Carregar equipa da API
      let equipa = [];
      try {
        const equipaData = await equipaAPI.getAllMembros(token);
        equipa = Array.isArray(equipaData) ? equipaData : [];
      } catch (err) {
        console.error("Erro ao carregar equipa:", err);
        equipa = [];
      }

      // Carregar candidaturas da API
      let candidaturas = [];
      try {
        const candidaturasData = await candidaturasAPI.getAllCandidaturas(token);
        candidaturas = candidaturasData.candidaturas || (Array.isArray(candidaturasData) ? candidaturasData : []);
        setAllCandidaturas(candidaturas);
      } catch (err) {
        console.error("Erro ao carregar candidaturas:", err);
        candidaturas = [];
      }

      // Carregar mensagens da API
      let mensagens = [];
      try {
        const mensagensData = await contactoAPI.getAllMensagens(token);
        mensagens = Array.isArray(mensagensData) ? mensagensData : [];
        setAllMensagens(mensagens);
      } catch (err) {
        console.error("Erro ao carregar mensagens:", err);
        mensagens = [];
      }

      // Filtrar dados pelo período selecionado
      const novosUsuariosPeriodo = usuarios.filter(u => {
        if (!u.createdAt) return false;
        return new Date(u.createdAt) >= dateFilter;
      }).length;

      const novasMensagens = mensagens.filter(m => {
        if (!m.createdAt) return false;
        return new Date(m.createdAt) >= dateFilter;
      }).length;

      const novasCandidaturas = candidaturas.filter(c => {
        if (!c.createdAt) return false;
        return new Date(c.createdAt) >= dateFilter;
      }).length;

      const totalUsuarios = usuarios.length;
      const totalEquipa = equipa.length;
      const usuariosAtivos = usuarios.filter(u => u && u.ativo !== false).length;
      const usuariosInativos = totalUsuarios - usuariosAtivos;
      
      const candidaturasPendentes = candidaturas.filter(c => c && c.estado === "pendente").length;
      const mensagensNaoLidas = mensagens.filter(m => m && !m.lida).length;
      
      // Calcular crescimento percentual baseado no período
      const usuariosAnterior = usuarios.filter(u => {
        if (!u.createdAt) return false;
        const olderDate = new Date(dateFilter);
        olderDate.setDate(olderDate.getDate() - 7);
        return new Date(u.createdAt) >= olderDate && new Date(u.createdAt) < dateFilter;
      }).length;
      
      const crescimentoPercentual = usuariosAnterior > 0 
        ? Math.round(((novosUsuariosPeriodo - usuariosAnterior) / usuariosAnterior) * 100)
        : novosUsuariosPeriodo > 0 ? 100 : 0;

      setStats({
        totalUsuarios,
        totalEquipa,
        totalServicos: 8,
        totalAgendamentos: mensagens.length,
        novosUsuariosPeriodo,
        crescimentoPercentual,
        usuariosAtivos,
        usuariosInativos,
        candidaturasPendentes,
        mensagensNaoLidas
      });

    } catch (err) {
      console.error("Erro ao carregar estatísticas:", err);
      setError(err.message || "Erro ao carregar estatísticas");
    } finally {
      setLoading(false);
    }
  };

  // Gerar atividades recentes baseadas nos dados reais
  const getRecentActivities = () => {
    const activities = [];
    
    // Últimos usuários
    const recentUsers = [...allUsuarios]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);
    
    recentUsers.forEach(user => {
      if (user && user.nome) {
        activities.push({
          id: `user-${user.id}`,
          icon: <UserPlus size={14} />,
          title: `Novo usuário registrado: ${user.nome}`,
          time: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recentemente",
          status: "success",
          color: "green",
          onClick: () => navigate("/admin/usuarios")
        });
      }
    });

    // Últimas mensagens
    const recentMensagens = [...allMensagens]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 1);
    
    recentMensagens.forEach(msg => {
      if (msg && msg.nome) {
        activities.push({
          id: `msg-${msg.id}`,
          icon: <MessageSquare size={14} />,
          title: `Nova mensagem de ${msg.nome}`,
          time: msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : "Recentemente",
          status: !msg.lida ? "pending" : "success",
          color: "blue",
          onClick: () => navigate("/admin/mensagens")
        });
      }
    });

    // Últimas candidaturas
    const recentCandidaturas = [...allCandidaturas]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 1);
    
    recentCandidaturas.forEach(cand => {
      if (cand && cand.nome) {
        activities.push({
          id: `cand-${cand.id}`,
          icon: <FileText size={14} />,
          title: `Nova candidatura de ${cand.nome}`,
          time: cand.createdAt ? new Date(cand.createdAt).toLocaleDateString() : "Recentemente",
          status: cand.estado === "pendente" ? "pending" : "success",
          color: "orange",
          onClick: () => navigate("/admin/candidaturas")
        });
      }
    });

    return activities.slice(0, 4);
  };

  const getPendingTasks = () => {
    const tasks = [];
    
    if (stats.candidaturasPendentes > 0) {
      tasks.push({
        id: 1,
        task: `Revisar ${stats.candidaturasPendentes} candidatura(s) pendente(s)`,
        deadline: "Hoje",
        priority: stats.candidaturasPendentes > 3 ? "high" : "medium",
        onClick: () => navigate("/admin/candidaturas")
      });
    }
    
    if (stats.mensagensNaoLidas > 0) {
      tasks.push({
        id: 2,
        task: `Responder ${stats.mensagensNaoLidas} mensagem(ns) não lida(s)`,
        deadline: "Hoje",
        priority: stats.mensagensNaoLidas > 2 ? "high" : "medium",
        onClick: () => navigate("/admin/mensagens")
      });
    }
    
    if (tasks.length === 0) {
      tasks.push({
        id: 3,
        task: "Nenhuma tarefa pendente",
        deadline: "Tudo em dia!",
        priority: "low",
        onClick: () => {}
      });
    }
    
    return tasks;
  };

  const recentActivities = getRecentActivities();
  const pendingTasks = getPendingTasks();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>A carregar estatísticas...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral e gestão do sistema</p>
        </div>
        <div className="header-actions">
          <div className="period-selector">
            <button 
              className={selectedPeriod === "semana" ? "active" : ""}
              onClick={() => setSelectedPeriod("semana")}
            >
              Semana
            </button>
            <button 
              className={selectedPeriod === "mes" ? "active" : ""}
              onClick={() => setSelectedPeriod("mes")}
            >
              Mês
            </button>
            <button 
              className={selectedPeriod === "ano" ? "active" : ""}
              onClick={() => setSelectedPeriod("ano")}
            >
              Ano
            </button>
          </div>
          <button onClick={loadStats} className="refresh-button" disabled={loading}>
            <RefreshCw size={18} className={loading ? "spin" : ""} />
          </button>
        </div>
      </div>

      {error && (
        <div className="dashboard-error">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Stats Grid - 4 cards principais */}
      <div className="stats-grid">
        <StatCard 
          title="Total de Utilizadores" 
          value={stats.totalUsuarios} 
          icon={Users} 
          trend={stats.crescimentoPercentual} 
          color="blue" 
          subtitle={`+${stats.novosUsuariosPeriodo} neste período`} 
          link="/admin/usuarios" 
        />
        <StatCard 
          title="Membros da Equipa" 
          value={stats.totalEquipa} 
          icon={Briefcase} 
          color="green" 
          subtitle="Equipa ativa" 
          link="/admin/equipa" 
        />
        <StatCard 
          title="Serviços Ativos" 
          value={stats.totalServicos} 
          icon={Star} 
          color="purple" 
          subtitle="Disponíveis" 
          link="/admin/servicos" 
        />
        <StatCard 
          title="Contactos" 
          value={stats.totalAgendamentos} 
          icon={MessageSquare} 
          color="orange" 
          subtitle={`${stats.mensagensNaoLidas} não lidas`} 
          link="/admin/mensagens" 
        />
      </div>

      {/* Secondary Stats - 2 cards */}
      <div className="stats-grid-secondary">
        <StatCard 
          title="Candidaturas Pendentes" 
          value={stats.candidaturasPendentes} 
          icon={FileText} 
          color="orange" 
          subtitle="Aguardando revisão" 
          link="/admin/candidaturas" 
        />
        <StatCard 
          title="Usuários Ativos" 
          value={stats.usuariosAtivos} 
          icon={UserCheck} 
          color="green" 
          subtitle={`${stats.usuariosInativos} inativos`} 
          link="/admin/usuarios" 
        />
      </div>

      {/* Activities and Tasks */}
      <div className="two-columns">
        <div className="chart-card">
          <div className="card-header">
            <h3><Activity size={18} /> Atividades Recentes</h3>
            <button className="view-all-btn" onClick={() => navigate("/admin/usuarios")}>Ver todas</button>
          </div>
          <div className="activities-list">
            {recentActivities.map(activity => (
              <ActivityItem key={activity.id} {...activity} />
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h3><CheckSquare size={18} /> Tarefas Pendentes</h3>
            <button className="view-all-btn">Ver tudo</button>
          </div>
          <div className="pending-tasks-list">
            {pendingTasks.map(task => (
              <PendingTask key={task.id} {...task} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="footer-stats">
        <div className="footer-stat-card" onClick={() => navigate("/admin/configuracoes")}>
          <div className="footer-stat-icon blue"><Shield size={18} /></div>
          <div className="footer-stat-info">
            <span>Segurança</span>
            <strong>Nível Alto</strong>
          </div>
        </div>
        <div className="footer-stat-card" onClick={() => navigate("/admin/mensagens")}>
          <div className="footer-stat-icon green"><Bell size={18} /></div>
          <div className="footer-stat-info">
            <span>Notificações</span>
            <strong>{stats.mensagensNaoLidas + stats.candidaturasPendentes} novas</strong>
          </div>
        </div>
        <div className="footer-stat-card" onClick={() => navigate("/admin/candidaturas")}>
          <div className="footer-stat-icon orange"><FileText size={18} /></div>
          <div className="footer-stat-info">
            <span>Candidaturas</span>
            <strong>{stats.candidaturasPendentes} pendentes</strong>
          </div>
        </div>
        <div className="footer-stat-card" onClick={() => navigate("/admin/servicos")}>
          <div className="footer-stat-icon purple"><Briefcase size={18} /></div>
          <div className="footer-stat-info">
            <span>Serviços</span>
            <strong>{stats.totalServicos} ativos</strong>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-header">
        <h3><PlusCircle size={20} /> Ações Rápidas</h3>
      </div>
      <div className="quick-actions-grid">
        <button className="quick-action-btn" onClick={() => navigate("/admin/usuarios")}>
          <UserPlus size={16} /> Novo Usuário
        </button>
        <button className="quick-action-btn" onClick={() => navigate("/admin/equipa")}>
          <Users size={16} /> Adicionar Membro
        </button>
        <button className="quick-action-btn" onClick={() => navigate("/admin/servicos")}>
          <Briefcase size={16} /> Novo Serviço
        </button>
        <button className="quick-action-btn" onClick={() => navigate("/admin/candidaturas")}>
          <FileText size={16} /> Nova Vaga
        </button>
      </div>
    </div>
  );
}