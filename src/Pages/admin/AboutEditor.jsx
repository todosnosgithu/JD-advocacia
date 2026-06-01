// AboutEditor.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Edit2, Check, X, RefreshCw } from "lucide-react";
import "./AboutEditor.css";

export default function AboutEditor() {
  const [aboutContent, setAboutContent] = useState({
    hero: {
      title: "O MOTOR",
      highlight: "INTELECTUAL",
      description: "Fundada em 2005, a Fulano Advocacia construiu a sua reputação através de um compromisso inabalável com a excelência e a inovação no exercício da advocacia."
    },
    filosofia: {
      missao: {
        title: "A Nossa Missão",
        text: "Oferecer aconselhamento jurídico de excelência, fundamentado em rigor intelectual e numa compreensão profunda das necessidades de cada cliente. Acreditamos que o direito é um instrumento de justiça e progresso — e tratamos cada caso com a dedicação que essa responsabilidade exige."
      },
      impacto: {
        title: "O Nosso Impacto",
        text: "Mais de 100 casos resolvidos com sucesso, incluindo litígios de referência que moldaram a jurisprudência portuguesa. Os nossos clientes recuperaram mais de 2 mil milhões em indemnizações e evitaram riscos regulatórios significativos nas suas operações internacionais."
      }
    },
    timeline: [
      { year: "2005", title: "Fundação", desc: "Constituição da sociedade por António Fulano e Mariana Advocacia em Luanda." },
      { year: "2010", title: "Expansão Internacional", desc: "Abertura do primeiro escritório internacional em Luanda, Angola." },
      { year: "2018", title: "Inovação Digital", desc: "Pioneiros na implementação de JD Tecnologia em Luanda." },
      { year: "2020", title: "Prémio de Excelência", desc: "Reconhecidos como Firma do Ano pela Chambers Europe." },
      { year: "2024", title: "Nova Geração", desc: "Integração de 15 novos associados e expansão para direito tecnológico." }
    ],
    valores: [
      { title: "Rigor", desc: "Cada argumento é construído com precisão cirúrgica." },
      { title: "Integridade", desc: "Transparência absoluta e ética profissional." },
      { title: "Inovação", desc: "Tecnologia para uma advocacia moderna." }
    ]
  });

  const [editingTimelineIndex, setEditingTimelineIndex] = useState(null);
  const [editingValorIndex, setEditingValorIndex] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("about_content");
    if (saved) {
      setAboutContent(JSON.parse(saved));
    }
  }, []);

  const saveContent = () => {
    localStorage.setItem("about_content", JSON.stringify(aboutContent));
    setSaveStatus("Alterações guardadas com sucesso!");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const updateHero = (field, value) => {
    setAboutContent({
      ...aboutContent,
      hero: { ...aboutContent.hero, [field]: value }
    });
  };

  const updateFilosofia = (type, field, value) => {
    setAboutContent({
      ...aboutContent,
      filosofia: {
        ...aboutContent.filosofia,
        [type]: { ...aboutContent.filosofia[type], [field]: value }
      }
    });
  };

  const updateTimeline = (index, field, value) => {
    const newTimeline = [...aboutContent.timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    setAboutContent({ ...aboutContent, timeline: newTimeline });
  };

  const addTimelineItem = () => {
    setAboutContent({
      ...aboutContent,
      timeline: [...aboutContent.timeline, { year: "", title: "", desc: "" }]
    });
    setEditingTimelineIndex(aboutContent.timeline.length);
  };

  const removeTimelineItem = (index) => {
    const newTimeline = aboutContent.timeline.filter((_, i) => i !== index);
    setAboutContent({ ...aboutContent, timeline: newTimeline });
  };

  const updateValor = (index, field, value) => {
    const newValores = [...aboutContent.valores];
    newValores[index] = { ...newValores[index], [field]: value };
    setAboutContent({ ...aboutContent, valores: newValores });
  };

  const addValor = () => {
    setAboutContent({
      ...aboutContent,
      valores: [...aboutContent.valores, { title: "", desc: "" }]
    });
    setEditingValorIndex(aboutContent.valores.length);
  };

  const removeValor = (index) => {
    const newValores = aboutContent.valores.filter((_, i) => i !== index);
    setAboutContent({ ...aboutContent, valores: newValores });
  };

  return (
    <div className="about-editor">
      <div className="editor-header">
        <h1>Sobre Nós</h1>
        <p>Edite o conteúdo da página Sobre</p>
      </div>

      {saveStatus && <div className="save-notification">{saveStatus}</div>}

      {/* Hero Section */}
      <section className="editor-section">
        <div className="section-header">
          <h2>Secção Hero</h2>
          <button className="save-btn" onClick={saveContent}>
            <Save size={16} />
            Guardar
          </button>
        </div>

        <div className="editor-form">
          <div className="form-row">
            <div className="form-group">
              <label>Título Principal</label>
              <input
                type="text"
                value={aboutContent.hero.title}
                onChange={(e) => updateHero("title", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Palavra Destacada</label>
              <input
                type="text"
                value={aboutContent.hero.highlight}
                onChange={(e) => updateHero("highlight", e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={aboutContent.hero.description}
              onChange={(e) => updateHero("description", e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* Filosofia Section */}
      <section className="editor-section">
        <div className="section-header">
          <h2>Filosofia (Missão & Impacto)</h2>
        </div>

        <div className="filosofia-editor">
          <div className="filosofia-card">
            <h3>Missão</h3>
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                value={aboutContent.filosofia.missao.title}
                onChange={(e) => updateFilosofia("missao", "title", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Texto</label>
              <textarea
                value={aboutContent.filosofia.missao.text}
                onChange={(e) => updateFilosofia("missao", "text", e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="filosofia-card">
            <h3>Impacto</h3>
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                value={aboutContent.filosofia.impacto.title}
                onChange={(e) => updateFilosofia("impacto", "title", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Texto</label>
              <textarea
                value={aboutContent.filosofia.impacto.text}
                onChange={(e) => updateFilosofia("impacto", "text", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="editor-section">
        <div className="section-header">
          <h2>Linha do Tempo</h2>
          <button className="add-btn" onClick={addTimelineItem}>
            <RefreshCw size={16} />
            Adicionar Marco
          </button>
        </div>

        <div className="timeline-editor">
          {aboutContent.timeline.map((item, index) => (
            <motion.div
              key={index}
              className="timeline-editor-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {editingTimelineIndex === index ? (
                <div className="timeline-edit-form">
                  <input
                    type="text"
                    value={item.year}
                    onChange={(e) => updateTimeline(index, "year", e.target.value)}
                    placeholder="Ano"
                  />
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateTimeline(index, "title", e.target.value)}
                    placeholder="Título"
                  />
                  <textarea
                    value={item.desc}
                    onChange={(e) => updateTimeline(index, "desc", e.target.value)}
                    placeholder="Descrição"
                    rows={2}
                  />
                  <div className="edit-actions">
                    <button onClick={() => setEditingTimelineIndex(null)}>
                      <Check size={16} />
                    </button>
                    <button onClick={() => removeTimelineItem(index)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="timeline-display">
                  <div className="timeline-year">{item.year}</div>
                  <div className="timeline-info">
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                  <button className="edit-timeline" onClick={() => setEditingTimelineIndex(index)}>
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Valores Section */}
      <section className="editor-section">
        <div className="section-header">
          <h2>Valores</h2>
          <button className="add-btn" onClick={addValor}>
            <RefreshCw size={16} />
            Adicionar Valor
          </button>
        </div>

        <div className="valores-editor">
          {aboutContent.valores.map((valor, index) => (
            <motion.div
              key={index}
              className="valor-editor-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {editingValorIndex === index ? (
                <div className="valor-edit-form">
                  <input
                    type="text"
                    value={valor.title}
                    onChange={(e) => updateValor(index, "title", e.target.value)}
                    placeholder="Título"
                  />
                  <textarea
                    value={valor.desc}
                    onChange={(e) => updateValor(index, "desc", e.target.value)}
                    placeholder="Descrição"
                    rows={2}
                  />
                  <div className="edit-actions">
                    <button onClick={() => setEditingValorIndex(null)}>
                      <Check size={16} />
                    </button>
                    <button onClick={() => removeValor(index)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="valor-display">
                  <div className="valor-number">0{index + 1}</div>
                  <div className="valor-info">
                    <h4>{valor.title}</h4>
                    <p>{valor.desc}</p>
                  </div>
                  <button className="edit-valor" onClick={() => setEditingValorIndex(index)}>
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <div className="section-actions">
        <button className="save-all-btn" onClick={saveContent}>
          <Save size={16} />
          Guardar Todas as Alterações
        </button>
      </div>
    </div>
  );
}