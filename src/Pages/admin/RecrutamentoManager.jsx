// src/Admin/RecrutamentoManager.jsx - Apenas para gestão de vagas
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Briefcase,
  MapPin,
  Clock
} from "lucide-react";
import "./RecrutamentoManager.css";

export default function RecrutamentoManager() {
  const [vagas, setVagas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVaga, setEditingVaga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "Luanda, Angola",
    type: "Tempo Integral",
    active: true
  });

  useEffect(() => {
    loadVagas();
  }, []);

  const loadVagas = () => {
    try {
      setLoading(true);
      const stored = JSON.parse(localStorage.getItem("recrutamento_positions") || "[]");
      setVagas(stored);
    } catch (error) {
      console.error("Erro ao carregar vagas:", error);
      setError("Erro ao carregar vagas");
    } finally {
      setLoading(false);
    }
  };

  const saveVagas = (newVagas) => {
    localStorage.setItem("recrutamento_positions", JSON.stringify(newVagas));
    setVagas(newVagas);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "Luanda, Angola",
      type: "Tempo Integral",
      active: true
    });
    setEditingVaga(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError("Preencha o título e descrição da vaga");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setSaving(true);

    if (editingVaga) {
      const updated = vagas.map(v =>
        v.id === editingVaga.id ? { ...formData, id: v.id } : v
      );
      saveVagas(updated);
      setSuccess("Vaga atualizada com sucesso!");
    } else {
      const newVaga = {
        ...formData,
        id: Date.now(),
        active: true,
        createdAt: new Date().toISOString()
      };
      saveVagas([...vagas, newVaga]);
      setSuccess("Vaga criada com sucesso!");
    }

    setTimeout(() => setSuccess(null), 3000);
    setShowModal(false);
    resetForm();
    setSaving(false);
  };

  const deleteVaga = (id) => {
    if (window.confirm("Tem certeza que deseja eliminar esta vaga?")) {
      const filtered = vagas.filter(v => v.id !== id);
      saveVagas(filtered);
      setSuccess("Vaga eliminada com sucesso!");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const toggleActive = (id) => {
    const updated = vagas.map(v =>
      v.id === id ? { ...v, active: !v.active } : v
    );
    saveVagas(updated);
  };

  if (loading) {
    return (
      <div className="recrutamento-loading">
        <Loader2 size={40} className="spin" />
        <p>Carregando vagas...</p>
      </div>
    );
  }

  return (
    <div className="recrutamento-manager">
      <div className="manager-header">
        <div>
          <h1>Gestão de Vagas</h1>
          <p>Gerencie as vagas de recrutamento disponíveis no site</p>
        </div>
        <button className="refresh-btn" onClick={loadVagas}>
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
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

      <div className="vagas-actions">
        <button className="add-btn" onClick={() => {
          resetForm();
          setShowModal(true);
        }}>
          <Plus size={18} />
          Nova Vaga
        </button>
      </div>

      <div className="vagas-list">
        {vagas.length === 0 ? (
          <div className="no-data">
            <Briefcase size={48} />
            <p>Nenhuma vaga cadastrada</p>
            <button onClick={() => setShowModal(true)}>Criar primeira vaga</button>
          </div>
        ) : (
          vagas.map((vaga) => (
            <motion.div
              key={vaga.id}
              className="vaga-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
            >
              <div className="vaga-header">
                <h3>{vaga.title}</h3>
                <div className="vaga-actions">
                  <button className="edit-btn" onClick={() => {
                    setEditingVaga(vaga);
                    setFormData(vaga);
                    setShowModal(true);
                  }}>
                    <Edit2 size={16} />
                  </button>
                  <button className="delete-btn" onClick={() => deleteVaga(vaga.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="vaga-description">{vaga.description}</p>
              <div className="vaga-meta">
                <span><MapPin size={14} /> {vaga.location}</span>
                <span><Clock size={14} /> {vaga.type}</span>
              </div>
              <div className="vaga-status">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={vaga.active}
                    onChange={() => toggleActive(vaga.id)}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span className={vaga.active ? "status-active" : "status-inactive"}>
                  {vaga.active ? "Ativa" : "Inativa"}
                </span>
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
              className="modal-vaga"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editingVaga ? "Editar Vaga" : "Nova Vaga"}</h2>
                <button onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-group">
                  <label>Título da Vaga *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Advogado Sénior"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descrição *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    placeholder="Descreva as responsabilidades e requisitos da vaga..."
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Localização</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Luanda, Angola"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipo</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Tempo Integral">Tempo Integral</option>
                      <option value="Tempo Parcial">Tempo Parcial</option>
                      <option value="Estágio">Estágio</option>
                      <option value="Remoto">Remoto</option>
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="submit-btn" disabled={saving}>
                    {saving ? <Loader2 size={16} className="spin" /> : <CheckCircle size={16} />}
                    {saving ? "A guardar..." : editingVaga ? "Guardar Alterações" : "Criar Vaga"}
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