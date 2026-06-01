// src/services/imagensAPI.js
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

export const imagensAPI = {
  // Buscar todas as imagens do site
  getAllImagens: async (token) => {
    try {
      const authToken = token || getAuthToken();

      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/imagens`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro na API");
      }

      const result = await handleResponse(response);
      return result.imagens || result.data || result || [];
    } catch (error) {
      console.error("Erro ao carregar imagens da API:", error);
      // Fallback para localStorage
      const stored = JSON.parse(localStorage.getItem("site_imagens") || "[]");
      return stored;
    }
  },

  // Buscar imagem por ID
  getImagemById: async (id, token) => {
    try {
      const authToken = token || getAuthToken();

      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/imagens/${id}`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Erro ao carregar imagem:", error);
      const stored = JSON.parse(localStorage.getItem("site_imagens") || "[]");
      return stored.find(img => img.id === id) || null;
    }
  },

  // Buscar imagens por categoria
  getImagensPorCategoria: async (categoria, token) => {
    try {
      const authToken = token || getAuthToken();

      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/imagens/categoria/${categoria}`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Erro ao carregar imagens por categoria:", error);
      const stored = JSON.parse(localStorage.getItem("site_imagens") || "[]");
      return stored.filter(img => img.categoria === categoria);
    }
  },

  // Buscar imagens por página
  getImagensPorPagina: async (pagina, token) => {
    try {
      const authToken = token || getAuthToken();

      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/imagens/pagina/${pagina}`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Erro ao carregar imagens por página:", error);
      const stored = JSON.parse(localStorage.getItem("site_imagens") || "[]");
      return stored.filter(img => img.pagina === pagina);
    }
  },

  // Atualizar imagem (upload)
  updateImagem: async (id, file, token) => {
    try {
      const authToken = token || getAuthToken();

      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      const formData = new FormData();
      formData.append("imagem", file);

      const response = await fetch(`${API_BASE_URL}/api/admin/imagens/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
        body: formData,
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Erro ao atualizar imagem:", error);
      // Fallback para localStorage
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          const stored = JSON.parse(localStorage.getItem("site_imagens") || "[]");
          const index = stored.findIndex(img => img.id === id);
          if (index !== -1) {
            stored[index] = { ...stored[index], url: reader.result, updatedAt: new Date().toISOString() };
            localStorage.setItem("site_imagens", JSON.stringify(stored));
          }
          resolve({ success: true, url: reader.result });
        };
        reader.readAsDataURL(file);
      });
    }
  },

  // Upload de nova imagem (criar)
  uploadImagem: async (data, token) => {
    try {
      const authToken = token || getAuthToken();

      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      const formData = new FormData();
      formData.append("imagem", data.file);
      formData.append("nome", data.nome);
      formData.append("categoria", data.categoria);
      formData.append("pagina", data.pagina);

      const response = await fetch(`${API_BASE_URL}/api/admin/imagens`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
        body: formData,
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      // Fallback para localStorage
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          const newImage = {
            id: Date.now().toString(),
            nome: data.nome,
            categoria: data.categoria,
            pagina: data.pagina,
            url: reader.result,
            createdAt: new Date().toISOString()
          };
          const stored = JSON.parse(localStorage.getItem("site_imagens") || "[]");
          stored.push(newImage);
          localStorage.setItem("site_imagens", JSON.stringify(stored));
          resolve({ success: true, imagem: newImage });
        };
        reader.readAsDataURL(data.file);
      });
    }
  },

  // Deletar imagem
  deleteImagem: async (id, token) => {
    try {
      const authToken = token || getAuthToken();

      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/imagens/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Erro ao deletar imagem:", error);
      // Fallback para localStorage
      const stored = JSON.parse(localStorage.getItem("site_imagens") || "[]");
      const filtered = stored.filter(img => img.id !== id);
      localStorage.setItem("site_imagens", JSON.stringify(filtered));
      return { success: true };
    }
  },

  // Restaurar imagem padrão
  restoreDefaultImage: async (id, token) => {
    try {
      const authToken = token || getAuthToken();

      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/imagens/${id}/restore`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Erro ao restaurar imagem padrão:", error);
      throw new Error(handleAPIError(error));
    }
  },

  // Obter estatísticas das imagens
  getImagensStats: async (token) => {
    try {
      const authToken = token || getAuthToken();

      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/imagens/stats`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      const stored = JSON.parse(localStorage.getItem("site_imagens") || "[]");
      return {
        total: stored.length,
        porPagina: stored.reduce((acc, img) => {
          acc[img.pagina] = (acc[img.pagina] || 0) + 1;
          return acc;
        }, {})
      };
    }
  }
};