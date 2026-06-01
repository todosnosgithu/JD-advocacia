// src/Admin/EquipaManager.jsx
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
  Upload
} from "lucide-react";
import { equipaAPI } from "../services/equipaAPI";
import { auth } from "./auth";
import "./EquipaManager.css";

export default function EquipaManager() {
  const [membros, setMembros] = useState([]);
  const [filteredMembros, setFilteredMembros] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMembro, setEditingMembro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    especialidade: "",
    foto: ""
  });

  const token = auth.getToken();

  useEffect(() => {
    loadMembros();
  }, []);

  useEffect(() => {
    filterMembros();
  }, [searchTerm, membros]);

  const loadMembros = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Tentar carregar da API primeiro
      let data = [];
      try {
        data = await equipaAPI.getAllMembros(token);
        console.log("Membros carregados da API:", data);
      } catch (apiError) {
        console.error("Erro na API, usando localStorage:", apiError);
        // Fallback para localStorage
        const stored = localStorage.getItem("equipa_membros");
        if (stored) {
          data = JSON.parse(stored);
        } else {
          // Dados mockados iniciais
          data = [
            {
              id: 1,
              nome: "Dr. António Fulano",
              especialidade: "Sócio Fundador | Direito Comercial",
              foto: "",
              createdAt: new Date().toISOString()
            },
            {
              id: 2,
              nome: "Dra. Mariana Silva",
              especialidade: "Direito Civil e Família",
              foto: "",
              createdAt: new Date().toISOString()
            },
            {
              id: 3,
              nome: "Dr. Carlos Mendes",
              especialidade: "Direito do Trabalho",
              foto: "",
              createdAt: new Date().toISOString()
            }
          ];
        }
      }
      
      setMembros(Array.isArray(data) ? data : []);
      localStorage.setItem("equipa_membros", JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao carregar membros:", error);
      const stored = localStorage.getItem("equipa_membros");
      if (stored) {
        setMembros(JSON.parse(stored));
      } else {
        setMembros([]);
      }
      setError("Erro ao conectar com servidor. Usando dados locais.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const filterMembros = () => {
    let filtered = [...membros];
    
    if (searchTerm) {
      filtered = filtered.filter(membro =>
        membro.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        membro.especialidade?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredMembros(filtered);
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      especialidade: "",
      foto: ""
    });
    setImagePreview("");
    setEditingMembro(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.especialidade) {
      setError("Por favor, preencha nome e especialidade.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      let updated;
      
      if (editingMembro) {
        // Atualizar membro existente
        updated = membros.map(m =>
          m.id === editingMembro.id 
            ? { ...m, ...formData, updatedAt: new Date().toISOString() }
            : m
        );
        setSuccess("Membro atualizado com sucesso!");
      } else {
        // Criar novo membro
        const newMembro = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        updated = [...membros, newMembro];
        setSuccess("Membro adicionado com sucesso!");
      }
      
      // Salvar no localStorage
      setMembros(updated);
      localStorage.setItem("equipa_membros", JSON.stringify(updated));
      
      // Tentar salvar na API (opcional, não bloqueia)
      try {
        if (editingMembro) {
          await equipaAPI.updateMembro(editingMembro.id, formData, token);
        } else {
          await equipaAPI.createMembro(formData, token);
        }
      } catch (apiError) {
        console.log("API offline, dados salvos apenas localmente");
      }
      
      setTimeout(() => setSuccess(null), 3000);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar membro:", error);
      setError(error.message || "Erro ao salvar membro. Tente novamente.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const deleteMembro = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar este membro da equipa?")) return;
    
    try {
      const filtered = membros.filter(m => m.id !== id);
      setMembros(filtered);
      localStorage.setItem("equipa_membros", JSON.stringify(filtered));
      setSuccess("Membro eliminado com sucesso!");
      
      // Tentar deletar da API
      try {
        await equipaAPI.deleteMembro(id, token);
      } catch (apiError) {
        console.log("API offline, dados removidos apenas localmente");
      }
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Erro ao deletar membro:", error);
      setError("Erro ao deletar membro");
      setTimeout(() => setError(null), 3000);
    }
  };

  const editMembro = (membro) => {
    setEditingMembro(membro);
    setFormData({
      nome: membro.nome,
      especialidade: membro.especialidade,
      foto: membro.foto || ""
    });
    setImagePreview(membro.foto || "");
    setShowModal(true);
  };

  const stats = {
    total: membros.length
  };

  if (loading) {
    return (
      <div className="equipa-loading">
        <Loader2 size={40} className="spin" />
        <p>Carregando equipa...</p>
      </div>
    );
  }

  return (
    <div className="equipa-manager">
      <div className="manager-header">
        <div>
          <h1>Gestão da Equipa</h1>
          <p>Gerencie os membros da equipa exibidos na página Sobre</p>
        </div>
        <button className="refresh-btn" onClick={loadMembros}>
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

      <div className="equipa-stats">
        <div className="stat-item total">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Membros da Equipa</span>
        </div>
      </div>

      <div className="equipa-actions">
        <button className="add-btn" onClick={() => {
          resetForm();
          setShowModal(true);
        }}>
          <UserPlus size={18} />
          Adicionar Membro
        </button>
        
        <div className="search-box">
          <input
            type="text"
            placeholder="Pesquisar por nome ou especialidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="equipa-grid">
        {filteredMembros.length === 0 ? (
          <div className="no-data">
            <Users size={48} />
            <p>Nenhum membro encontrado</p>
            <button onClick={() => setShowModal(true)}>Adicionar primeiro membro</button>
          </div>
        ) : (
          filteredMembros.map((membro) => (
            <motion.div
              key={membro.id}
              className="membro-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
            >
              <div className="membro-foto">
                {membro.foto ? (
                  <img src={membro.foto} alt={membro.nome} />
                ) : (
                  <div className="foto-placeholder">
                    <Users size={32} />
                  </div>
                )}
              </div>
              <div className="membro-info">
                <h3>{membro.nome}</h3>
                <p className="membro-especialidade">{membro.especialidade}</p>
              </div>
              <div className="membro-actions">
                <button className="edit-btn" onClick={() => editMembro(membro)}>
                  <Edit2 size={16} />
                </button>
                <button className="delete-btn" onClick={() => deleteMembro(membro.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
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
              className="modal-equipa"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editingMembro ? "Editar Membro" : "Novo Membro"}</h2>
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
                    placeholder="Nome do membro"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Especialidade *</label>
                  <input
                    type="text"
                    value={formData.especialidade}
                    onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                    placeholder="Ex: Direito Civil, Sócio Fundador"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Foto</label>
                  <div className="foto-upload">
                    <input
                      type="file"
                      id="foto"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      className="upload-btn"
                      onClick={() => document.getElementById("foto").click()}
                    >
                      <Upload size={16} />
                      Carregar imagem
                    </button>
                    {imagePreview && (
                      <div className="foto-preview">
                        <img src={imagePreview} alt="Preview" />
                        <button
                          type="button"
                          className="remove-foto"
                          onClick={() => {
                            setImagePreview("");
                            setFormData({ ...formData, foto: "" });
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <small>Formatos: PNG, JPG, JPEG. Tamanho máximo: 2MB</small>
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
                    {saving ? "A guardar..." : editingMembro ? "Guardar Alterações" : "Adicionar Membro"}
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