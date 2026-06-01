// src/services/galeriaAPI.js
import { API_BASE_URL, getAuthToken, handleAPIError } from "../config/api";

export const galeriaAPI = {
  // Buscar todas as imagens (público)
  getAllImagens: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/galeria`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Garantir que retorna um array
      return result.imagens || result.data || result || [];
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);
      // Fallback para localStorage
      const stored = JSON.parse(localStorage.getItem("galeria_fotos") || "[]");
      return stored;
    }
  },
  
  // Upload de imagem (admin)
  uploadImagem: async (file, token) => {
    try {
      const authToken = token || getAuthToken();
      const formData = new FormData();
      formData.append("imagem", file);
      
      const response = await fetch(`${API_BASE_URL}/admin/galeria`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao fazer upload");
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Erro no upload:", error);
      throw new Error(handleAPIError(error));
    }
  },
  
  // Deletar imagem (admin)
  deleteImagem: async (id, token) => {
    try {
      const authToken = token || getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/galeria/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao deletar imagem");
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Erro ao deletar imagem:", error);
      throw new Error(handleAPIError(error));
    }
  },
};