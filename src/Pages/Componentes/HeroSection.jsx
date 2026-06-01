// src/Componentes/HeroSection.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useImagens } from "../../context/ImagensContext";
import "./HeroSection.css";

export default function HeroSection() {
  const { getImagemUrl, loading: imagensLoading } = useImagens();
  const heroImage = getImagemUrl("home_hero");

  if (imagensLoading) {
    return <div className="hero-loading"><div className="loading-spinner"></div></div>;
  }

  return (
    <section className="hero">
      <div className="hero-bg">
        <img src={heroImage} alt="Hero" />
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
            Advocacia de Excelência
          </motion.span>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            PRECISÃO <br />
            <span>NA PRÁTICA</span>
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
            +15 de anos de excelência jurídica. Defendemos os seus
            interesses com rigor intelectual e estratégia de precisão.
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