import { motion } from "framer-motion";
import "./Journey.Map.css";

const steps = [
  {
    stage: "Candidatura",
    duration: "Semana 1",
    desc: "Submissão do CV e carta de motivação através do formulário.",
  },
  {
    stage: "Entrevista Inicial",
    duration: "Semana 2-3",
    desc: "Conversa com o departamento de Recursos Humanos.",
  },
  {
    stage: "Caso Prático",
    duration: "Semana 4",
    desc: "Resolução de um caso prático supervisionado por um sócio.",
  },
  {
    stage: "Entrevista Final",
    duration: "Semana 5",
    desc: "Reunião com os sócios fundadores da firma.",
  },
  {
    stage: "Proposta",
    duration: "Semana 6",
    desc: "Apresentação da oferta e início da integração.",
  },
  {
    stage: "Associado Júnior",
    duration: "Ano 1-3",
    desc: "Formação intensiva e mentoria personalizada.",
  },
  {
    stage: "Associado Sénior",
    duration: "Ano 4-6",
    desc: "Gestão autónoma de carteira de clientes.",
  },
  {
    stage: "Sócio",
    duration: "Ano 7+",
    desc: "Liderança de equipa e desenvolvimento estratégico.",
  },
];

export default function JourneyMap() {
  return (
    <div className="journey">

      {/* LINHA VERTICAL */}
      <div className="journey-line" />

      <div className="journey-list">
        {steps.map((step, i) => (
          <motion.div
            key={step.stage}
            className="journey-item"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <div className="journey-dot" />

            <div className="journey-content">
              <div className="journey-header">
                <h4>{step.stage}</h4>
                <span>{step.duration}</span>
              </div>

              <p>{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}