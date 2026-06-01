// src/Sobre.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSiteData } from "./context/SiteDataContext";
import Timeline from "./Componentes/Timeline";
import Toggles from "./Componentes/Toggles";
import { equipaAPI } from "./services/equipaAPI";
import "./Sobre.css";
import { useImagens } from "../context/ImagensContext";

export default function Sobre() {
  const { getImagemUrl, loading: imagensLoading } = useImagens();
  const aboutImage = getImagemUrl("about");

  const { siteData } = useSiteData();
  const [equipa, setEquipa] = useState([]);
  const [loadingEquipa, setLoadingEquipa] = useState(true);

  const aboutContent = siteData.about;

  const heroData = aboutContent?.hero || {
    title: "O MOTOR",
    highlight: "INTELECTUAL",
    description: "Fundada em 2005, a Fulano Advocacia construiu a sua reputação através de um compromisso inabalável com a excelência e a inovação no exercício da advocacia."
  };

  const valores = aboutContent?.valores || [
    { title: "Rigor", desc: "Cada argumento é construído com precisão cirúrgica." },
    { title: "Integridade", desc: "Transparência absoluta e ética profissional." },
    { title: "Inovação", desc: "Tecnologia para uma advocacia moderna." }
  ];

  useEffect(() => {
    loadEquipa();
  }, []);

  const loadEquipa = async () => {
    try {
      const data = await equipaAPI.getAllMembros();
      setEquipa(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar equipa:", error);
      const stored = JSON.parse(localStorage.getItem("equipa_membros") || "[]");
      setEquipa(stored);
    } finally {
      setLoadingEquipa(false);
    }
  };

  if (imagensLoading) {
    return (
      <div className="sobre-loading">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="sobre">
      <section className="sobre-hero">
        <motion.div
          className="sobre-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="detalhes">Sobre Nós</p>
          <h1 className="sobre-title">
            {heroData.title} <br />
            <span>{heroData.highlight}</span>
          </h1>
          <p className="sobre-desc">{heroData.description}</p>
        </motion.div>
      </section>

      <section className="sobre-image-section">
        <motion.div
          className="sobre-image-wrapper"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img src={aboutImage} alt="Sobre Banner" />
        </motion.div>
      </section>

      <section className="sobre-filosofia">
        <p className="detalhes">Filosofia</p>
        <Toggles />
      </section>

      <section className="sobre-timeline">
        <p className="detalhes">A Nossa Historia</p>
        <h2 className="timeline-title">Marcos <span>que definem</span></h2>
        <Timeline />
      </section>

      <section className="sobre-equipa">
        <div className="equipa-header">
          <p className="detalhes">A Nossa Equipa</p>
          <h2 className="equipa-title">Profissionais <span>Dedicados</span></h2>
          <p className="equipa-subtitle">Conheça os advogados e especialistas que fazem a diferença</p>
        </div>

        {loadingEquipa ? (
          <div className="equipa-loading-spinner">
            <div className="spinner"></div>
            <p>Carregando equipa...</p>
          </div>
        ) : equipa.length === 0 ? (
          <div className="equipa-empty">
            <p>Em breve, conheça a nossa equipa.</p>
          </div>
        ) : (
          <div className="equipa-grid">
            {equipa.map((membro, index) => (
              <motion.div
                key={membro.id}
                className="equipa-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="equipa-card-image">
                  {membro.foto ? (
                    <img src={membro.foto} alt={membro.nome} />
                  ) : (
                    <div className="equipa-placeholder">
                      <span>⚖️</span>
                    </div>
                  )}
                </div>
                <div className="equipa-card-content">
                  <h3>{membro.nome}</h3>
                  <p className="especialidade">{membro.especialidade}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="sobre-valores">
        <div className="valores-grid">
          {valores.map((v, i) => (
            <motion.div
              key={v.title}
              className="valor-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <span className="valor-num">{`0${i + 1}`}</span>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}