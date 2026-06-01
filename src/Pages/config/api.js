// src/config/api.js
// ============================================
// 🚀 CONFIGURAÇÃO DA API - MUDE AQUI PARA ALTERAR
// ============================================

export const API_BASE_URL = "http://192.168.1.101:3000/api";

// Para desenvolvimento local:
// export const API_BASE_URL = "http://localhost:3000/api";

// ============================================

export const API_CONFIG = {
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};

export const getAuthToken = () => {
  return localStorage.getItem("adminToken") || localStorage.getItem("admin_token");
};

export const handleAPIError = (error) => {
  if (error.response) {
    return error.response.data?.message || `Erro ${error.response.status}`;
  } else if (error.request) {
    return "Erro de conexão com o servidor";
  } else {
    return error.message || "Erro desconhecido";
  }
};