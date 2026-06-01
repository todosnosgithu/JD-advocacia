// src/Componentes/Timeline.jsx - Versão atualizada
import { motion } from "framer-motion";
import { useSiteData } from "../context/SiteDataContext";
import "./Timeline.css";

export default function Timeline() {
  const { siteData } = useSiteData();
  
  const milestones = siteData.about?.timeline || [
    { year: "2005", title: "Fundação", desc: "Constituição da sociedade por António Fulano e Mariana Advocacia em Luanda." },
    { year: "2010", title: "Expansão Internacional", desc: "Abertura do primeiro escritório internacional em Luanda, Angola." },
    { year: "2018", title: "Inovação Digital", desc: "Pioneiros na implementação de JD Tecnologia em Luanda." },
    { year: "2020", title: "Prémio de Excelência", desc: "Reconhecidos como Firma do Ano pela Chambers Europe." },
    { year: "2024", title: "Nova Geração", desc: "Integração de 15 novos associados e expansão para direito tecnológico." },
  ];

  return (
    <div className="timeline">
      <div className="timeline-line" />
      <div className="timeline-list">
        {milestones.map((item, i) => (
          <motion.div
            key={item.year}
            className="timeline-item"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <div className="timeline-dot" />
            <span className="timeline-year">{item.year}</span>
            <h3 className="timeline-title">{item.title}</h3>
            <p className="timeline-desc">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}