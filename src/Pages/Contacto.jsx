// src/Contacto.jsx
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import ContactForm from "./Componentes/ContactForm";
import "./Contacto.css";
import { useImagens } from "../context/ImagensContext";

const info = [
  { icon: MapPin, label: "Morada", value: "Av. Deolinda Rodrigues, Luanda, Angola" },
  { icon: Phone, label: "Telefone", value: "+244 900 000 000" },
  { icon: Mail, label: "Email", value: "fulanoadvocacia@gmail.com" },
  { icon: Clock, label: "Horário", value: "Segunda a Sexta\n09:00 — 18:00" },
];

export default function Contacto() {
  const { getImagemUrl, loading: imagensLoading } = useImagens();
  const contactImage = getImagemUrl("contact");

  if (imagensLoading) {
    return (
      <div className="contacto-loading">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="contacto">
      <section className="contact-hero">
        <motion.div
          className="contact-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="detalhes">Contacto</p>
          <h1 className="contact-title">O PORTAL <br /><span>SEGURO</span></h1>
          <p className="contact-desc">Todas as comunicações são estritamente confidenciais. Contacte-nos para agendar uma consulta inicial sem compromisso.</p>
        </motion.div>
      </section>

      <section className="contact-image-section">
        <motion.div
          className="contact-image-wrapper"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img src={contactImage} alt="Contacto Banner" />
        </motion.div>
      </section>

      <section className="contact-main">
        <div className="contact-grid">
          <div className="contact-form">
            <h2>Envie-nos <span>uma mensagem</span></h2>
            <ContactForm />
          </div>

          <div className="contact-info">
            <h2>Informações</h2>
            <div className="info-list">
              {info.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="info-item"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <item.icon className="info-icon" />
                  <div>
                    <span className="info-label">{item.label}</span>
                    <span className="info-value">{item.value}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="contact-box">
              <span className="box-title">Confidencialidade</span>
              <p>Todas as informações partilhadas connosco estão protegidas pelo sigilo profissional. A sua privacidade é a nossa prioridade.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}