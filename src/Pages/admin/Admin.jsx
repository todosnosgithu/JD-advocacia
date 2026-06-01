// Admin.jsx - Página principal do painel administrativo
import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Image,
  FileText,
  Briefcase,
  Users,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { auth } from "./auth";
import { usuariosAPI } from "../services/usuariosAPI";
import "./Admin.css";

// Components do Admin
import AdminLogin from "./AdminLogin";
import DashboardOverview from "./DashboardOverview";
import GalleryManager from "./GalleryManager";
import RecrutamentoManager from "./RecrutamentoManager";
import CandidaturasManager from "./CandidaturasManager";
import HomeEditor from "./HomeEditor";
import ServicesEditor from "./ServicesEditor";
import AboutEditor from "./AboutEditor";
import SettingsManager from "./SettingsManager";
import MensagensManager from "./MensagensManager";
import UsuariosManager from "./UsuariosManager";
import EquipaManager from "./EquipaManager";
import ImagesManager from "./ImagesManager";


function AdminLayout({ children, onLogout, currentUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/galeria", icon: Image, label: "Galeria de Fotos" },
    { path: "/admin/home", icon: FileText, label: "Página Inicial" },
    { path: "/admin/servicos", icon: Briefcase, label: "Serviços" },
    { path: "/admin/sobre", icon: Users, label: "Sobre Nós" },
    { path: "/admin/recrutamento", icon: Mail, label: "Recrutamento" },
    { path: "/admin/candidaturas", icon: Users, label: "Candidaturas" },
    { path: "/admin/configuracoes", icon: Settings, label: "Configurações" },
    { path: "/admin/mensagens", icon: Mail, label: "Mensagens" },
    { path: "/admin/usuarios", icon: Users, label: "Usuários" },
    { path: "/admin/equipa", icon: Users, label: "Equipa" },
    { path: "/admin/imagens", icon: Image, label: "Imagens do Site" },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${!sidebarOpen ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">
            <span className="logo-icon">⚖️</span>
            {sidebarOpen && <span>Admin</span>}
          </h2>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {currentUser && sidebarOpen && (
            <div className="user-info-sidebar">
              <div className="user-avatar-sidebar">
                {currentUser.nome?.charAt(0) || "A"}
              </div>
              <div className="user-details-sidebar">
                <strong>{currentUser.nome || "Admin"}</strong>
                <span>{currentUser.cargo || "Administrador"}</span>
              </div>
            </div>
          )}
          <button className="sidebar-link logout" onClick={onLogout}>
            <LogOut size={20} />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    
    // Verificar autenticação periodicamente (a cada minuto)
    const interval = setInterval(() => {
      if (auth.isAuthenticated()) {
        const token = auth.getToken();
        if (!token) {
          handleLogout();
        }
      } else if (window.location.pathname !== "/admin/login") {
        handleLogout();
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const checkAuth = () => {
    setLoading(true);
    const authenticated = auth.isAuthenticated();
    const user = auth.getCurrentUser();
    
    setIsAuthenticated(authenticated);
    setCurrentUser(user);
    
    // Se estiver autenticado e estiver na página de login, redirecionar para dashboard
    if (authenticated && window.location.pathname === "/admin") {
      navigate("/admin/dashboard");
    }
    
    setLoading(false);
  };

  const handleLogin = async (email, senha) => {
    try {
      const response = await usuariosAPI.login({ email, senha });
      
      if (response.token && response.token.trim() !== "") {
        // Salvar dados de login usando o auth service
        auth.setLoginData(response.token, response.user);
        
        setIsAuthenticated(true);
        setCurrentUser(response.user);
        navigate("/admin/dashboard");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  const handleLogout = () => {
    auth.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <Loader2 size={40} className="spin" />
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminLayout onLogout={handleLogout} currentUser={currentUser}>
      <Routes>
        <Route path="dashboard" element={<DashboardOverview />} />
        <Route path="galeria" element={<GalleryManager />} />
        <Route path="home" element={<HomeEditor />} />
        <Route path="servicos" element={<ServicesEditor />} />
        <Route path="sobre" element={<AboutEditor />} />
        <Route path="recrutamento" element={<RecrutamentoManager />} />
        <Route path="candidaturas" element={<CandidaturasManager />} />
        <Route path="configuracoes" element={<SettingsManager />} />
        <Route path="/" element={<DashboardOverview />} />
        <Route path="mensagens" element={<MensagensManager />} />
        <Route path="usuarios" element={<UsuariosManager />} />
        <Route path="equipa" element={<EquipaManager />} />
        <Route path="imagens" element={<ImagesManager />} />
      </Routes>
    </AdminLayout>
  );
}