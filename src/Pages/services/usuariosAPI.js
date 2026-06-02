import { API_BASE_URL, getAuthToken } from "../config/api";
import { auth } from "../admin/auth";

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
        throw new Error(errorData.message || errorData.error || "Credenciais inválidas");
      }

      const data = await response.json();
      console.log("✅ Login bem-sucedido, resposta:", data);
      
      // Extrair token (suporta diferentes formatos)
      const token = data.token || data.accessToken || data.access_token;
      
      if (!token) {
        console.error("Token não encontrado na resposta:", data);
        throw new Error("Token não recebido do servidor");
      }

      // Salvar token
      localStorage.setItem("admin_token", token);
      localStorage.setItem("adminToken", token);
      localStorage.setItem("admin_logged_in", "true");
      localStorage.setItem("admin_login_time", Date.now().toString());
      
      // Salvar dados do usuário logado
      const user = data.user || data.usuario || data.data;
      if (user) {
        localStorage.setItem("admin_user", JSON.stringify(user));
        console.log("👤 Usuário logado salvo:", user);
      }

      return { token, user };
    } catch (error) {
      console.error("❌ Erro no login:", error);
      throw new Error(error.message || "Erro ao conectar com o servidor.");
    }
  },

  // Buscar todos os usuários - CORRIGIDO
  getAllUsuarios: async (token) => {
    try {
      const authToken = token || getAuthToken();
      
      console.log("🔍 getAllUsuarios - Token:", authToken ? `${authToken.substring(0, 30)}...` : "Nenhum");
      
      if (!authToken) {
        throw new Error("Token de autenticação não encontrado");
      }

      const url = `${API_BASE_URL}/api/admin/usuarios`;
      console.log("📡 GET:", url);
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      console.log("📡 Status da resposta:", response.status);

      if (response.status === 401) {
        auth.logout();
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro resposta:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("📦 Resposta completa da API:", JSON.stringify(result, null, 2));

      // EXTRAIR ARRAY DE USUÁRIOS - CORREÇÃO PRINCIPAL
      let usuariosArray = [];
      
      // CASO 1: { success: true, data: { error: false, data: [...] } }
      if (result.success && result.data && result.data.data && Array.isArray(result.data.data)) {
        usuariosArray = result.data.data;
        console.log("✅ Formato: { success: true, data: { data: [] } }");
      }
      // CASO 2: { data: { data: [...] } }
      else if (result.data && result.data.data && Array.isArray(result.data.data)) {
        usuariosArray = result.data.data;
        console.log("✅ Formato: { data: { data: [] } }");
      }
      // CASO 3: { data: [...] }
      else if (result.data && Array.isArray(result.data)) {
        usuariosArray = result.data;
        console.log("✅ Formato: { data: [] }");
      }
      // CASO 4: Array direto
      else if (Array.isArray(result)) {
        usuariosArray = result;
        console.log("✅ Formato: Array direto");
      }
      // CASO 5: { usuarios: [] }
      else if (result.usuarios && Array.isArray(result.usuarios)) {
        usuariosArray = result.usuarios;
        console.log("✅ Formato: { usuarios: [] }");
      }
      // CASO 6: { users: [] }
      else if (result.users && Array.isArray(result.users)) {
        usuariosArray = result.users;
        console.log("✅ Formato: { users: [] }");
      }
      // CASO 7: Busca recursiva em estruturas aninhadas
      else {
        const findArrayDeep = (obj, depth = 0) => {
          if (depth > 5) return null;
          if (!obj || typeof obj !== 'object') return null;
          
          for (const key in obj) {
            if (Array.isArray(obj[key]) && obj[key].length > 0) {
              console.log(`✅ Formato: { ${key}: [] } (nível ${depth})`);
              return obj[key];
            }
            if (obj[key] && typeof obj[key] === 'object') {
              const found = findArrayDeep(obj[key], depth + 1);
              if (found) return found;
            }
          }
          return null;
        };
        
        const foundArray = findArrayDeep(result);
        if (foundArray && Array.isArray(foundArray)) {
          usuariosArray = foundArray;
          console.log(`✅ Array encontrado com ${usuariosArray.length} usuários`);
        } else {
          console.warn("⚠️ Nenhum usuário encontrado na resposta");
        }
      }
      
      // Mapear para formato padronizado
      const usuariosFormatados = usuariosArray.map(user => ({
        id: user.id || user._id || user.ID || user.userId,
        nome: user.nome || user.name || user.fullName || user.full_name || "Sem nome",
        email: user.email || user.correo || "",
        cargo: user.cargo || user.role || user.tipo || "admin",
        ativo: user.ativo !== false,
        ultimo_login: user.ultimo_login,
        criado_em: user.criado_em || user.createdAt || user.created_at,
        createdAt: user.criado_em || user.createdAt || user.created_at
      }));
      
      console.log(`✅ Total de usuários carregados: ${usuariosFormatados.length}`);
      
      if (usuariosFormatados.length > 0) {
        console.log("📋 Primeiro usuário:", usuariosFormatados[0]);
      } else {
        console.warn("⚠️ Nenhum usuário encontrado na resposta");
      }
      
      return usuariosFormatados;
      
    } catch (error) {
      console.error("❌ Erro ao carregar usuários:", error);
      throw error;
    }
  },

  // Buscar usuário por ID
  getUsuarioById: async (id, token) => {
    try {
      const authToken = token || getAuthToken();
      
      if (!authToken) {
        throw new Error("Token de autenticação não encontrado");
      }

      console.log(`📡 GET /api/admin/usuarios/${id}`);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/usuarios/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const usuario = result.usuario || result.data || result;
      
      return usuario;
      
    } catch (error) {
      console.error("❌ Erro ao buscar usuário:", error);
      throw error;
    }
  },

  // Criar novo usuário
  createUsuario: async (data, token) => {
    try {
      const authToken = token || getAuthToken();
      
      if (!authToken) {
        throw new Error("Token de autenticação não encontrado");
      }

      console.log("📡 POST /api/admin/usuarios");
      console.log("📦 Dados:", { nome: data.nome, email: data.email });
      
      const response = await fetch(`${API_BASE_URL}/api/admin/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          cargo: data.cargo || "admin"
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || error.error || "Erro ao criar usuário");
      }

      const result = await response.json();
      console.log("✅ Usuário criado:", result);
      
      return result;
      
    } catch (error) {
      console.error("❌ Erro ao criar usuário:", error);
      throw error;
    }
  },

  // Atualizar usuário
  updateUsuario: async (id, data, token) => {
    try {
      const authToken = token || getAuthToken();
      
      if (!authToken) {
        throw new Error("Token de autenticação não encontrado");
      }

      console.log(`📡 PUT /api/admin/usuarios/${id}`);
      
      const updateData = {
        nome: data.nome,
        email: data.email,
        cargo: data.cargo || "admin"
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
        throw new Error(error.message || error.error || "Erro ao atualizar usuário");
      }

      const result = await response.json();
      console.log("✅ Usuário atualizado:", result);
      
      return result;
      
    } catch (error) {
      console.error("❌ Erro ao atualizar usuário:", error);
      throw error;
    }
  },

  // Deletar usuário
  deleteUsuario: async (id, token) => {
    try {
      const authToken = token || getAuthToken();
      
      if (!authToken) {
        throw new Error("Token de autenticação não encontrado");
      }

      console.log(`📡 DELETE /api/admin/usuarios/${id}`);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || error.error || "Erro ao deletar usuário");
      }

      const result = await response.json();
      console.log("✅ Usuário deletado");
      
      return result;
      
    } catch (error) {
      console.error("❌ Erro ao deletar usuário:", error);
      throw error;
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
      console.warn("⚠️ Servidor offline:", error.message);
      return false;
    }
  }
};