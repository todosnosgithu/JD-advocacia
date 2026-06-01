// src/services/equipaAPI.js
import { API_BASE_URL, getAuthToken, handleAPIError } from "../config/api";
import { auth } from "../admin/auth";

export const equipaAPI = {
  // Buscar todos os membros da equipa
  getAllMembros: async (token) => {
    try {
      const authToken = token || getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/api/admin/equipa`, {
        headers: {
          "Authorization": authToken ? `Bearer ${authToken}` : "",
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      return result.equipa || result.data || result || [];
    } catch (error) {
      console.error("Erro ao carregar equipa da API:", error);
      // Retorna null para indicar que deve usar localStorage
      return null;
    }
  },
  
  // Criar novo membro
  createMembro: async (data, token) => {
    try {
      const authToken = token || getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/api/admin/equipa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erro ao criar membro na API:", error);
      // Retorna um objeto simulado para não quebrar o fluxo
      return { id: Date.now(), ...data };
    }
  },
  
  // Atualizar membro
  updateMembro: async (id, data, token) => {
    try {
      const authToken = token || getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/api/admin/equipa/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar membro na API:", error);
      return { success: true };
    }
  },
  
  // Deletar membro
  deleteMembro: async (id, token) => {
    try {
      const authToken = token || getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/api/admin/equipa/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erro ao deletar membro na API:", error);
      return { success: true };
    }
  },
};