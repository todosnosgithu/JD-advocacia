// src/Servicos.jsx
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { servicosAPI } from "./services/servicosAPI";
import Hero from "./Componentes/Hero";
import HeroSection from "./Componentes/HeroSection";
import "./Servicos.css";

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

function Servicos() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
  
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Carregando serviços da API...");
      
      let data = [];
      try {
        data = await servicosAPI.getAllServicos(token);
        console.log("Dados da API:", data);
      } catch (apiError) {
        console.error("Erro na API, usando localStorage:", apiError);
        // Fallback para localStorage
        const saved = localStorage.getItem("servicos_content");
        if (saved) {
          data = JSON.parse(saved);
          console.log("Dados do localStorage:", data);
        } else {
          // Dados padrão
          data = [
            { id: "trabalho", titulo: "Direito do Trabalho", descricao: "Defesa de trabalhadores e empresas." },
            { id: "civil", titulo: "Direito Civil", descricao: "Resolução de conflitos e contratos." },
            { id: "penal", titulo: "Direito Penal", descricao: "Assistência jurídica especializada." },
            { id: "empresarial", titulo: "Direito Empresarial", descricao: "Consultoria para empresas." },
            { id: "familia", titulo: "Direito de Família", descricao: "Divórcios, guarda e heranças." },
            { id: "imobiliario", titulo: "Direito Imobiliário", descricao: "Compra, venda e regularização." },
            { id: "comercial", titulo: "Direito Comercial", descricao: "Assessoria integral, constituição ao crescimento sustentável." },
            { id: "internacional", titulo: "Direito Internacional", descricao: "Operações transfronteiriças e comércio global." },
          ];
        }
      }
      
      setServices(data);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev === testimonials.length - 1 ? 0 : prev + 1;
        scrollTo(next);
        return next;
      });
    }, 90000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="servicos-loading">
        <div className="loading-spinner"></div>
        <p>Carregando serviços...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="servicos-error">
        <p>Erro ao carregar serviços: {error}</p>
        <button onClick={loadServices}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="servicos-container">
      <HeroSection />
      <main className="servicos">
        <h3>Áreas de Actuação</h3>
        <div className="servicos-lista">
          {services.map((item) => (
            <div className="servico-card" key={item.id}>
              <h4>{item.titulo || item.title}</h4>
              <p>{item.descricao || item.desc || item.content?.substring(0, 100)}</p>
              <Link to={`/servico/${item.id}`} className="servico-link">Saiba mais →</Link>
            </div>
          ))}
        </div>
      </main>

      <section className="testemunho">
        <div className="testimonial-wrapper">
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
                  <blockquote className="testimonial-text">"{t.text}"</blockquote>
                </div>
              </motion.div>
            ))}
          </div>

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

      <Hero />
    </div>
  );
}

export default Servicos;