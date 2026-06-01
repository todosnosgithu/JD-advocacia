// src/Pages/admin/auth.js

// Chaves do localStorage
const TOKEN_KEY = "admin_token";
const USER_KEY = "admin_user";
const LOGGED_IN_KEY = "admin_logged_in";
const LOGIN_TIME_KEY = "admin_login_time";

// Usuário admin padrão para fallback (quando servidor está offline)
const DEFAULT_ADMIN = {
  id: 1,
  nome: "Administrador",
  email: "admin@advoca.com",
  cargo: "admin"
};

export const auth = {
  // Verificar se está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const loggedIn = localStorage.getItem(LOGGED_IN_KEY);

    if (!token || token.trim() === "") {
      return false;
    }

    if (loggedIn !== "true") {
      return false;
    }

    // Verificar se o token não expirou (24 horas)
    const loginTime = localStorage.getItem(LOGIN_TIME_KEY);
    if (loginTime) {
      const timeSinceLogin = Date.now() - parseInt(loginTime);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (timeSinceLogin > twentyFourHours) {
        auth.logout();
        return false;
      }
    }

    return true;
  },

  // Fazer logout
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LOGGED_IN_KEY);
    localStorage.removeItem(LOGIN_TIME_KEY);
    window.location.href = "/admin/login";
  },

  // Obter token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Obter usuário atual
  getCurrentUser: () => {
    // src/Pages/admin/auth.js - Adicione esta função auxiliar

    // Verificar credenciais (para login offline)
    verifyCredentials: (email, password) => {
      const adminSettings = JSON.parse(localStorage.getItem("admin_settings") || "{}");
      const storedPassword = adminSettings.admin?.password || "admin123";
      const storedEmail = "admin@advoca.com";

      // Verificar se o email está correto e a senha corresponde
      if (email === storedEmail && password === storedPassword) {
        // Criar token mockado
        const token = "mock_token_" + Date.now();
        const user = {
          id: 1,
          nome: "Administrador",
          email: storedEmail,
          cargo: "admin"
        };
        auth.setLoginData(token, user);
        return { success: true, token, user };
      }

      return { success: false, message: "Credenciais inválidas" };
    }
  },

  // Salvar dados de login
  setLoginData: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user || DEFAULT_ADMIN));
    localStorage.setItem(LOGGED_IN_KEY, "true");
    localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());
  },

  // Login mockado (para quando servidor está offline)
  mockLogin: (email, senha) => {
    // Credenciais padrão
    if (email === "admin@advoca.com" && senha === "admin123") {
      const token = "mock_token_" + Date.now();
      const user = DEFAULT_ADMIN;
      auth.setLoginData(token, user);
      return { success: true, token, user };
    }
    return { success: false, message: "Credenciais inválidas" };
  }
};