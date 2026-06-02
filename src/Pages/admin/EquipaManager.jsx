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
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { equipaAPI } from "../services/equipaAPI";
import { auth } from "./auth";
import { API_BASE_URL } from "../config/api";
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
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    especialidade: "",
    email: "",
    telefone: "",
    bio: ""
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
      
      const data = await equipaAPI.getAllMembros(token);
      console.log("Membros carregados:", data);
      
      setMembros(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar membros:", error);
      setError(error.message || "Erro ao carregar membros");
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
      email: "",
      telefone: "",
      bio: ""
    });
    setImagePreview("");
    setImageFile(null);
    setEditingMembro(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("A imagem não pode exceder 2MB.");
        setTimeout(() => setError(null), 3000);
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError("Por favor, selecione uma imagem válida.");
        setTimeout(() => setError(null), 3000);
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
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
      if (editingMembro) {
        await equipaAPI.updateMembro(editingMembro.id, formData, token, imageFile);
        setSuccess("Membro atualizado com sucesso!");
      } else {
        await equipaAPI.createMembro(formData, token, imageFile);
        setSuccess("Membro adicionado com sucesso!");
      }
      
      await loadMembros();
      
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
    if (!window.confirm("Tem certeza que deseja eliminar este membro?")) return;
    
    try {
      await equipaAPI.deleteMembro(id, token);
      setSuccess("Membro eliminado com sucesso!");
      await loadMembros();
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
      nome: membro.nome || "",
      especialidade: membro.especialidade || "",
      email: membro.email || "",
      telefone: membro.telefone || "",
      bio: membro.bio || ""
    });
    
    if (membro.foto) {
      const fotoUrl = membro.foto.startsWith('http') ? membro.foto : `${API_BASE_URL}${membro.foto}`;
      setImagePreview(fotoUrl);
    } else {
      setImagePreview("");
    }
    setImageFile(null);
    setShowModal(true);
  };

  const MembroFoto = ({ foto, nome }) => {
    const [imgError, setImgError] = useState(false);
    
    if (!foto || imgError) {
      return (
        <div className="foto-placeholder">
          <ImageIcon size={32} />
        </div>
      );
    }
    
    const imageUrl = foto.startsWith('http') ? foto : `${API_BASE_URL}${foto}`;
    
    return (
      <img 
        src={imageUrl} 
        alt={nome}
        onError={() => setImgError(true)}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
      />
    );
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
          <span className="stat-value">{membros.length}</span>
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
                <MembroFoto foto={membro.foto} nome={membro.nome} />
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
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="+244 923 456 789"
                  />
                </div>

                <div className="form-group">
                  <label>Biografia</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Breve descrição do membro..."
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Foto (max 2MB)</label>
                  <div className="foto-upload">
                    <input
                      type="file"
                      id="foto"
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      className="upload-btn"
                      onClick={() => document.getElementById("foto").click()}
                    >
                      <Upload size={16} />
                      {imageFile || imagePreview ? "Trocar imagem" : "Carregar imagem"}
                    </button>
                    {imagePreview && (
                      <div className="foto-preview">
                        <img src={imagePreview} alt="Preview" />
                        <button
                          type="button"
                          className="remove-foto"
                          onClick={() => {
                            setImagePreview("");
                            setImageFile(null);
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <small>Formatos: JPG, PNG, WEBP. Máximo: 2MB</small>
                </div>

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