// src/services/servicosAPI.js
import { API_BASE_URL, getAuthToken, handleAPIError } from "../config/api";

export const servicosAPI = {
  // Buscar todos os serviços
  getAllServicos: async (token) => {
    try {
      const authToken = token || getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/servicos`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Erro ao carregar serviços");
      }
      
      // Garantir que retorna um array
      return result.servicos || result.data || result || [];
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
      throw new Error(handleAPIError(error));
    }
  },
  
  // Buscar serviço por ID
  getServicoById: async (id, token) => {
    try {
      const authToken = token || getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/servicos/${id}`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Erro ao carregar serviço");
      }
      
      return result;
    } catch (error) {
      console.error("Erro ao carregar serviço:", error);
      throw new Error(handleAPIError(error));
    }
  },
  
  // Criar novo serviço
  createServico: async (data, token) => {
    try {
      const authToken = token || getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/servicos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Erro ao criar serviço");
      }
      
      return result;
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      throw new Error(handleAPIError(error));
    }
  },
  
  // Atualizar serviço
  updateServico: async (id, data, token) => {
    try {
      const authToken = token || getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/servicos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Erro ao atualizar serviço");
      }
      
      return result;
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      throw new Error(handleAPIError(error));
    }
  },
  
  // Deletar serviço
  deleteServico: async (id, token) => {
    try {
      const authToken = token || getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/servicos/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Erro ao deletar serviço");
      }
      
      return result;
    } catch (error) {
      console.error("Erro ao deletar serviço:", error);
      throw new Error(handleAPIError(error));
    }
  },
};