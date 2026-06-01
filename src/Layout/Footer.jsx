import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="footer-clock">
      {time.toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-grid">

          {/* LOGO + DESCRIÇÃO */}
          <div className="footer-brand">
            <h3 className="footer-logo">
              FULANO<span>&amp;</span>ADVOCACIA
            </h3>

            <p className="footer-desc">
              Advocacia de precisão. Mais de duas décadas de excelência jurídica
              ao serviço de clientes nacionais e internacionais.
            </p>
          </div>

          {/* NAVEGAÇÃO */}
          <div className="footer-col">
            <h4>Navegação</h4>

            <div className="footer-links">
              <Link to="/">Início</Link>
              <Link to="/sobre">Sobre</Link>
              <Link to="/recrutamento">Recrutamento</Link>
              <Link to="/contacto">Contacto</Link>
            </div>
          </div>

          {/* CONTACTO */}
          <div className="footer-col">
            <h4>Contacto</h4>

            <div className="footer-contact">
              <span>Av. Deolinda Rodrigues</span>
              <span>Luanda, Angola</span>
              <span>+244 9XX XXX XXX</span>
              <span>fulanoadvocacia@gmail.com</span>
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Fulano Advocacia. Todos os
            direitos reservados.
          </p>

          <div className="footer-location">
            <span>Luanda</span>
            <span className="dot" />
            <LiveClock />
          </div>
        </div>

      </div>
    </footer>
  );
}