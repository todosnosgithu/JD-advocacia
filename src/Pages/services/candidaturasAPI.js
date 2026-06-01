// src/services/candidaturasAPI.js
import { API_BASE_URL, getAuthToken, handleAPIError } from "../config/api";
import { auth } from "../admin/auth";

const handleResponse = async (response) => {
  if (response.status === 401) {
    auth.logout();
    throw new Error("Não autenticado. Faça login novamente.");
  }
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || "Erro na requisição");
  }
  
  return result;
};

export const candidaturasAPI = {
  // Enviar candidatura (pública)
  sendCandidatura: async (data) => {
    try {
      console.log("📤 Enviando candidatura para:", `${API_BASE_URL}/api/admin/candidaturas`);
      console.log("📝 Dados:", data);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/candidaturas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      console.log("📥 Resposta status:", response.status);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao enviar candidatura");
      }
      
      const result = await response.json();
      console.log("✅ Candidatura enviada com sucesso:", result);
      return result;
    } catch (error) {
      console.error("❌ Erro ao enviar candidatura:", error);
      throw new Error(handleAPIError(error));
    }
  },
  
  // Admin: Listar todas as candidaturas
  getAllCandidaturas: async (token) => {
    try {
      const authToken = token || getAuthToken();
      
      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }
      
      const response = await fetch(`${API_BASE_URL}/api/admin/candidaturas`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Erro ao carregar candidaturas");
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Erro ao carregar candidaturas:", error);
      // Fallback para localStorage
      const stored = JSON.parse(localStorage.getItem("candidaturas") || "[]");
      return { candidaturas: stored };
    }
  },
  
  // Admin: Atualizar estado da candidatura
  updateCandidaturaStatus: async (id, estado, token) => {
    try {
      const authToken = token || getAuthToken();
      
      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }
      
      const response = await fetch(`${API_BASE_URL}/api/admin/candidaturas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({ estado }),
      });
      
      if (!response.ok) {
        throw new Error("Erro ao atualizar candidatura");
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Erro ao atualizar candidatura:", error);
      throw new Error(handleAPIError(error));
    }
  },
  
  // Admin: Deletar candidatura
  deleteCandidatura: async (id, token) => {
    try {
      const authToken = token || getAuthToken();
      
      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }
      
      const response = await fetch(`${API_BASE_URL}/api/admin/candidaturas/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Erro ao deletar candidatura");
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Erro ao deletar candidatura:", error);
      throw new Error(handleAPIError(error));
    }
  },
};