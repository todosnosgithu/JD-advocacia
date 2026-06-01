// src/Componentes/Area.jsx - Versão atualizada
import { motion } from "framer-motion";
import { useSiteData } from "../context/SiteDataContext";
import {
  Scale,
  Building2,
  Globe,
  Shield,
  FileText,
  Users,
} from "lucide-react";
import "./Area.css";

const iconMap = {
  Scale: Scale,
  Building2: Building2,
  Globe: Globe,
  Shield: Shield,
  FileText: FileText,
  Users: Users,
};

export default function Area() {
  const { siteData } = useSiteData();
  
  const areas = siteData.home?.areas || [
    {
      icon: "Scale",
      title: "Contencioso Civil",
      desc: "Representação estratégica em litígios complexos de âmbito nacional e internacional.",
    },
    {
      icon: "Building2",
      title: "Direito Comercial",
      desc: "Assessoria integral a empresas, desde a constituição ao crescimento sustentável.",
    },
    {
      icon: "Globe",
      title: "Direito Internacional",
      desc: "Operações transfronteiriças, arbitragem e regulação do comércio global.",
    },
    {
      icon: "Shield",
      title: "Propriedade Intelectual",
      desc: "Proteção de marcas, patentes e direitos autorais em todas as jurisdições.",
    },
    {
      icon: "FileText",
      title: "Direito Fiscal",
      desc: "Planeamento fiscal e contencioso tributário com rigor técnico.",
    },
    {
      icon: "Users",
      title: "Direito Laboral",
      desc: "Relações de trabalho, reestruturações e negociação coletiva.",
    },
  ];

  return (
    <section className="practice">
      <p className="detalhes">Área de Prática</p>
      
      <div className="practice-grid">
        {areas.map((area, i) => {
          const IconComponent = iconMap[area.icon] || Scale;
          return (
            <motion.div
              key={area.title}
              className="practice-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <IconComponent className="practice-icon" size={30} strokeWidth={1.2} />
              <h3>{area.title}</h3>
              <p>{area.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}