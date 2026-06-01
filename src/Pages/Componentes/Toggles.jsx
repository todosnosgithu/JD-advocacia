// src/Componentes/Toggles.jsx - Versão atualizada
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteData } from "../context/SiteDataContext";
import "./Toggles.css";

export default function Toggles() {
  const { siteData } = useSiteData();
  const [active, setActive] = useState("missao");

  const filosofia = siteData.about?.filosofia || {
    missao: {
      title: "A Nossa Missão",
      text: "Oferecer aconselhamento jurídico de excelência, fundamentado em rigor intelectual e numa compreensão profunda das necessidades de cada cliente. Acreditamos que o direito é um instrumento de justiça e progresso — e tratamos cada caso com a dedicação que essa responsabilidade exige.",
    },
    impacto: {
      title: "O Nosso Impacto",
      text: "Mais de 100 casos resolvidos com sucesso, incluindo litígios de referência que moldaram a jurisprudência portuguesa. Os nossos clientes recuperaram mais de 2 mil milhões em indemnizações e evitaram riscos regulatórios significativos nas suas operações internacionais.",
    },
  };

  const content = {
    missao: filosofia.missao,
    impacto: filosofia.impacto,
  };

  return (
    <div className="philosophy">
      <div className="philosophy-tabs">
        {Object.keys(content).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`tab ${active === key ? "active" : ""}`}
          >
            {key === "missao" ? "Missão" : "Impacto"}
            {active === key && (
              <motion.div
                layoutId="underline"
                className="underline"
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="philosophy-content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <h3>{content[active].title}</h3>
          <p>{content[active].text}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}