// src/Admin/SettingsManager.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Shield, Mail, Globe, Lock, Eye, EyeOff, RefreshCw, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { usuariosAPI } from "../services/usuariosAPI";
import { auth } from "./auth";
import "./SettingsManager.css";

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    siteInfo: {
      name: "Fulano Advocacia",
      email: "fulanoadvocacia@gmail.com",
      phone: "+244 900 000 000",
      address: "Av. Deolinda Rodrigues, Luanda, Angola",
      whatsapp: "+244 900 000 000"
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: ""
    },
    admin: {
      password: "admin123"
    },
    emailConfig: {
      notifications: true,
      contactEmail: "fulanoadvocacia@gmail.com"
    },
    seo: {
      metaTitle: "Fulano Advocacia - Excelência Jurídica em Angola",
      metaDescription: "Advocacia de excelência em Angola. Especialistas em Direito Civil, Trabalho, Empresarial e Internacional. Consultoria jurídica de primeira classe.",
      metaKeywords: "advocacia, advogados Angola, direito civil, direito trabalho, consultoria jurídica"
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [activeTab, setActiveTab] = useState("geral");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const token = auth.getToken();
  const currentUser = auth.getCurrentUser();

  useEffect(() => {
    const saved = localStorage.getItem("admin_settings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar configurações:", e);
      }
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem("admin_settings", JSON.stringify(settings));
    setSaveStatus("✅ Configurações guardadas com sucesso!");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const updateSiteInfo = (field, value) => {
    setSettings({
      ...settings,
      siteInfo: { ...settings.siteInfo, [field]: value }
    });
  };

  const updateSocialMedia = (field, value) => {
    setSettings({
      ...settings,
      socialMedia: { ...settings.socialMedia, [field]: value }
    });
  };

  const updateSEO = (field, value) => {
    setSettings({
      ...settings,
      seo: { ...settings.seo, [field]: value }
    });
  };

  const updateEmailConfig = (field, value) => {
    setSettings({
      ...settings,
      emailConfig: { ...settings.emailConfig, [field]: value }
    });
  };

  // src/Admin/SettingsManager.jsx - Função changePassword corrigida

  const changePassword = async () => {
    // Limpar mensagens anteriores
    setPasswordError("");
    setPasswordSuccess("");

    // Validações
    if (!currentPassword) {
      setPasswordError("Por favor, insira a senha atual.");
      return;
    }

    if (!newPassword) {
      setPasswordError("Por favor, insira a nova senha.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem!");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    setUpdatingPassword(true);

    try {
      // 1. Verificar senha atual no localStorage primeiro
      const currentUserData = auth.getCurrentUser();
      const adminSettings = JSON.parse(localStorage.getItem("admin_settings") || "{}");
      const currentStoredPassword = adminSettings.admin?.password;

      // Se houver senha armazenada, verificar se a senha atual está correta
      if (currentStoredPassword && currentPassword !== currentStoredPassword) {
        setPasswordError("Senha atual incorreta!");
        setUpdatingPassword(false);
        return;
      }

      // 2. Tentar atualizar no servidor (se online)
      let serverUpdated = false;
      let errorMessage = "";
      const token = auth.getToken();

      try {
        if (token && auth.isAuthenticated()) {
          const usuarios = await usuariosAPI.getAllUsuarios(token);
          const currentUserApi = usuarios.find(u => u.email === currentUserData?.email);

          if (currentUserApi) {
            await usuariosAPI.updateUsuario(currentUserApi.id, {
              nome: currentUserApi.nome,
              email: currentUserApi.email,
              senha: newPassword,
              cargo: currentUserApi.cargo
            }, token);
            serverUpdated = true;
            console.log("✅ Senha atualizada no servidor");
          } else {
            errorMessage = "Usuário não encontrado no servidor.";
          }
        } else {
          errorMessage = "Sessão não autenticada. Salvando apenas localmente.";
        }
      } catch (apiError) {
        console.error("Erro ao atualizar senha no servidor:", apiError);
        errorMessage = apiError.message || "Servidor offline. Senha salva apenas localmente.";
      }

      // 3. Atualizar no localStorage do admin_settings
      const updatedSettings = {
        ...settings,
        admin: { ...settings.admin, password: newPassword }
      };
      setSettings(updatedSettings);
      localStorage.setItem("admin_settings", JSON.stringify(updatedSettings));

      // 4. IMPORTANTE: Atualizar também a senha no admin_user
      const storedUser = localStorage.getItem("admin_user");
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        userObj.senha = newPassword;
        localStorage.setItem("admin_user", JSON.stringify(userObj));
        console.log("✅ Senha atualizada no admin_user");
      }

      // 5. Atualizar também no auth service
      const currentUser = auth.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, senha: newPassword };
        localStorage.setItem("admin_user", JSON.stringify(updatedUser));
      }

      // 6. Limpar campos
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // 7. Mensagem de sucesso
      if (serverUpdated) {
        setPasswordSuccess("✅ Senha alterada com sucesso no servidor e localmente!");
      } else {
        setPasswordSuccess(`⚠️ ${errorMessage || "Senha alterada apenas localmente. O servidor está offline."}`);
      }

      // 8. Opcional: Forçar re-login após 3 segundos
      setTimeout(() => {
        if (window.confirm("Senha alterada com sucesso! Deseja fazer login novamente com a nova senha?")) {
          auth.logout();
        }
      }, 3000);

      setTimeout(() => {
        setPasswordSuccess("");
      }, 5000);

    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setPasswordError("Erro ao alterar senha. Tente novamente.");
      setTimeout(() => setPasswordError(""), 5000);
    } finally {
      setUpdatingPassword(false);
    }
  };

  const resetToDefault = () => {
    if (window.confirm("Tem certeza que deseja redefinir todas as configurações para o padrão?")) {
      const defaultSettings = {
        siteInfo: {
          name: "Fulano Advocacia",
          email: "fulanoadvocacia@gmail.com",
          phone: "+244 900 000 000",
          address: "Av. Deolinda Rodrigues, Luanda, Angola",
          whatsapp: "+244 900 000 000"
        },
        socialMedia: {
          facebook: "",
          instagram: "",
          linkedin: "",
          twitter: ""
        },
        admin: {
          password: "admin123"
        },
        emailConfig: {
          notifications: true,
          contactEmail: "fulanoadvocacia@gmail.com"
        },
        seo: {
          metaTitle: "Fulano Advocacia - Excelência Jurídica em Angola",
          metaDescription: "Advocacia de excelência em Angola. Especialistas em Direito Civil, Trabalho, Empresarial e Internacional.",
          metaKeywords: "advocacia, advogados Angola, direito civil, direito trabalho"
        }
      };
      setSettings(defaultSettings);
      localStorage.setItem("admin_settings", JSON.stringify(defaultSettings));
      setSaveStatus("🔄 Configurações redefinidas para o padrão!");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const tabs = [
    { id: "geral", label: "Geral", icon: Globe },
    { id: "social", label: "Redes Sociais", icon: Share2 },
    { id: "seguranca", label: "Segurança", icon: Lock },
    { id: "email", label: "Email", icon: Mail },
    { id: "seo", label: "SEO", icon: Globe }
  ];

  return (
    <div className="settings-manager">
      <div className="editor-header">
        <h1>Configurações</h1>
        <p>Gerencie as configurações gerais do site</p>
      </div>

      {saveStatus && (
        <div className="save-notification">
          {saveStatus.includes("✅") ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {saveStatus}
        </div>
      )}

      <div className="settings-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="settings-content">
        {/* Geral */}
        {activeTab === "geral" && (
          <motion.section
            className="settings-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="section-header">
              <h2>Informações do Site</h2>
            </div>

            <div className="settings-form">
              <div className="form-group">
                <label>Nome do Site</label>
                <input
                  type="text"
                  value={settings.siteInfo.name}
                  onChange={(e) => updateSiteInfo("name", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email de Contacto</label>
                <input
                  type="email"
                  value={settings.siteInfo.email}
                  onChange={(e) => updateSiteInfo("email", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Telefone</label>
                <input
                  type="text"
                  value={settings.siteInfo.phone}
                  onChange={(e) => updateSiteInfo("phone", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>WhatsApp</label>
                <input
                  type="text"
                  value={settings.siteInfo.whatsapp}
                  onChange={(e) => updateSiteInfo("whatsapp", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Morada</label>
                <textarea
                  value={settings.siteInfo.address}
                  onChange={(e) => updateSiteInfo("address", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </motion.section>
        )}

        {/* Redes Sociais */}
        {activeTab === "social" && (
          <motion.section
            className="settings-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="section-header">
              <h2>Redes Sociais</h2>
              <p>Links para as redes sociais do escritório</p>
            </div>

            <div className="settings-form">
              <div className="form-group">
                <label>Facebook</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/seu-perfil"
                  value={settings.socialMedia.facebook}
                  onChange={(e) => updateSocialMedia("facebook", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/seu-perfil"
                  value={settings.socialMedia.instagram}
                  onChange={(e) => updateSocialMedia("instagram", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/company/seu-perfil"
                  value={settings.socialMedia.linkedin}
                  onChange={(e) => updateSocialMedia("linkedin", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Twitter</label>
                <input
                  type="url"
                  placeholder="https://twitter.com/seu-perfil"
                  value={settings.socialMedia.twitter}
                  onChange={(e) => updateSocialMedia("twitter", e.target.value)}
                />
              </div>
            </div>
          </motion.section>
        )}

        {/* Segurança */}
        {activeTab === "seguranca" && (
          <motion.section
            className="settings-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="section-header">
              <h2>Segurança</h2>
              <p>Altere a senha de acesso ao painel administrativo</p>
            </div>

            {passwordError && (
              <div className="password-error">
                <AlertCircle size={18} />
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="password-success">
                <CheckCircle size={18} />
                {passwordSuccess}
              </div>
            )}

            <div className="security-box">
              <div className="current-password">
                <label>Senha Atual *</label>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Digite sua senha atual"
                  />
                </div>
              </div>

              <div className="new-password">
                <label>Nova Senha *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="confirm-password">
                <label>Confirmar Nova Senha *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme a nova senha"
                />
              </div>

              <button
                className="change-password-btn"
                onClick={changePassword}
                disabled={updatingPassword}
              >
                {updatingPassword ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    A processar...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Alterar Senha
                  </>
                )}
              </button>
            </div>

            <div className="info-box">
              <Shield size={20} />
              <div>
                <strong>Dica de Segurança</strong>
                <p>Use uma senha forte com letras maiúsculas, minúsculas, números e símbolos.</p>
              </div>
            </div>

            <div className="info-box warning">
              <AlertCircle size={20} />
              <div>
                <strong>Informação</strong>
                <p>Ao alterar a senha, ela será atualizada tanto localmente quanto no servidor (se online).</p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Email Config */}
        {activeTab === "email" && (
          <motion.section
            className="settings-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="section-header">
              <h2>Configurações de Email</h2>
            </div>

            <div className="settings-form">
              <div className="form-group">
                <label>Email para Notificações</label>
                <input
                  type="email"
                  value={settings.emailConfig.contactEmail}
                  onChange={(e) => updateEmailConfig("contactEmail", e.target.value)}
                />
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.emailConfig.notifications}
                    onChange={(e) => updateEmailConfig("notifications", e.target.checked)}
                  />
                  Receber notificações de novas candidaturas
                </label>
              </div>
            </div>

            <div className="info-box">
              <Mail size={20} />
              <div>
                <strong>Sobre Notificações</strong>
                <p>As notificações de novas candidaturas serão enviadas para o email configurado acima.</p>
              </div>
            </div>
          </motion.section>
        )}

        {/* SEO */}
        {activeTab === "seo" && (
          <motion.section
            className="settings-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="section-header">
              <h2>SEO (Otimização para Motores de Busca)</h2>
              <p>Configure como o site aparece nos resultados de pesquisa</p>
            </div>

            <div className="settings-form">
              <div className="form-group">
                <label>Título da Página (Meta Title)</label>
                <input
                  type="text"
                  value={settings.seo.metaTitle}
                  onChange={(e) => updateSEO("metaTitle", e.target.value)}
                />
                <small>Recomendado: 50-60 caracteres</small>
              </div>

              <div className="form-group">
                <label>Descrição (Meta Description)</label>
                <textarea
                  value={settings.seo.metaDescription}
                  onChange={(e) => updateSEO("metaDescription", e.target.value)}
                  rows={3}
                />
                <small>Recomendado: 150-160 caracteres</small>
              </div>

              <div className="form-group">
                <label>Palavras-chave (Meta Keywords)</label>
                <input
                  type="text"
                  value={settings.seo.metaKeywords}
                  onChange={(e) => updateSEO("metaKeywords", e.target.value)}
                  placeholder="separadas por vírgulas"
                />
                <small>Separe as palavras-chave por vírgulas</small>
              </div>
            </div>

            <div className="preview-box">
              <h4>Pré-visualização nos Resultados de Busca</h4>
              <div className="search-preview">
                <div className="preview-url">fulanoadvocacia.com</div>
                <div className="preview-title">{settings.seo.metaTitle}</div>
                <div className="preview-desc">{settings.seo.metaDescription.substring(0, 160)}</div>
              </div>
            </div>
          </motion.section>
        )}
      </div>

      <div className="settings-footer">
        <button className="reset-btn" onClick={resetToDefault}>
          <RefreshCw size={16} />
          Redefinir para Padrão
        </button>
        <button className="save-all-btn" onClick={saveSettings}>
          <Save size={16} />
          Guardar Todas as Configurações
        </button>
      </div>
    </div>
  );
}

// Ícone Share2 para as redes sociais
function Share2(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}