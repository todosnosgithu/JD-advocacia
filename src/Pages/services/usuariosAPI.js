// src/services/usuariosAPI.js
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

// Dados mockados para fallback
const mockUsuarios = [
  {
    id: 1,
    nome: "Administrador",
    email: "admin@advoca.com",
    cargo: "admin",
    createdAt: new Date().toISOString()
  }
];

export const usuariosAPI = {
  // Login de usuário (com fallback para mock)
  login: async (credentials) => {
    try {
      // Tentar chamar a API real
      const response = await fetch(`${API_BASE_URL}/api/admin/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        // Se falhar, usar mock
        console.log("API offline, usando login mockado");
        const mockResult = auth.mockLogin(credentials.email, credentials.senha);
        if (mockResult.success) {
          return { token: mockResult.token, user: mockResult.user };
        }
        throw new Error(mockResult.message);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro no login, tentando mock:", error);
      // Fallback para mock
      const mockResult = auth.mockLogin(credentials.email, credentials.senha);
      if (mockResult.success) {
        return { token: mockResult.token, user: mockResult.user };
      }
      throw new Error("Credenciais inválidas");
    }
  },

  // Admin: Buscar todos os usuários (com fallback)
  getAllUsuarios: async (token) => {
    try {
      const authToken = token || getAuthToken();

      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/usuarios`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro na API");
      }

      const result = await handleResponse(response);
      return result.usuarios || result.data || result || [];
    } catch (error) {
      console.error("Erro ao carregar usuários, usando localStorage:", error);
      const stored = JSON.parse(localStorage.getItem("admin_usuarios") || "[]");
      // Se não houver dados, retorna mock
      return stored.length > 0 ? stored : mockUsuarios;
    }
  },

  // Admin: Buscar usuário por ID
  getUsuarioById: async (id, token) => {
    try {
      const authToken = token || getAuthToken();

      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/usuarios/${id}`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      const stored = JSON.parse(localStorage.getItem("admin_usuarios") || "[]");
      return stored.find(u => u.id === id) || null;
    }
  },

  // Admin: Criar novo usuário
  createUsuario: async (data, token) => {
    try {
      const authToken = token || getAuthToken();

      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Erro ao criar usuário, salvando localmente:", error);
      // Fallback para localStorage
      const newUsuario = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString()
      };
      const stored = JSON.parse(localStorage.getItem("admin_usuarios") || "[]");
      stored.push(newUsuario);
      localStorage.setItem("admin_usuarios", JSON.stringify(stored));
      return { success: true, id: newUsuario.id, usuario: newUsuario };
    }
  },

  // Admin: Atualizar usuário
  // Em updateUsuario - garantir que a senha seja enviada
  updateUsuario: async (id, data, token) => {
    try {
      const authToken = token || getAuthToken();

      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      // Garantir que os dados incluam a senha se fornecida
      const updateData = {
        nome: data.nome,
        email: data.email,
        cargo: data.cargo
      };

      // Incluir senha apenas se for fornecida e não vazia
      if (data.senha && data.senha.trim() !== "") {
        updateData.senha = data.senha;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(updateData),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      // Fallback para localStorage
      const stored = JSON.parse(localStorage.getItem("admin_usuarios") || "[]");
      const index = stored.findIndex(u => u.id === id);
      if (index !== -1) {
        stored[index] = { ...stored[index], ...data };
        localStorage.setItem("admin_usuarios", JSON.stringify(stored));
      }
      // Se for atualização de senha, atualizar também no auth
      if (data.senha) {
        const currentUser = auth.getCurrentUser();
        if (currentUser && currentUser.id === id) {
          localStorage.setItem("admin_user", JSON.stringify({ ...currentUser, senha: data.senha }));
        }
      }
      return { success: true };
    }
  },

  // Admin: Deletar usuário
  deleteUsuario: async (id, token) => {
    try {
      const authToken = token || getAuthToken();

      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      // Fallback para localStorage
      const stored = JSON.parse(localStorage.getItem("admin_usuarios") || "[]");
      const filtered = stored.filter(u => u.id !== id);
      localStorage.setItem("admin_usuarios", JSON.stringify(filtered));
      return { success: true };
    }
  },
};