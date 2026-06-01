// src/Admin/UsuariosManager.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Search
} from "lucide-react";
import { usuariosAPI } from "../services/usuariosAPI";
import { auth } from "./auth";
import "./UsuariosManager.css";

export default function UsuariosManager() {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "admin"
  });

  const token = auth.getToken();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      auth.logout();
      return;
    }
    loadUsuarios();
  }, []);

  useEffect(() => {
    filterUsuarios();
  }, [searchTerm, usuarios]);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await usuariosAPI.getAllUsuarios(token);
      console.log("Usuários carregados:", data);
      
      setUsuarios(Array.isArray(data) ? data : []);
      localStorage.setItem("admin_usuarios", JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      const stored = JSON.parse(localStorage.getItem("admin_usuarios") || "[]");
      setUsuarios(stored);
      setError("Erro ao conectar com servidor. Mostrando dados locais.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const filterUsuarios = () => {
    let filtered = [...usuarios];
    
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredUsuarios(filtered);
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      senha: "",
      cargo: "admin"
    });
    setEditingUsuario(null);
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email) {
      setError("Por favor, preencha nome e email.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (!editingUsuario && !formData.senha) {
      setError("Por favor, preencha a senha.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingUsuario) {
        // Atualizar usuário existente
        const updateData = {
          nome: formData.nome,
          email: formData.email,
          cargo: formData.cargo
        };
        if (formData.senha) {
          updateData.senha = formData.senha;
        }
        
        await usuariosAPI.updateUsuario(editingUsuario.id, updateData, token);
        
        const updated = usuarios.map(u =>
          u.id === editingUsuario.id 
            ? { ...u, nome: formData.nome, email: formData.email, cargo: formData.cargo }
            : u
        );
        setUsuarios(updated);
        localStorage.setItem("admin_usuarios", JSON.stringify(updated));
        setSuccess("Usuário atualizado com sucesso!");
      } else {
        // Criar novo usuário
        const result = await usuariosAPI.createUsuario(formData, token);
        
        const newUsuario = {
          id: result.id || Date.now(),
          nome: formData.nome,
          email: formData.email,
          cargo: formData.cargo,
          createdAt: new Date().toISOString()
        };
        
        const updated = [...usuarios, newUsuario];
        setUsuarios(updated);
        localStorage.setItem("admin_usuarios", JSON.stringify(updated));
        setSuccess("Usuário criado com sucesso!");
      }
      
      setTimeout(() => setSuccess(null), 3000);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      setError(error.message || "Erro ao salvar usuário. Tente novamente.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const deleteUsuario = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar este usuário?")) return;
    
    setSaving(true);
    try {
      await usuariosAPI.deleteUsuario(id, token);
      
      const filtered = usuarios.filter(u => u.id !== id);
      setUsuarios(filtered);
      localStorage.setItem("admin_usuarios", JSON.stringify(filtered));
      setSuccess("Usuário eliminado com sucesso!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      setError(error.message || "Erro ao deletar usuário");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const editUsuario = (usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: "",
      cargo: usuario.cargo || "admin"
    });
    setShowModal(true);
  };

  const stats = {
    total: usuarios.length,
    admins: usuarios.filter(u => u.cargo === "admin").length
  };

  if (loading) {
    return (
      <div className="usuarios-loading">
        <Loader2 size={40} className="spin" />
        <p>Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="usuarios-manager">
      <div className="manager-header">
        <div>
          <h1>Gestão de Usuários</h1>
          <p>Gerencie os administradores do sistema</p>
        </div>
        <button className="refresh-btn" onClick={loadUsuarios}>
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

      <div className="usuarios-stats">
        <div className="stat-item total">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total de Usuários</span>
        </div>
        <div className="stat-item admins">
          <span className="stat-value">{stats.admins}</span>
          <span className="stat-label">Administradores</span>
        </div>
      </div>

      <div className="usuarios-actions">
        <button className="add-btn" onClick={() => {
          resetForm();
          setShowModal(true);
        }}>
          <UserPlus size={18} />
          Novo Usuário
        </button>
        
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Pesquisar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="usuarios-table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Cargo</th>
              <th>Data de Criação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              filteredUsuarios.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nome}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="cargo-badge admin">
                      <Shield size={12} />
                      {user.cargo === "admin" ? "Administrador" : user.cargo}
                    </span>
                  </td>
                  <td>
                    {new Date(user.createdAt || user.data_criacao).toLocaleDateString("pt-PT")}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="action-btn edit"
                      onClick={() => editUsuario(user)}
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => deleteUsuario(user.id)}
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

      {/* Modal de Adicionar/Editar */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-usuario"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editingUsuario ? "Editar Usuário" : "Novo Usuário"}</h2>
                <button onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-group">
                  <label>Nome Completo *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome do administrador"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@exemplo.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{editingUsuario ? "Nova Senha (opcional)" : "Senha *"}</label>
                  <div className="password-input">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.senha}
                      onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                      placeholder="••••••••"
                      required={!editingUsuario}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {editingUsuario && (
                    <small>Deixe em branco para manter a senha atual</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Cargo</label>
                  <select
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  >
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                {error && (
                  <div className="form-error">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="submit-btn" disabled={saving}>
                    {saving ? <Loader2 size={16} className="spin" /> : <CheckCircle size={16} />}
                    {saving ? "A guardar..." : editingUsuario ? "Guardar Alterações" : "Criar Usuário"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}