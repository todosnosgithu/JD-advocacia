// src/services/equipaAPI.js
import { API_BASE_URL, getAuthToken } from "../config/api";
import { auth } from "../admin/auth";

// Chave para localStorage
const EQUIPA_STORAGE_KEY = "admin_equipa";

// Dados mockados iniciais
const mockEquipa = [
  {
    id: 1,
    nome: "Dr. António Silva",
    cargo: "Advogado Sénior",
    especialidade: "Direito Civil",
    email: "antonio.silva@advoca.com",
    telefone: "+244 923 456 789",
    bio: "Advogado com mais de 15 anos de experiência",
    foto: "/assets/team/antonio.jpg",
    ordem: 1,
    ativo: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    nome: "Dra. Maria Santos",
    cargo: "Advogada",
    especialidade: "Direito Familiar",
    email: "maria.santos@advoca.com",
    telefone: "+244 923 456 790",
    bio: "Especialista em direito da família",
    foto: "/assets/team/maria.jpg",
    ordem: 2,
    ativo: true,
    createdAt: new Date().toISOString()
  }
];

// Função para carregar dados do localStorage
const loadFromLocalStorage = () => {
  const stored = localStorage.getItem(EQUIPA_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Inicializar com dados mockados
  localStorage.setItem(EQUIPA_STORAGE_KEY, JSON.stringify(mockEquipa));
  return mockEquipa;
};

// Função para salvar no localStorage
const saveToLocalStorage = (data) => {
  localStorage.setItem(EQUIPA_STORAGE_KEY, JSON.stringify(data));
};

// Verificar se o servidor está online
const isServerOnline = async () => {
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
};

export const equipaAPI = {
  // Buscar todos os membros da equipa
  getAllMembros: async (token) => {
    try {
      const authToken = token || getAuthToken();
      
      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      // Tentar buscar da API
      const response = await fetch(`${API_BASE_URL}/api/admin/equipa`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      const equipa = result.equipa || result.data || result;
      
      // Se conseguiu dados da API, salva no localStorage como backup
      if (Array.isArray(equipa) && equipa.length > 0) {
        saveToLocalStorage(equipa);
        return equipa;
      }
      
      throw new Error("Dados inválidos da API");
      
    } catch (error) {
      console.error("Erro ao carregar equipa da API, usando localStorage:", error);
      // Fallback para localStorage
      return loadFromLocalStorage();
    }
  },
  
  // Buscar membro por ID
  getMembroById: async (id, token) => {
    try {
      const authToken = token || getAuthToken();
      
      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/equipa/${id}`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.error("Erro ao buscar membro da API, usando localStorage:", error);
      // Fallback para localStorage
      const equipa = loadFromLocalStorage();
      const membro = equipa.find(m => m.id === parseInt(id));
      if (!membro) {
        throw new Error("Membro não encontrado");
      }
      return membro;
    }
  },
  
  // Criar novo membro
  createMembro: async (data, token) => {
    try {
      const authToken = token || getAuthToken();
      
      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      // Validar dados
      if (!data.nome || !data.cargo) {
        throw new Error("Nome e cargo são obrigatórios");
      }

      // Tentar criar via API
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
      
      const result = await response.json();
      
      // Se conseguiu criar na API, atualiza localStorage
      const equipa = loadFromLocalStorage();
      const newMembro = result.membro || result.data || result;
      equipa.push(newMembro);
      saveToLocalStorage(equipa);
      
      return newMembro;
      
    } catch (error) {
      console.error("Erro ao criar membro na API, salvando localmente:", error);
      
      // Fallback: salvar apenas no localStorage
      const equipa = loadFromLocalStorage();
      const newMembro = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
        ativo: true
      };
      equipa.push(newMembro);
      saveToLocalStorage(equipa);
      
      return newMembro;
    }
  },
  
  // Atualizar membro
  updateMembro: async (id, data, token) => {
    try {
      const authToken = token || getAuthToken();
      
      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      // Tentar atualizar via API
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
      
      const result = await response.json();
      
      // Atualizar localStorage
      const equipa = loadFromLocalStorage();
      const index = equipa.findIndex(m => m.id === parseInt(id));
      if (index !== -1) {
        equipa[index] = { ...equipa[index], ...data };
        saveToLocalStorage(equipa);
      }
      
      return result;
      
    } catch (error) {
      console.error("Erro ao atualizar membro na API, atualizando localmente:", error);
      
      // Fallback: atualizar apenas no localStorage
      const equipa = loadFromLocalStorage();
      const index = equipa.findIndex(m => m.id === parseInt(id));
      if (index !== -1) {
        equipa[index] = { ...equipa[index], ...data };
        saveToLocalStorage(equipa);
        return { success: true, membro: equipa[index] };
      }
      
      throw new Error("Membro não encontrado");
    }
  },
  
  // Deletar membro
  deleteMembro: async (id, token) => {
    try {
      const authToken = token || getAuthToken();
      
      if (!authToken || !auth.isAuthenticated()) {
        auth.logout();
        throw new Error("Não autenticado");
      }

      // Tentar deletar via API
      const response = await fetch(`${API_BASE_URL}/api/admin/equipa/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      // Remover do localStorage
      const equipa = loadFromLocalStorage();
      const filtered = equipa.filter(m => m.id !== parseInt(id));
      saveToLocalStorage(filtered);
      
      return await response.json();
      
    } catch (error) {
      console.error("Erro ao deletar membro na API, deletando localmente:", error);
      
      // Fallback: deletar apenas do localStorage
      const equipa = loadFromLocalStorage();
      const filtered = equipa.filter(m => m.id !== parseInt(id));
      saveToLocalStorage(filtered);
      
      return { success: true };
    }
  },
  
  // Verificar status do servidor
  checkServerStatus: isServerOnline
};