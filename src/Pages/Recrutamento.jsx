// src/Recrutamento.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Bell, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useSiteData } from "./context/SiteDataContext";
import JourneyMap from "./Componentes/JourneyMap";
import "./Recrutamento.css";
import { useImagens } from "../context/ImagensContext";

const defaultBenefits = [
  "Mentoria personalizada por sócios seniores",
  "Programa de formação contínua certificado",
  "Projetos internacionais desde o primeiro ano",
  "Plano de carreira transparente e meritocrático",
  "Acesso a tecnologia jurídica de ponta",
  "Equilíbrio entre vida pessoal e profissional",
];

export default function Recrutamento() {
  const { getImagemUrl, loading: imagensLoading } = useImagens();
  const navigate = useNavigate();
  const { siteData, loading, refreshData } = useSiteData();
  const [showNotification, setShowNotification] = useState(false);
  const [showVagasContent, setShowVagasContent] = useState(false);

  // Usar o alias "recruit" que mapeia para "recrutamento_hero"
  const recruitImage = getImagemUrl("recruit");

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshData();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refreshData]);

  const activePositions = siteData?.recrutamento?.filter(p => p.active !== false) || [];
  const hasVagas = activePositions.length > 0;

  useEffect(() => {
    if (!hasVagas) return;
    const lastVisit = localStorage.getItem("last_recrutamento_visit");
    const currentHash = JSON.stringify(activePositions.map(p => ({ id: p.id, active: p.active })));
    if (lastVisit !== currentHash) {
      const dismissed = JSON.parse(localStorage.getItem("dismissed_vagas") || "[]");
      if (!dismissed.includes(currentHash)) {
        setShowNotification(true);
      }
    }
  }, [activePositions, hasVagas]);

  const dismissNotification = () => {
    const currentHash = JSON.stringify(activePositions.map(p => ({ id: p.id, active: p.active })));
    const dismissed = JSON.parse(localStorage.getItem("dismissed_vagas") || "[]");
    localStorage.setItem("dismissed_vagas", JSON.stringify([...dismissed, currentHash]));
    localStorage.setItem("last_recrutamento_visit", currentHash);
    setShowNotification(false);
  };

  const scrollToVagas = () => {
    dismissNotification();
    setShowVagasContent(true);
    setTimeout(() => {
      const element = document.getElementById("vagas");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const navigateToCandidatar = (e) => {
    if (e) e.preventDefault();
    navigate("/candidatar");
    window.scrollTo(0, 0);
  };

  const benefits = siteData?.recrutamentoBenefits || defaultBenefits;

  // Mostrar loading enquanto carrega
  if (loading || imagensLoading) {
    return (
      <div className="recrutamento-loading">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="recrutamento">
      {showNotification && hasVagas && (
        <motion.div
          className="vagas-notification"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <div className="notification-content">
            <Bell size={20} />
            <div className="notification-text">
              <strong>{activePositions.length} vaga(s) disponível(eis)!</strong>
            </div>
            <button className="notification-btn" onClick={scrollToVagas}>
              Ver Vagas
            </button>
            <button className="notification-close" onClick={dismissNotification}>
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}

      <section className="recruit-section">
        <div className="recruit-left">
          <motion.div
            className="recruit-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="detalhes">Recrutamento</p>
            <h1 className="recruit-title">
              O FUTURO <br />
              <span>DA ADVOCACIA</span>
            </h1>
            <p className="recruit-text">
              Procuramos mentes brilhantes que partilhem a nossa paixão pelo
              rigor jurídico e pela inovação.
            </p>
            <button onClick={navigateToCandidatar} className="recruit-btn">
              Candidatar-se
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>

        <div className="recruit-right">
          <div className="recruit-image">
            <img src={recruitImage || imagensPadrao.recrutamento.hero} alt="Recrutamento" />
          </div>

          {hasVagas && showVagasContent && (
            <motion.div className="recruit-vagas" id="vagas" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h2>Vagas <span>Disponíveis</span></h2>
              <div className="vagas-list">
                {activePositions.map((pos, i) => (
                  <motion.div key={pos.id} className="vaga-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                    <h3>{pos.title}</h3>
                    <p>{pos.description?.substring(0, 120)}...</p>
                    <div className="vaga-meta">
                      <span>📍 {pos.location || "Luanda, Angola"}</span>
                      <span>{pos.type || "Tempo Integral"}</span>
                    </div>
                    <button onClick={navigateToCandidatar} className="vaga-link">Candidatar-se →</button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {hasVagas && !showVagasContent && (
            <motion.div className="vagas-indicator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <div className="indicator-content">
                <Bell size={16} />
                <span>{activePositions.length} vaga(s) disponível(eis)</span>
                <button onClick={scrollToVagas} className="indicator-btn">Ver Agora</button>
              </div>
            </motion.div>
          )}

          <div className="recruit-benefits">
            <h2>Porquê <span>juntar-se a nós</span></h2>
            <div className="benefits-list">
              {benefits.map((b, i) => (
                <motion.div key={i} className="benefit-item" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}>
                  <span className="benefit-number">{`0${i + 1}`}</span>
                  <span className="benefit-text">{b}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="recruit-journey">
            <h2>Percurso <span>do Candidato</span></h2>
            <JourneyMap />
          </div>
        </div>
      </section>
    </div>
  );
}