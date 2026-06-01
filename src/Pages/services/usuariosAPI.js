// src/services/usuariosAPI.js
import { API_BASE_URL, getAuthToken } from "../config/api";
import { auth } from "../admin/auth";

const handleResponse = async (response) => {
  if (response.status === 401) {
    auth.logout();
    throw new Error("Não autenticado. Faça login novamente.");
  }

  // Verificar se a resposta está vazia
  const text = await response.text();
  if (!text) {
    throw new Error("Resposta vazia do servidor");
  }

  try {
    const result = JSON.parse(text);
    if (!response.ok) {
      throw new Error(result.message || result.error || "Erro na requisição");
    }
    return result;
  } catch (e) {
    console.error("Erro ao fazer parse da resposta:", e);
    throw new Error("Resposta inválida do servidor");
  }
};

export const usuariosAPI = {
  // Login de usuário
  login: async (credentials) => {
    try {
      console.log("🔐 Tentando login com:", credentials.email);
      console.log("📡 URL:", `${API_BASE_URL}/api/admin/usuarios/login`);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log("📡 Status da resposta:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Credenciais inválidas");
      }

      const data = await response.json();
      console.log("✅ Login bem-sucedido");
      
      if (!data.token || data.token.trim() === "") {
        throw new Error("Token não recebido do servidor");
      }

      // Salvar token nos dois formatos para compatibilidade
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("admin_logged_in", "true");
      localStorage.setItem("admin_login_time", Date.now().toString());
      
      if (data.user) {
        localStorage.setItem("admin_user", JSON.stringify(data.user));
      }

      return { token: data.token, user: data.user };
    } catch (error) {
      console.error("❌ Erro no login:", error);
      throw new Error(error.message || "Erro ao conectar com o servidor. Verifique sua conexão.");
    }
  },

  // Testar conexão com a API
  testConnection: async () => {
    try {
      console.log("🔄 Testando conexão com a API...");
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("📡 Health check status:", response.status);
      return response.ok;
    } catch (error) {
      console.error("❌ Conexão falhou:", error);
      return false;
    }
  },

  // Admin: Buscar todos os usuários - VERSÃO OTIMIZADA
  getAllUsuarios: async (token) => {
    try {
      // Tentar obter token de diferentes fontes
      let authToken = token || getAuthToken();
      
      // Se ainda não tem token, tentar buscar do localStorage diretamente
      if (!authToken) {
        authToken = localStorage.getItem("admin_token") || localStorage.getItem("adminToken");
      }
      
      console.log("🔑 Token de autenticação:", authToken ? `Presente (${authToken.substring(0, 20)}...)` : "Ausente");
      console.log("🔐 Usuário autenticado:", auth.isAuthenticated());

      if (!authToken) {
        console.warn("⚠️ Token não encontrado");
        throw new Error("Token de autenticação não encontrado. Faça login novamente.");
      }

      if (!auth.isAuthenticated()) {
        console.warn("⚠️ Usuário não autenticado");
        auth.logout();
        throw new Error("Não autenticado. Faça login novamente.");
      }

      const url = `${API_BASE_URL}/api/admin/usuarios`;
      console.log("🌐 Buscando usuários em:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      console.log("📡 Status da resposta:", response.status);
      console.log("📡 Headers:", Object.fromEntries(response.headers.entries()));

      if (response.status === 404) {
        console.error("❌ Endpoint não encontrado. Verifique se a rota /api/admin/usuarios existe no backend.");
        throw new Error("Endpoint de usuários não encontrado. Verifique a configuração do backend.");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro resposta:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("📦 Dados recebidos da API (tipo):", typeof result);
      console.log("📦 Dados recebidos da API:", JSON.stringify(result).substring(0, 500));

      // Extrair array de usuários - suporta diferentes formatos de resposta
      let usuarios = [];
      
      // Lista de possíveis chaves que podem conter o array de usuários
      const possibleKeys = ['usuarios', 'users', 'data', 'items', 'results', 'records', 'lista', 'list'];
      
      for (const key of possibleKeys) {
        if (result[key] && Array.isArray(result[key])) {
          usuarios = result[key];
          console.log(`✅ Usuários encontrados na chave '${key}':`, usuarios.length);
          break;
        }
      }
      
      // Se não encontrou em nenhuma chave específica, verificar se o resultado é um array
      if (usuarios.length === 0 && Array.isArray(result)) {
        usuarios = result;
        console.log("✅ Usuários encontrados no array raiz:", usuarios.length);
      }
      
      // Se ainda não encontrou, procurar qualquer array no objeto
      if (usuarios.length === 0 && typeof result === 'object') {
        for (const key in result) {
          if (Array.isArray(result[key]) && result[key].length > 0) {
            usuarios = result[key];
            console.log(`✅ Usuários encontrados na chave '${key}':`, usuarios.length);
            break;
          }
        }
      }
      
      // Se não encontrou nenhum usuário mas tem a propriedade 'total' ou 'count'
      if (usuarios.length === 0 && result.total === 0) {
        console.log("ℹ️ Nenhum usuário encontrado (total = 0)");
        return [];
      }
      
      // Se encontrou dados mas não é array, tentar converter
      if (usuarios.length === 0 && result.usuario) {
        usuarios = [result.usuario];
        console.log("✅ Usuário único encontrado:", usuarios.length);
      }
      
      // Garantir que cada usuário tenha os campos necessários
      usuarios = usuarios.map(user => ({
        id: user.id || user._id || user.ID,
        nome: user.nome || user.name || user.fullName || user.full_name || "Sem nome",
        email: user.email || user.correo || "",
        cargo: user.cargo || user.role || user.tipo || user.type || "user",
        ativo: user.ativo !== false && user.active !== false && user.status !== "inactive",
        createdAt: user.createdAt || user.created_at || user.dateCreated || user.created || new Date().toISOString(),
        // Manter dados originais também
        ...user
      }));
      
      // Filtrar usuários inválidos
      usuarios = usuarios.filter(u => u.id && u.nome);
      
      console.log("🎯 Total de usuários processados:", usuarios.length);
      console.log("📋 Primeiros usuários:", usuarios.slice(0, 3).map(u => ({ id: u.id, nome: u.nome, email: u.email })));
      
      return usuarios;
      
    } catch (error) {
      console.error("❌ Erro ao carregar usuários:", error);
      console.error("Stack trace:", error.stack);
      throw new Error(error.message || "Não foi possível carregar os usuários do servidor.");
    }
  },

  // Admin: Buscar usuário por ID
  getUsuarioById: async (id, token) => {
    try {
      let authToken = token || getAuthToken();
      if (!authToken) {
        authToken = localStorage.getItem("admin_token") || localStorage.getItem("adminToken");
      }
      
      console.log(`🔍 Buscando usuário ID: ${id}`);

      if (!authToken) {
        throw new Error("Token de autenticação não encontrado");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/usuarios/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        throw new Error("Usuário não encontrado");
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("📦 Usuário encontrado:", result);
      
      // Extrair dados do usuário
      const usuario = result.usuario || result.data || result;
      return usuario;
      
    } catch (error) {
      console.error("❌ Erro ao carregar usuário:", error);
      throw new Error(error.message || "Não foi possível carregar os dados do usuário.");
    }
  },

  // Admin: Criar novo usuário
  createUsuario: async (data, token) => {
    try {
      let authToken = token || getAuthToken();
      if (!authToken) {
        authToken = localStorage.getItem("admin_token") || localStorage.getItem("adminToken");
      }
      
      console.log("➕ Criando novo usuário:", data.email);

      if (!authToken) {
        throw new Error("Token de autenticação não encontrado");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Erro ao criar usuário");
      }

      const result = await response.json();
      console.log("✅ Usuário criado com sucesso:", result);
      return result;
      
    } catch (error) {
      console.error("❌ Erro ao criar usuário:", error);
      throw new Error(error.message || "Não foi possível criar o usuário no servidor.");
    }
  },

  // Admin: Atualizar usuário
  updateUsuario: async (id, data, token) => {
    try {
      let authToken = token || getAuthToken();
      if (!authToken) {
        authToken = localStorage.getItem("admin_token") || localStorage.getItem("adminToken");
      }
      
      console.log(`✏️ Atualizando usuário ID: ${id}`);

      if (!authToken) {
        throw new Error("Token de autenticação não encontrado");
      }

      const updateData = {
        nome: data.nome,
        email: data.email,
        cargo: data.cargo
      };

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

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Erro ao atualizar usuário");
      }

      const result = await response.json();
      console.log("✅ Usuário atualizado com sucesso:", result);
      return result;
      
    } catch (error) {
      console.error("❌ Erro ao atualizar usuário:", error);
      throw new Error(error.message || "Não foi possível atualizar o usuário no servidor.");
    }
  },

  // Admin: Deletar usuário
  deleteUsuario: async (id, token) => {
    try {
      let authToken = token || getAuthToken();
      if (!authToken) {
        authToken = localStorage.getItem("admin_token") || localStorage.getItem("adminToken");
      }
      
      console.log(`🗑️ Deletando usuário ID: ${id}`);

      if (!authToken) {
        throw new Error("Token de autenticação não encontrado");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Erro ao deletar usuário");
      }

      const result = await response.json();
      console.log("✅ Usuário deletado com sucesso");
      return result;
      
    } catch (error) {
      console.error("❌ Erro ao deletar usuário:", error);
      throw new Error(error.message || "Não foi possível deletar o usuário no servidor.");
    }
  },

  // Verificar status do servidor
  checkServerStatus: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn("⚠️ Servidor não está respondendo:", error.message);
      return false;
    }
  }
};

// Função auxiliar para debug
export const debugAPI = async () => {
  console.group("🔧 Debug da API");
  console.log("API_BASE_URL:", API_BASE_URL);
  console.log("Token no localStorage:", localStorage.getItem("admin_token"));
  console.log("Token alternativo:", localStorage.getItem("adminToken"));
  console.log("Usuário autenticado:", auth.isAuthenticated());
  
  // Testar conexão
  try {
    const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
    console.log("Health check:", healthResponse.status);
  } catch (e) {
    console.error("Health check falhou:", e);
  }
  
  console.groupEnd();
};