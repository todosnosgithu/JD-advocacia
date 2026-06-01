import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import "./Hero.css";

export default function CTASection() {
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
              <p>fulanoadvocacia@gmail.com</p>
            </div>

            <span className="cta-label">
              Contacto: 9XX XXX XXX
            </span>
          </motion.div>

          <motion.div
            className="cta-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h2 className="cta-title">
              Precisa de ajuda
              <br />
              <span className="cta-highlight">jurídica?</span>
            </h2>

            <p className="cta-text">
              Fale connosco agora mesmo. A nossa equipa está preparada para
              analisar o seu caso com a discrição e a competência que merece.
            </p>

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