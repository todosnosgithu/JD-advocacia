import { Link, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import logo from "../assets/OIP.jpg";
import "./NavBar.css"


function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">

      {/* Marca */}
      <Link className="navbar-brand fw-bold" to="/">
        <img src={logo} alt="Logo" className="logo" />
      </Link>

      {/* Botão mobile */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Menu colapsável */}
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">

          <li className="nav-item">
            <NavLink className="nav-link" to="/" end>
              INÍCIO
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/servicos">
              SERVIÇOS
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/sobre">
              SOBRE
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/contacto">
              CONTACTO
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/recrutamento">
              RECRUTAMENTO
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/portfolio">
              PORTFÓLIO
            </NavLink>
          </li>

        </ul>

        {/* Botão CTA */}
        <Link to="/contacto" className="btn btn-primary ms-3">
          Agendar Consulta
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;