// src/Admin/ServicesEditor.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Plus, Trash2, Edit2, X, Eye, Check, Loader2, RefreshCw } from "lucide-react";
import { servicosAPI } from "../services/servicosAPI";
import "./ServicesEditor.css";

export default function ServicesEditor() {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    content: "",
    subtitles: "",
    subtitle: "",
    pontos: [],
    ponto: []
  });
  const [newPonto, setNewPonto] = useState("");
  const [newPonto2, setNewPonto2] = useState("");

  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      console.log("Carregando serviços da API...");
      const data = await servicosAPI.getAllServicos(token);
      console.log("Dados recebidos da API:", data);
      
      if (data && data.length > 0) {
        // Converter dados da API para o formato esperado
        const formattedServices = data.map(service => ({
          id: service.id,
          title: service.titulo || service.title,
          content: service.descricao || service.content,
          subtitles: service.subtitles || "",
          subtitle: service.subtitle || "",
          pontos: service.pontos || [],
          ponto: service.ponto || []
        }));
        setServices(formattedServices);
        localStorage.setItem("servicos_content", JSON.stringify(formattedServices));
      } else {
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("Erro ao carregar serviços da API:", error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem("servicos_content");
    if (saved) {
      setServices(JSON.parse(saved));
    } else {
      // Dados padrão
      const defaultServices = [
        {
          id: "trabalho",
          title: "Direito do Trabalho",
          content: "Atuamos na defesa de trabalhadores e empresas em questões trabalhistas, assegurando direitos e promovendo soluções justas e equilibradas.",
          subtitles: "Defesa dos Trabalhadores",
          pontos: [
            "Garantia de direitos básicos: salários, férias, 13º, horas extras",
            "Proteção contra abusos: casos de assédio moral ou sexual",
            "Segurança no ambiente laboral: acidentes de trabalho",
            "Negociação coletiva: apoio em acordos sindicais"
          ],
          subtitle: "Defesa de Empresas",
          ponto: [
            "Consultoria preventiva: elaboração de contratos",
            "Gestão de riscos: orientação para evitar passivos",
            "Treinamento interno: implementação de políticas de compliance",
            "Assessoria em contratos de trabalho"
          ]
        },
        {
          id: "civil",
          title: "Direito Civil",
          content: "Resolução de conflitos e contratos, assegurando justiça e equilíbrio nas relações entre pessoas e instituições.",
          subtitles: "Áreas de Atuação",
          pontos: [
            "Elaboração e revisão de contratos",
            "Ações de responsabilidade civil",
            "Indenizações por danos materiais e morais",
            "Assessoria em questões patrimoniais"
          ],
          subtitle: "Benefícios",
          ponto: [
            "Segurança jurídica nas relações contratuais",
            "Proteção dos direitos do cidadão",
            "Resolução eficiente de conflitos"
          ]
        }
      ];
      setServices(defaultServices);
      localStorage.setItem("servicos_content", JSON.stringify(defaultServices));
    }
  };

  const saveServices = async () => {
    setSaving(true);
    try {
      for (const service of services) {
        const apiData = {
          titulo: service.title,
          descricao: service.content,
          subtitles: service.subtitles || "",
          subtitle: service.subtitle || "",
          pontos: service.pontos || [],
          ponto: service.ponto || []
        };
        
        try {
          await servicosAPI.updateServico(service.id, apiData, token);
        } catch (updateError) {
          await servicosAPI.createServico(apiData, token);
        }
      }
      
      localStorage.setItem("servicos_content", JSON.stringify(services));
      setSaveStatus("✅ Serviços guardados com sucesso!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Erro ao salvar serviços:", error);
      localStorage.setItem("servicos_content", JSON.stringify(services));
      setSaveStatus("⚠️ Erro na API, mas dados salvos localmente!");
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const addPonto = () => {
    if (newPonto.trim()) {
      setFormData({
        ...formData,
        pontos: [...formData.pontos, newPonto.trim()]
      });
      setNewPonto("");
    }
  };

  const removePonto = (index) => {
    setFormData({
      ...formData,
      pontos: formData.pontos.filter((_, i) => i !== index)
    });
  };

  const addPonto2 = () => {
    if (newPonto2.trim()) {
      setFormData({
        ...formData,
        ponto: [...formData.ponto, newPonto2.trim()]
      });
      setNewPonto2("");
    }
  };

  const removePonto2 = (index) => {
    setFormData({
      ...formData,
      ponto: formData.ponto.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let updatedServices;
      if (editingService) {
        updatedServices = services.map(s => 
          s.id === editingService.id ? { ...formData, id: s.id } : s
        );
        setServices(updatedServices);
        
        const apiData = {
          titulo: formData.title,
          descricao: formData.content,
          subtitles: formData.subtitles || "",
          subtitle: formData.subtitle || "",
          pontos: formData.pontos || [],
          ponto: formData.ponto || []
        };
        await servicosAPI.updateServico(editingService.id, apiData, token);
        setSaveStatus("✅ Serviço atualizado com sucesso!");
      } else {
        const newId = formData.title.toLowerCase().replace(/\s+/g, '');
        const newService = { ...formData, id: newId };
        updatedServices = [...services, newService];
        setServices(updatedServices);
        
        const apiData = {
          titulo: formData.title,
          descricao: formData.content,
          subtitles: formData.subtitles || "",
          subtitle: formData.subtitle || "",
          pontos: formData.pontos || [],
          ponto: formData.ponto || []
        };
        await servicosAPI.createServico(apiData, token);
        setSaveStatus("✅ Serviço criado com sucesso!");
      }
      
      localStorage.setItem("servicos_content", JSON.stringify(updatedServices));
      setTimeout(() => setSaveStatus(""), 3000);
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      setSaveStatus("❌ Erro ao salvar serviço");
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      content: "",
      subtitles: "",
      subtitle: "",
      pontos: [],
      ponto: []
    });
    setEditingService(null);
    setShowForm(false);
    setNewPonto("");
    setNewPonto2("");
  };

  const editService = (service) => {
    setEditingService(service);
    setFormData({
      id: service.id,
      title: service.title,
      content: service.content,
      subtitles: service.subtitles || "",
      subtitle: service.subtitle || "",
      pontos: service.pontos || [],
      ponto: service.ponto || []
    });
    setShowForm(true);
  };

  const deleteService = async (id) => {
    if (window.confirm("Tem certeza que deseja eliminar este serviço?")) {
      setSaving(true);
      try {
        await servicosAPI.deleteServico(id, token);
        const filtered = services.filter(s => s.id !== id);
        setServices(filtered);
        localStorage.setItem("servicos_content", JSON.stringify(filtered));
        setSaveStatus("✅ Serviço eliminado com sucesso!");
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (error) {
        console.error("Erro ao deletar serviço:", error);
        setSaveStatus("❌ Erro ao deletar serviço");
        setTimeout(() => setSaveStatus(""), 3000);
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="services-editor-loading">
        <Loader2 size={40} className="spin" />
        <p>Carregando serviços...</p>
      </div>
    );
  }

  return (
    <div className="services-editor">
      <div className="editor-header">
        <div>
          <h1>Serviços</h1>
          <p>Gerencie as páginas de serviços e áreas de atuação</p>
        </div>
        <button className="refresh-btn" onClick={loadServices}>
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {saveStatus && (
        <div className={`save-notification ${saveStatus.includes("❌") ? "error" : "success"}`}>
          {saveStatus}
        </div>
      )}

      <div className="services-actions">
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <Plus size={18} />
          Novo Serviço
        </button>
        <button className="save-all-btn" onClick={saveServices} disabled={saving}>
          {saving ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
          {saving ? "A guardar..." : "Guardar Todos"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            className="service-form-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="modal-overlay" onClick={resetForm} />
            <motion.div 
              className="service-form"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="form-header">
                <h3>{editingService ? "Editar Serviço" : "Novo Serviço"}</h3>
                <button onClick={resetForm} className="close-btn">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Título do Serviço *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Ex: Direito do Trabalho"
                  />
                </div>

                <div className="form-group">
                  <label>Descrição Principal *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    required
                    placeholder="Descreva o serviço principal..."
                  />
                </div>

                <div className="form-group">
                  <label>Subtítulo (Primeira Secção)</label>
                  <input
                    type="text"
                    value={formData.subtitles}
                    onChange={(e) => setFormData({ ...formData, subtitles: e.target.value })}
                    placeholder="Ex: Áreas de Atuação"
                  />
                </div>

                <div className="form-group">
                  <label>Lista de Pontos (Secção 1)</label>
                  <div className="pontos-input">
                    <input
                      type="text"
                      value={newPonto}
                      onChange={(e) => setNewPonto(e.target.value)}
                      placeholder="Adicionar ponto..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPonto())}
                    />
                    <button type="button" onClick={addPonto}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="pontos-list">
                    {formData.pontos.map((p, i) => (
                      <span key={i} className="ponto-tag">
                        {p}
                        <button type="button" onClick={() => removePonto(i)}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Subtítulo (Segunda Secção)</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Ex: Benefícios"
                  />
                </div>

                <div className="form-group">
                  <label>Lista de Pontos (Secção 2)</label>
                  <div className="pontos-input">
                    <input
                      type="text"
                      value={newPonto2}
                      onChange={(e) => setNewPonto2(e.target.value)}
                      placeholder="Adicionar ponto..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPonto2())}
                    />
                    <button type="button" onClick={addPonto2}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="pontos-list">
                    {formData.ponto.map((p, i) => (
                      <span key={i} className="ponto-tag">
                        {p}
                        <button type="button" onClick={() => removePonto2(i)}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={resetForm}>
                    Cancelar
                  </button>
                  <button type="submit" className="submit-btn" disabled={saving}>
                    {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                    {editingService ? "Guardar Alterações" : "Criar Serviço"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="services-list">
        <div className="services-grid">
          {services.length === 0 ? (
            <div className="empty-services">
              <p>Nenhum serviço encontrado.</p>
              <button onClick={() => setShowForm(true)}>Criar primeiro serviço</button>
            </div>
          ) : (
            services.map((service) => (
              <motion.div
                key={service.id}
                className="service-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                <div className="service-card-header">
                  <h3>{service.title}</h3>
                  <div className="service-card-actions">
                    <button onClick={() => editService(service)} title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteService(service.id)} title="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="service-preview">{service.content?.substring(0, 100)}...</p>
                <div className="service-stats">
                  <span>📋 {service.pontos?.length || 0} pontos (secção 1)</span>
                  <span>📌 {service.ponto?.length || 0} pontos (secção 2)</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}