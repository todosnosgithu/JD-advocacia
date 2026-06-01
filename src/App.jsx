// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { SiteDataProvider } from "./Pages/context/SiteDataContext";
import { ImagensProvider } from "./context/ImagensContext"; // ← CAMINHO CORRETO
import Home from "./Pages/Home";
import Admin from "./Pages/admin/Admin";
import Servicos from "./Pages/Serviços";
import ServicoDetalhes from "./Pages/ServicoDetalhes";
import Candidatar from "./Pages/Detalhes/Candidatar";
import Sobre from "./Pages/Sobre";
import Contacto from "./Pages/Contacto";
import Navbar from "./Layout/NavBar";
import Footer from "./Layout/Footer";
import "./App.css";
import Recrutamento from "./Pages/Recrutamento";
import Portifolio from "./Pages/Portfolio";
import Login from "./Layout/Login";
import Registro from "./Layout/Registro";
import { auth } from "./Pages/admin/auth";

// Componente de rota protegida para admin
const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("admin_token");
  const isAuthenticated = auth.isAuthenticated();

  if (!token || !isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Componente de rota pública
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("admin_token");
  const isAuthenticated = auth.isAuthenticated();

  if (window.location.pathname === "/admin/login" && token && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

function Layout() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/registro" ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/servico/:id" element={<ServicoDetalhes />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/recrutamento" element={<Recrutamento />} />
        <Route path="/portfolio" element={<Portifolio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/candidatar" element={<Candidatar />} />

        {/* Rotas admin com proteção */}
        <Route
          path="/admin/login"
          element={
            <PublicRoute>
              <Admin />
            </PublicRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <Admin />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <Admin />
            </AdminProtectedRoute>
          }
        />
      </Routes>
      {!hideNavbar && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <SiteDataProvider>
        <ImagensProvider>
          <Layout />
        </ImagensProvider>
      </SiteDataProvider>
    </Router>
  );
}

export default App;