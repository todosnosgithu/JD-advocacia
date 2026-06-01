
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  Upload,
  RefreshCw,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Search,
  Eye,
  Trash2,
  Copy
} from "lucide-react";
import { useImagens } from "../../context/ImagensContext";
import "./ImagesManager.css";

export default function ImagesManager() {
  const { 
    imagens, 
    loading, 
    updateImagem, 
    uploadImagem,
    loadImagens,
    selectedImage,
    setSelectedImage,
    showUploadModal,
    setShowUploadModal
  } = useImagens();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPagina, setFilterPagina] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadError, setUploadError] = useState("");

  const paginas = ["all", "Página Inicial", "Serviços", "Contacto", "Recrutamento", "Sobre Nós", "Global"];

  const filteredImagens = imagens.filter(img => {
    const matchesSearch = img.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          img.pagina.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPagina = filterPagina === "all" || img.pagina === filterPagina;
    return matchesSearch && matchesPagina;
  });

  const handleImageUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      setUploadError("Por favor, selecione uma imagem válida.");
      setTimeout(() => setUploadError(""), 3000);
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("A imagem deve ter no máximo 2MB.");
      setTimeout(() => setUploadError(""), 3000);
      return;
    }

    setUploading(true);
    try {
      await uploadImagem(file, id);
      setUploadSuccess("Imagem atualizada com sucesso!");
      setTimeout(() => setUploadSuccess(""), 3000);
    } catch (error) {
      setUploadError("Erro ao fazer upload da imagem.");
      setTimeout(() => setUploadError(""), 3000);
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setUploadSuccess("URL copiada para a área de transferência!");
    setTimeout(() => setUploadSuccess(""), 2000);
  };

  const stats = {
    total: imagens.length,
    porPagina: paginas.filter(p => p !== "all").reduce((acc, pagina) => {
      acc[pagina] = imagens.filter(img => img.pagina === pagina).length;
      return acc;
    }, {})
  };

  if (loading) {
    return (
      <div className="images-loading">
        <Loader2 size={40} className="spin" />
        <p>Carregando imagens...</p>
      </div>
    );
  }

  return (
    <div className="images-manager">
      <div className="manager-header">
        <div>
          <h1>Gestão de Imagens</h1>
          <p>Gerencie todas as imagens do site em um só lugar</p>
        </div>
        <button className="refresh-btn" onClick={loadImagens}>
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {uploadSuccess && (
        <div className="success-banner">
          <CheckCircle size={18} />
          <span>{uploadSuccess}</span>
          <button onClick={() => setUploadSuccess("")}>×</button>
        </div>
      )}

      {uploadError && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{uploadError}</span>
          <button onClick={() => setUploadError("")}>×</button>
        </div>
      )}

      {/* Stats */}
      <div className="images-stats">
        <div className="stat-card">
          <div className="stat-icon">🖼️</div>
          <div className="stat-info">
            <h3>Total de Imagens</h3>
            <p>{stats.total}</p>
          </div>
        </div>
        {Object.entries(stats.porPagina).map(([pagina, count]) => (
          <div key={pagina} className="stat-card small">
            <div className="stat-info">
              <h3>{pagina}</h3>
              <p>{count} imagens</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="images-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Pesquisar imagens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          {paginas.map(pagina => (
            <button
              key={pagina}
              className={`filter-btn ${filterPagina === pagina ? "active" : ""}`}
              onClick={() => setFilterPagina(pagina)}
            >
              {pagina === "all" ? "Todas" : pagina}
            </button>
          ))}
        </div>
      </div>

      {/* Images Grid */}
      <div className="images-grid">
        {filteredImagens.length === 0 ? (
          <div className="no-data">
            <Image size={48} />
            <p>Nenhuma imagem encontrada</p>
          </div>
        ) : (
          filteredImagens.map((imagem) => (
            <motion.div
              key={imagem.id}
              className="image-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
            >
              <div className="image-preview">
                <img 
                  src={imagem.url} 
                  alt={imagem.nome}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/200?text=Sem+Imagem"; }}
                />
                <div className="image-overlay">
                  <button 
                    className="view-btn"
                    onClick={() => {
                      setSelectedImage(imagem);
                      setShowUploadModal(true);
                    }}
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
              <div className="image-info">
                <div>
                  <h4>{imagem.nome}</h4>
                  <p className="image-pagina">{imagem.pagina}</p>
                  <p className="image-categoria">{imagem.categoria}</p>
                </div>
                <div className="image-actions">
                  <label className="upload-label">
                    <Upload size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, imagem.id)}
                      style={{ display: "none" }}
                    />
                  </label>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(imagem.url)}
                    title="Copiar URL"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal de Preview/Upload */}
      <AnimatePresence>
        {showUploadModal && selectedImage && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              className="image-modal"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{selectedImage.nome}</h2>
                <button onClick={() => setShowUploadModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="image-container">
                  <img src={selectedImage.url} alt={selectedImage.nome} />
                </div>
                <div className="image-details">
                  <p><strong>Página:</strong> {selectedImage.pagina}</p>
                  <p><strong>Categoria:</strong> {selectedImage.categoria}</p>
                  <p><strong>ID:</strong> {selectedImage.id}</p>
                </div>
                <div className="upload-area">
                  <label className="upload-btn-large">
                    <Upload size={20} />
                    Alterar Imagem
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleImageUpload(e, selectedImage.id);
                        setShowUploadModal(false);
                      }}
                      style={{ display: "none" }}
                    />
                  </label>
                  <button 
                    className="copy-url-btn"
                    onClick={() => copyToClipboard(selectedImage.url)}
                  >
                    <Copy size={16} />
                    Copiar URL
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}