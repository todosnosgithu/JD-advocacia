// src/ServicoDetalhes.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { servicosAPI } from "./services/servicosAPI";
import "./ServicoDetalhe.css";

function ServicoDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servico, setServico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");

  useEffect(() => {
    loadServico();
  }, [id]);

  const loadServico = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Buscando serviço com ID:", id);
      
      let data = [];
      let serviceData = null;
      
      // Tentar buscar da API primeiro
      try {
        serviceData = await servicosAPI.getServicoById(id, token);
        console.log("Dados da API:", serviceData);
        if (serviceData) {
          serviceData = serviceData.servico || serviceData.data || serviceData;
        }
      } catch (apiError) {
        console.error("Erro na API, usando localStorage:", apiError);
        // Fallback para localStorage
        const saved = localStorage.getItem("servicos_content");
        if (saved) {
          data = JSON.parse(saved);
          console.log("Dados do localStorage:", data);
          serviceData = data.find(s => s.id === id || s.id === parseInt(id) || s.id?.toString() === id);
        }
      }
      
      // Se conseguiu da API, usar o resultado
      if (serviceData && Object.keys(serviceData).length > 0) {
        // Mapear os campos para o formato esperado pelo componente
        const mappedServico = {
          id: serviceData.id,
          title: serviceData.titulo || serviceData.title || "Sem título",
          content: serviceData.descricao || serviceData.content || "Sem descrição",
          subtitles: serviceData.subtitles || "",
          subtitle: serviceData.subtitle || "",
          pontos: serviceData.pontos || [],
          ponto: serviceData.ponto || []
        };
        setServico(mappedServico);
      } else {
        setError("Serviço não encontrado");
      }
    } catch (error) {
      console.error("Erro ao carregar serviço:", error);
      setError("Erro ao carregar serviço");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="servico-detalhe-loading">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (error || !servico) {
    return (
      <div className="servico-detalhe-error">
        <p>{error || "Serviço não encontrado."}</p>
        <button onClick={() => navigate("/servicos")}>Voltar para Serviços</button>
      </div>
    );
  }

  return (
    <div className="servico-detalhe">
      <button className="back-button" onClick={() => navigate("/servicos")}>
        <ArrowLeft size={18} /> Voltar para Serviços
      </button>
      
      <div className="servico-detalhes">
        <h2>{servico.title}</h2>

        {servico.subtitles && <h3>{servico.subtitles}</h3>}
        <p>{servico.content}</p>

        {servico.pontos && servico.pontos.length > 0 && (
          <>
            <h3>Áreas de Atuação</h3>
            <ul>
              {servico.pontos.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </>
        )}

        {servico.subtitle && <h3>{servico.subtitle}</h3>}

        {servico.ponto && servico.ponto.length > 0 && (
          <>
            <h3>Benefícios</h3>
            <ul>
              {servico.ponto.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default ServicoDetalhes;