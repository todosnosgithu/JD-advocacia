// src/Home.jsx - Adicionar verificação de loading
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { useSiteData } from "./context/SiteDataContext";
import "./Home.css";
import { useImagens } from "../context/ImagensContext";

// Componentes
import StatsSection from "./Componentes/Stats";
import Area from "./Componentes/Area";
import TestimonialSection from "./Componentes/Testemunho";

function useAnimarAoScroll(seletor = ".animar") {
  useEffect(() => {
    const elementos = document.querySelectorAll(seletor);
    if (elementos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ativo");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      },
    );
    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [seletor]);
}

function HeroSection() {
  const { siteData } = useSiteData();
  const { getImagemUrl, loading: imagensLoading } = useImagens();
  const heroImage = getImagemUrl("home_hero");

  const heroData = siteData.home?.hero || {
    label: "Advocacia de Excelência",
    title: "PRECISÃO",
    subtitle: "NA PRÁTICA",
    description: "+15 de anos de excelência jurídica. Defendemos os seus interesses com rigor intelectual e estratégia de precisão."
  };

  if (imagensLoading) {
    return <div className="hero-loading"><div className="loading-spinner"></div></div>;
  }

  return (
    <section className="hero">
      <div className="hero-bg">
        <img src={heroImage} alt="home Banner" />
        <div className="hero-overlay" />
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <motion.span
            className="hero-label"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {heroData.label}
          </motion.span>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            {heroData.title} <br />
            <span>{heroData.subtitle}</span>
          </motion.h1>

          <motion.div
            className="hero-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />

          <motion.p
            className="hero-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {heroData.description}
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link to="/contacto" className="btn-primary">
              Consulta Inicial
              <ArrowRight size={16} />
            </Link>
            <Link to="/sobre" className="btn-secondary">
              Conheça-nos
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { siteData } = useSiteData();
  const ctaData = siteData.home?.cta || {
    title: "Precisa de ajuda",
    highlight: "jurídica?",
    text: "Fale connosco agora mesmo. A nossa equipa está preparada para analisar o seu caso com a discrição e a competência que merece.",
    email: "fulanoadvocacia@gmail.com",
    phone: "9XX XXX XXX"
  };

  return (
    <section className="cta-section">
      <div className="cta-divider" />
      <div className="cta-container">
        <div className="cta-grid">
          <motion.div
            className="cta-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="cta-icon-box">
              <Mail className="cta-icon" />
              <p>{ctaData.email}</p>
            </div>
            <span className="cta-label">Contacto: {ctaData.phone}</span>
          </motion.div>

          <motion.div
            className="cta-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h2 className="cta-title">
              {ctaData.title}
              <br />
              <span className="cta-highlight">{ctaData.highlight}</span>
            </h2>
            <p className="cta-text">{ctaData.text}</p>
            <Link to="/contacto" className="cta-button">
              Solicitar Consulta
              <ArrowRight className="cta-arrow" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Home() {
  useAnimarAoScroll();
  
  return (
    <div className="conta">
      <HeroSection />
      <StatsSection />
      <Area />
      <TestimonialSection />
      <CTASection />
    </div>
  );
}

export default Home;