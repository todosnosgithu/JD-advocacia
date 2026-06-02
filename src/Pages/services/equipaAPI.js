import { API_BASE_URL, getAuthToken } from "../config/api";
import { auth } from "../admin/auth";

const EQUIPA_STORAGE_KEY = "admin_equipa";

// Dados mockados iniciais
const mockEquipa = [
  {
    id: 1,
    nome: "Dr. António Silva",
    especialidade: "Advogado Sénior",
    email: "antonio.silva@advoca.com",
    telefone: "+244 923 456 789",
    bio: "Advogado com mais de 15 anos de experiência",
    foto: null,
    ordem: 1,
    ativo: true,
    createdAt: new Date().toISOString()
  }
];

// Função para carregar dados do localStorage
const loadFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(EQUIPA_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Erro ao carregar localStorage:", e);
  }
  localStorage.setItem(EQUIPA_STORAGE_KEY, JSON.stringify(mockEquipa));
  return mockEquipa;
};

// Função para salvar no localStorage
const saveToLocalStorage = (data) => {
  try {
    localStorage.setItem(EQUIPA_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Erro ao salvar no localStorage:", e);
  }
};

export const equipaAPI = {
  // GET - Buscar todos os membros
  getAllMembros: async (token) => {
    try {
      const authToken = token || getAuthToken();
      
      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      console.log("📡 GET /api/admin/equipa");
      const response = await fetch(`${API_BASE_URL}/api/admin/equipa`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log("✅ Resposta recebida:", result);
      
      // Extrair array de membros (suporta diferentes formatos)
      let equipa = [];
      if (Array.isArray(result)) {
        equipa = result;
      } else if (result.equipa && Array.isArray(result.equipa)) {
        equipa = result.equipa;
      } else if (result.data && Array.isArray(result.data)) {
        equipa = result.data;
      } else if (result.membros && Array.isArray(result.membros)) {
        equipa = result.membros;
      }
      
      if (equipa.length > 0) {
        saveToLocalStorage(equipa);
        return equipa;
      }
      
      return loadFromLocalStorage();
      
    } catch (error) {
      console.error("❌ Erro ao carregar membros:", error);
      return loadFromLocalStorage();
    }
  },
  
  // POST - Criar novo membro com upload de foto
  createMembro: async (data, token, imageFile) => {
    try {
      const authToken = token || getAuthToken();
      
      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      if (!data.nome || !data.especialidade) {
        throw new Error("Nome e especialidade são obrigatórios");
      }

      console.log("📡 POST /api/admin/equipa");
      console.log("Dados:", { nome: data.nome, especialidade: data.especialidade });
      console.log("Arquivo:", imageFile ? imageFile.name : "Nenhum");
      
      // Criar FormData para envio multipart
      const formData = new FormData();
      formData.append('nome', data.nome);
      formData.append('especialidade', data.especialidade);
      
      if (data.email) formData.append('email', data.email);
      if (data.telefone) formData.append('telefone', data.telefone);
      if (data.bio) formData.append('bio', data.bio);
      
      // Adicionar arquivo de imagem se existir
      if (imageFile && imageFile instanceof File) {
        formData.append('foto', imageFile);
      }
      
      const response = await fetch(`${API_BASE_URL}/api/admin/equipa`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro resposta:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log("✅ Membro criado:", result);
      
      const newMembro = result.membro || result.data || result;
      
      // Salvar no localStorage como backup
      const equipa = loadFromLocalStorage();
      equipa.push(newMembro);
      saveToLocalStorage(equipa);
      
      return newMembro;
      
    } catch (error) {
      console.error("❌ Erro ao criar membro:", error);
      throw error;
    }
  },
  
  // PUT - Atualizar membro com upload de foto
  updateMembro: async (id, data, token, imageFile) => {
    try {
      const authToken = token || getAuthToken();
      
      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      console.log(`📡 PUT /api/admin/equipa/${id}`);
      console.log("Dados:", { nome: data.nome, especialidade: data.especialidade });
      console.log("Arquivo:", imageFile ? imageFile.name : "Nenhum");
      
      // Criar FormData para envio multipart
      const formData = new FormData();
      formData.append('nome', data.nome);
      formData.append('especialidade', data.especialidade);
      
      if (data.email) formData.append('email', data.email);
      if (data.telefone) formData.append('telefone', data.telefone);
      if (data.bio) formData.append('bio', data.bio);
      
      // Adicionar nova imagem se existir
      if (imageFile && imageFile instanceof File) {
        formData.append('foto', imageFile);
      }
      
      const response = await fetch(`${API_BASE_URL}/api/admin/equipa/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log("✅ Membro atualizado:", result);
      
      const updatedMembro = result.membro || result.data || result;
      
      // Atualizar localStorage
      const equipa = loadFromLocalStorage();
      const index = equipa.findIndex(m => m.id === parseInt(id) || m.id === id);
      if (index !== -1) {
        equipa[index] = { ...equipa[index], ...updatedMembro };
        saveToLocalStorage(equipa);
      }
      
      return updatedMembro;
      
    } catch (error) {
      console.error("❌ Erro ao atualizar membro:", error);
      throw error;
    }
  },
  
  // DELETE - Deletar membro
  deleteMembro: async (id, token) => {
    try {
      const authToken = token || getAuthToken();
      
      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      console.log(`📡 DELETE /api/admin/equipa/${id}`);
      
      const response = await fetch(`${API_BASE_URL}/api/admin/equipa/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log("✅ Membro deletado:", result);
      
      // Remover do localStorage
      const equipa = loadFromLocalStorage();
      const filtered = equipa.filter(m => m.id !== parseInt(id) && m.id !== id);
      saveToLocalStorage(filtered);
      
      return result;
      
    } catch (error) {
      console.error("❌ Erro ao deletar membro:", error);
      throw error;
    }
  },
  
  checkServerStatus: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
};