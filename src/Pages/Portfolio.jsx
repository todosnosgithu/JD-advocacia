// src/Portfolio.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useImagens } from "../context/ImagensContext";
import "./Portfolio.css";

function Portfolio() {
  const { getImagemUrl, loading: imagensLoading } = useImagens();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  
  const settings = JSON.parse(localStorage.getItem("admin_settings") || "{}");
  
  // Todas as imagens do portfolio gerenciadas pelo painel admin
  const capaImage = getImagemUrl("portfolio_capa");
  const heroImage = getImagemUrl("portfolio_hero");
  const sobreImage = getImagemUrl("portfolio_sobre");

  const services = [
    "Direito Imobiliário",
    "Direito Empresarial",
    "Direito Trabalhista",
    "Direito Criminal",
    "Direito Familiar",
    "Direito Previdenciário",
  ];

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = () => {
    try {
      setLoadingGallery(true);
      // Carregar fotos do localStorage (gerenciadas pelo GalleryManager)
      const storedPhotos = JSON.parse(localStorage.getItem("galeria_fotos") || "[]");
      console.log("Fotos carregadas no portfolio:", storedPhotos);
      setPhotos(storedPhotos);
    } catch (error) {
      console.error("Erro ao carregar fotos:", error);
      setPhotos([]);
    } finally {
      setLoadingGallery(false);
    }
  };

  const openPhoto = (photo, index) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedPhoto(photos[currentIndex + 1]);
    }
  };

  const prevPhoto = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedPhoto(photos[currentIndex - 1]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedPhoto) return;
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "Escape") closePhoto();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, currentIndex, photos]);

  if (imagensLoading || loadingGallery) {
    return (
      <div className="portfolio-loading">
        <Loader2 size={40} className="spin" />
        <p>Carregando galeria...</p>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      {/* HERO */}
      <section className="portfolio-hero-section">
        <div className="portfolio-hero-overlay"></div>
        <header className="portfolio-navbar">
          <div className="portfolio-logo">
            <h2>{settings?.siteInfo?.name || "JD Advocacia"}</h2>
          </div>
        </header>
        <div className="portfolio-hero-content">
          <div className="portfolio-hero-text">
            <span className="portfolio-hero-mini-title">ADVOGADOS DESDE 2020</span>
            <h1>Justiça, confiança e soluções jurídicas para você.</h1>
            <p>
              Atuamos com excelência em diversas áreas do direito,
              oferecendo suporte completo e atendimento humanizado.
            </p>
            <div className="portfolio-hero-buttons">
              <a href="/contacto" className="portfolio-gold-btn">Solicitar Consulta</a>
              <a href="/servicos" className="portfolio-dark-btn">Nossos Serviços</a>
            </div>
          </div>
          <div className="portfolio-hero-image">
            <img src={heroImage} alt="Hero do Portfólio" />
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="portfolio-cards-section">
        <div className="portfolio-info-card">
          <div className="portfolio-icon">⚖️</div>
          <h3>Serviços Profissionais</h3>
          <p>Atendimento especializado para empresas e pessoas físicas.</p>
        </div>
        <div className="portfolio-info-card">
          <div className="portfolio-icon">🏆</div>
          <h3>Especialistas Jurídicos</h3>
          <p>Equipe preparada para defender seus interesses com excelência.</p>
        </div>
        <div className="portfolio-info-card">
          <div className="portfolio-icon">💰</div>
          <h3>Preço Competitivo</h3>
          <p>Soluções jurídicas acessíveis e transparentes.</p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="portfolio-about-section">
        <div className="portfolio-about-text">
          <h2>Advogar é mais do que profissão,<span> é compromisso.</span></h2>
          <p>
            Trabalhamos para garantir segurança jurídica, confiança
            e tranquilidade aos nossos clientes em cada processo.
          </p>
          <a href="/sobre" className="portfolio-read-more">Ler mais</a>
        </div>
        <div className="portfolio-about-image">
          <img src={sobreImage} alt="Sobre o Portfólio" />
        </div>
        <div className="portfolio-about-text">
          <h2>Soluções jurídicas modernas para<span> resultados reais.</span></h2>
          <p>
            Nossa missão é oferecer um serviço eficiente,
            humano e focado em resultados positivos.
          </p>
          <a href="/sobre" className="portfolio-read-more">Ler mais</a>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="portfolio-services-section">
        <div className="portfolio-services-overlay"></div>
        <div className="portfolio-services-content">
          <h2>Serviços</h2>
          <div className="portfolio-services-grid">
            {services.map((service, index) => (
              <div key={index} className="portfolio-service-card">
                <div className="portfolio-service-icon">⚖️</div>
                <h3>{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA DE FOTOS */}
      {photos.length > 0 && (
        <section className="portfolio-gallery-section">
          <div className="portfolio-gallery-header">
            <h2>Galeria de <span>Fotos</span></h2>
            <p>Conheça o nosso escritório e equipa</p>
          </div>
          <div className="portfolio-gallery-grid">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="portfolio-gallery-item"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => openPhoto(photo, index)}
              >
                <img src={photo.url} alt={photo.name || `Foto ${index + 1}`} />
                <div className="portfolio-gallery-overlay">
                  <span>Ver foto</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* MODAL DE GALERIA */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="portfolio-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePhoto}
          >
            <motion.div
              className="portfolio-modal-content"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="portfolio-modal-close" onClick={closePhoto}>
                <X size={24} />
              </button>
              
              {photos.length > 1 && (
                <>
                  <button 
                    className="portfolio-modal-prev" 
                    onClick={prevPhoto}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button 
                    className="portfolio-modal-next" 
                    onClick={nextPhoto}
                    disabled={currentIndex === photos.length - 1}
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
              
              <img src={selectedPhoto.url} alt={selectedPhoto.name || "Imagem"} />
              
              <div className="portfolio-modal-info">
                <p>{selectedPhoto.name || "Imagem"}</p>
                <span>{currentIndex + 1} / {photos.length}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Portfolio;