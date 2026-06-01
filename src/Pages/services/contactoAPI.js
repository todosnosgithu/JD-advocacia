// src/services/contactoAPI.js
import { API_BASE_URL, getAuthToken, handleAPIError } from "../config/api";

export const contactoAPI = {
  // Enviar mensagem de contacto (público)
  sendMensagem: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contactar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao enviar mensagem");
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      throw new Error(handleAPIError(error));
    }
  },
  
  // Admin: Buscar todas as mensagens (admin)
  getAllMensagens: async (token) => {
    try {
      const authToken = token || getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/contactar`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao carregar mensagens");
      }
      
      const result = await response.json();
      return result.mensagens || result.data || result || [];
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      throw new Error(handleAPIError(error));
    }
  },
  
  // Admin: Buscar mensagem por ID
  getMensagemById: async (id, token) => {
    try {
      const authToken = token || getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/contactar/${id}`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao carregar mensagem");
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Erro ao carregar mensagem:", error);
      throw new Error(handleAPIError(error));
    }
  },
  
  // Admin: Deletar mensagem
  deleteMensagem: async (id, token) => {
    try {
      const authToken = token || getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/contactar/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao deletar mensagem");
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Erro ao deletar mensagem:", error);
      throw new Error(handleAPIError(error));
    }
  },
  
  // Admin: Marcar como lida
  marcarComoLida: async (id, token) => {
    try {
      const authToken = token || getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/contactar/${id}/ler`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao marcar mensagem como lida");
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Erro ao marcar mensagem:", error);
      throw new Error(handleAPIError(error));
    }
  },
};