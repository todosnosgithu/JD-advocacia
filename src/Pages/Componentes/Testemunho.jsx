// src/Componentes/Testimonials.jsx
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Testimonials.css";
import { useImagens } from "../../context/ImagensContext";

const testimonials = [
  {
    name: "Sr. Augusto Fernando",
    role: "Empresário",
    text: "A equipa da Fulano Advogados demonstrou um profissionalismo e dedicação incomparáveis. Resolveram a minha questão laboral com eficiência e transparência absolutas.",
  },
  {
    name: "Dra. Mariana Santos",
    role: "Médica",
    text: "Confiei neles para o meu processo de inventário e o resultado superou todas as expectativas. Seriedade e competência em cada etapa do processo.",
  },
  {
    name: "Sr. Carlos Mendes",
    role: "Director Financeiro",
    text: "A assessoria empresarial que recebi foi de excelência absoluta. Recomendo a qualquer pessoa que valorize um serviço jurídico de primeira classe.",
  },
];

export default function TestimonialSection() {
  const { getImagemUrl } = useImagens();
  const vozesImage = getImagemUrl("home_vozes");
  
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = (index) => {
    if (!scrollRef.current) return;
    const clamped = Math.max(0, Math.min(index, testimonials.length - 1));
    setActiveIndex(clamped);

    const card = scrollRef.current.children[clamped];
    if (card) {
      card.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }
  };

  return (
    <section className="testimonial-section">
      <img src={vozesImage} alt="Vozes de Confiança" className="testimonial-bg"/>
      <div className="testimonial-wrapper">
        {/* HEADER */}
        <div className="testimonial-header">
          <div>
            <span className="testimonial-label">Testemunhos</span>
          </div>

          <div className="testimonial-header-right">
            <h2 className="testimonial-title">
              Vozes de <br />
              <span className="testimonial-highlight">Confiança</span>
            </h2>

            <div className="testimonial-nav">
              <button onClick={() => scrollTo(activeIndex - 1)}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => scrollTo(activeIndex + 1)}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* SLIDER */}
        <div className="testimonial-scroll" ref={scrollRef}>
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="testimonial-content">
                <div className="testimonial-user">
                  <div className="testimonial-dot" />
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-role">{t.role}</p>
                  </div>
                </div>

                <blockquote className="testimonial-text">
                  "{t.text}"
                </blockquote>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DOTS MOBILE */}
        <div className="testimonial-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`testimonial-dot-btn ${i === activeIndex ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}