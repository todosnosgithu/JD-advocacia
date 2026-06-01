// src/Admin/HomeEditor.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, RefreshCw, Eye, Plus, Trash2, Edit2, X, Check } from "lucide-react";
import "./HomeEditor.css";

export default function HomeEditor() {
  const [homeContent, setHomeContent] = useState({
    hero: {
      title: "PRECISÃO",
      subtitle: "NA PRÁTICA",
      description: "+15 de anos de excelência jurídica. Defendemos os seus interesses com rigor intelectual e estratégia de precisão.",
      label: "Advocacia de Excelência"
    },
    stats: [
      { value: "+15", label: "Anos de Experiência" },
      { value: "+100", label: "Casos Resolvidos" },
      { value: "90%", label: "Taxa de Sucesso" },
      { value: "+10", label: "Advogados Especializados" }
    ],
    areas: [
      { title: "Contencioso Civil", desc: "Representação estratégica em litígios complexos de âmbito nacional e internacional.", icon: "Scale" },
      { title: "Direito Comercial", desc: "Assessoria integral a empresas, desde a constituição ao crescimento sustentável.", icon: "Building2" },
      { title: "Direito Internacional", desc: "Operações transfronteiriças, arbitragem e regulação do comércio global.", icon: "Globe" },
      { title: "Propriedade Intelectual", desc: "Proteção de marcas, patentes e direitos autorais em todas as jurisdições.", icon: "Shield" },
      { title: "Direito Fiscal", desc: "Planeamento fiscal e contencioso tributário com rigor técnico.", icon: "FileText" },
      { title: "Direito Laboral", desc: "Relações de trabalho, reestruturações e negociação coletiva.", icon: "Users" }
    ],
    cta: {
      title: "Precisa de ajuda",
      highlight: "jurídica?",
      text: "Fale connosco agora mesmo. A nossa equipa está preparada para analisar o seu caso com a discrição e a competência que merece.",
      email: "fulanoadvocacia@gmail.com",
      phone: "9XX XXX XXX"
    }
  });

  const [editingStatIndex, setEditingStatIndex] = useState(null);
  const [editingAreaIndex, setEditingAreaIndex] = useState(null);
  const [showAddStat, setShowAddStat] = useState(false);
  const [showAddArea, setShowAddArea] = useState(false);
  const [newStat, setNewStat] = useState({ value: "", label: "" });
  const [newArea, setNewArea] = useState({ title: "", desc: "" });
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    try {
      const saved = localStorage.getItem("home_content");
      if (saved) {
        setHomeContent(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Erro ao carregar conteúdo:", error);
    }
  };

  const saveContent = () => {
    try {
      localStorage.setItem("home_content", JSON.stringify(homeContent));
      setSaveStatus("✅ Alterações guardadas com sucesso!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      setSaveStatus("❌ Erro ao guardar alterações");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const updateHero = (field, value) => {
    setHomeContent({
      ...homeContent,
      hero: { ...homeContent.hero, [field]: value }
    });
  };

  const updateCTA = (field, value) => {
    setHomeContent({
      ...homeContent,
      cta: { ...homeContent.cta, [field]: value }
    });
  };

  const updateStat = (index, field, value) => {
    const newStats = [...homeContent.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setHomeContent({ ...homeContent, stats: newStats });
  };

  const addStat = () => {
    if (newStat.value && newStat.label) {
      setHomeContent({
        ...homeContent,
        stats: [...homeContent.stats, { value: newStat.value, label: newStat.label }]
      });
      setNewStat({ value: "", label: "" });
      setShowAddStat(false);
    }
  };

  const removeStat = (index) => {
    const newStats = homeContent.stats.filter((_, i) => i !== index);
    setHomeContent({ ...homeContent, stats: newStats });
  };

  const updateArea = (index, field, value) => {
    const newAreas = [...homeContent.areas];
    newAreas[index] = { ...newAreas[index], [field]: value };
    setHomeContent({ ...homeContent, areas: newAreas });
  };

  const addArea = () => {
    if (newArea.title && newArea.desc) {
      setHomeContent({
        ...homeContent,
        areas: [...homeContent.areas, { title: newArea.title, desc: newArea.desc, icon: "Scale" }]
      });
      setNewArea({ title: "", desc: "" });
      setShowAddArea(false);
    }
  };

  const removeArea = (index) => {
    const newAreas = homeContent.areas.filter((_, i) => i !== index);
    setHomeContent({ ...homeContent, areas: newAreas });
  };

  return (
    <div className="home-editor">
      <div className="editor-header">
        <h1>Página Inicial</h1>
        <p>Edite os conteúdos da página principal do site</p>
      </div>

      <AnimatePresence>
        {saveStatus && (
          <motion.div
            className="save-notification"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {saveStatus}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="editor-section">
        <div className="section-header">
          <h2>🏠 Secção Hero</h2>
          <button className="save-btn" onClick={saveContent}>
            <Save size={16} />
            Guardar Alterações
          </button>
        </div>

        <div className="editor-form">
          <div className="form-group">
            <label>Label (tag superior)</label>
            <input
              type="text"
              value={homeContent.hero.label}
              onChange={(e) => updateHero("label", e.target.value)}
              placeholder="Ex: Advocacia de Excelência"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Título Principal</label>
              <input
                type="text"
                value={homeContent.hero.title}
                onChange={(e) => updateHero("title", e.target.value)}
                placeholder="Ex: PRECISÃO"
              />
            </div>
            <div className="form-group">
              <label>Subtítulo (destaque)</label>
              <input
                type="text"
                value={homeContent.hero.subtitle}
                onChange={(e) => updateHero("subtitle", e.target.value)}
                placeholder="Ex: NA PRÁTICA"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={homeContent.hero.description}
              onChange={(e) => updateHero("description", e.target.value)}
              rows={3}
              placeholder="Descrição principal da empresa..."
            />
          </div>
        </div>
      </section>

      {/* Stats Section - ESTILIZADA */}
      <section className="editor-section stats-section">
        <div className="section-header">
          <h2>📊 Estatísticas</h2>
          <button className="add-btn" onClick={() => setShowAddStat(true)}>
            <Plus size={16} />
            Adicionar Estatística
          </button>
        </div>

        <div className="stats-editor-grid">
          {homeContent.stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-editor-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -3 }}
            >
              {editingStatIndex === index ? (
                <div className="stat-edit-form">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(index, "value", e.target.value)}
                    placeholder="Valor (+15, 90%, etc)"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(index, "label", e.target.value)}
                    placeholder="Descrição"
                  />
                  <div className="edit-actions">
                    <button className="confirm-btn" onClick={() => setEditingStatIndex(null)}>
                      <Check size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="stat-preview">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                  <div className="stat-actions">
                    <button className="edit-btn" onClick={() => setEditingStatIndex(index)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="delete-btn" onClick={() => removeStat(index)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Modal Adicionar Estatística */}
        <AnimatePresence>
          {showAddStat && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddStat(false)}
            >
              <motion.div
                className="modal-content"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>➕ Adicionar Estatística</h3>
                  <button className="close-btn" onClick={() => setShowAddStat(false)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    placeholder="Valor (+15, 90%, etc)"
                    value={newStat.value}
                    onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Descrição"
                    value={newStat.label}
                    onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                  />
                </div>
                <div className="modal-footer">
                  <button className="cancel-btn" onClick={() => setShowAddStat(false)}>Cancelar</button>
                  <button className="confirm-btn" onClick={addStat}>Adicionar</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Areas Section - ESTILIZADA */}
      <section className="editor-section areas-section">
        <div className="section-header">
          <h2>📌 Áreas de Prática</h2>
          <button className="add-btn" onClick={() => setShowAddArea(true)}>
            <Plus size={16} />
            Adicionar Área
          </button>
        </div>

        <div className="areas-editor-grid">
          {homeContent.areas.map((area, index) => (
            <motion.div
              key={index}
              className="area-editor-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
            >
              {editingAreaIndex === index ? (
                <div className="area-edit-form">
                  <input
                    type="text"
                    value={area.title}
                    onChange={(e) => updateArea(index, "title", e.target.value)}
                    placeholder="Título"
                  />
                  <textarea
                    value={area.desc}
                    onChange={(e) => updateArea(index, "desc", e.target.value)}
                    placeholder="Descrição"
                    rows={3}
                  />
                  <div className="edit-actions">
                    <button className="confirm-btn" onClick={() => setEditingAreaIndex(null)}>
                      <Check size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="area-preview">
                    <div className="area-icon">⚖️</div>
                    <div className="area-info">
                      <h4>{area.title}</h4>
                      <p>{area.desc}</p>
                    </div>
                  </div>
                  <div className="area-actions">
                    <button className="edit-btn" onClick={() => setEditingAreaIndex(index)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="delete-btn" onClick={() => removeArea(index)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Modal Adicionar Área */}
        <AnimatePresence>
          {showAddArea && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddArea(false)}
            >
              <motion.div
                className="modal-content"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>📌 Adicionar Área de Prática</h3>
                  <button className="close-btn" onClick={() => setShowAddArea(false)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    placeholder="Título"
                    value={newArea.title}
                    onChange={(e) => setNewArea({ ...newArea, title: e.target.value })}
                  />
                  <textarea
                    placeholder="Descrição"
                    value={newArea.desc}
                    onChange={(e) => setNewArea({ ...newArea, desc: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="modal-footer">
                  <button className="cancel-btn" onClick={() => setShowAddArea(false)}>Cancelar</button>
                  <button className="confirm-btn" onClick={addArea}>Adicionar</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* CTA Section */}
      <section className="editor-section">
        <div className="section-header">
          <h2>📞 Secção CTA (Chamada para Ação)</h2>
        </div>

        <div className="editor-form">
          <div className="form-row">
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                value={homeContent.cta.title}
                onChange={(e) => updateCTA("title", e.target.value)}
                placeholder="Ex: Precisa de ajuda"
              />
            </div>
            <div className="form-group">
              <label>Palavra Destacada</label>
              <input
                type="text"
                value={homeContent.cta.highlight}
                onChange={(e) => updateCTA("highlight", e.target.value)}
                placeholder="Ex: jurídica?"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Texto</label>
            <textarea
              value={homeContent.cta.text}
              onChange={(e) => updateCTA("text", e.target.value)}
              rows={2}
              placeholder="Texto de chamada para ação..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={homeContent.cta.email}
                onChange={(e) => updateCTA("email", e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input
                type="text"
                value={homeContent.cta.phone}
                onChange={(e) => updateCTA("phone", e.target.value)}
                placeholder="+244 900 000 000"
              />
            </div>
          </div>
        </div>

        <div className="section-actions">
          <button className="save-all-btn" onClick={saveContent}>
            <Save size={16} />
            Guardar Todas as Alterações
          </button>
        </div>
      </section>
    </div>
  );
}