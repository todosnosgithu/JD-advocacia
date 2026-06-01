// src/Componentes/Stats.jsx - Versão atualizada
import { motion } from "framer-motion";
import { useSiteData } from "../context/SiteDataContext";
import "./Stats.css";

export default function StatsSection() {
  const { siteData } = useSiteData();
  
  const stats = siteData.home?.stats || [
    { value: "+15", label: "Anos de Experiência" },
    { value: "+100", label: "Casos Resolvidos" },
    { value: "90%", label: "Taxa de Sucesso" },
    { value: "+10", label: "Advogados Especializados" },
  ];

  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}