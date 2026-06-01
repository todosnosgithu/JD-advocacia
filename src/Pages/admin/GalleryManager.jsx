// src/Admin/GalleryManager.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Trash2,
  X,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  RefreshCw,
  CheckCircle
} from "lucide-react";
import { galeriaAPI } from "../services/galeriaAPI";
import "./GalleryManager.css";

export default function GalleryManager() {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("adminToken") || localStorage.getItem("admin_token");

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await galeriaAPI.getAllImagens();
      console.log("Fotos carregadas:", data);
      setPhotos(Array.isArray(data) ? data : []);
      localStorage.setItem("galeria_fotos", JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao carregar fotos:", error);
      const storedPhotos = JSON.parse(localStorage.getItem("galeria_fotos") || "[]");
      setPhotos(storedPhotos);
      setError("Erro ao conectar com servidor. Mostrando dados locais.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);
    setSuccess(null);

    const newPhotos = [];
    let processed = 0;

    for (const file of files) {
      try {
        const result = await galeriaAPI.uploadImagem(file, token);
        newPhotos.push({
          id: result.id || result.imagem?.id || Date.now() + Math.random(),
          url: result.url || result.imagem?.url || URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          date: new Date().toISOString(),
        });
        processed++;
        setUploadProgress((processed / files.length) * 100);
      } catch (error) {
        console.error("Erro no upload do arquivo:", error);
        // Fallback: salvar localmente
        const reader = new FileReader();
        const uploadResult = await new Promise((resolve) => {
          reader.onloadend = () => {
            resolve({
              id: Date.now() + Math.random(),
              url: reader.result,
              name: file.name,
              size: file.size,
              date: new Date().toISOString(),
            });
          };
          reader.readAsDataURL(file);
        });
        newPhotos.push(uploadResult);
        processed++;
        setUploadProgress((processed / files.length) * 100);
      }
    }

    const allPhotos = [...photos, ...newPhotos];
    setPhotos(allPhotos);
    localStorage.setItem("galeria_fotos", JSON.stringify(allPhotos));
    
    setSuccess(`${newPhotos.length} imagem(ns) carregada(s) com sucesso!`);
    setTimeout(() => setSuccess(null), 3000);
    setUploading(false);
    setUploadProgress(0);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const deletePhoto = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar esta imagem?")) return;
    
    try {
      await galeriaAPI.deleteImagem(id, token);
      const newPhotos = photos.filter((p) => p.id !== id);
      setPhotos(newPhotos);
      localStorage.setItem("galeria_fotos", JSON.stringify(newPhotos));
      setSelectedPhoto(null);
      setSuccess("Imagem eliminada com sucesso!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Erro ao deletar imagem:", error);
      const newPhotos = photos.filter((p) => p.id !== id);
      setPhotos(newPhotos);
      localStorage.setItem("galeria_fotos", JSON.stringify(newPhotos));
      setSelectedPhoto(null);
      setSuccess("Imagem eliminada localmente!");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setSuccess("URL copiada para a área de transferência!");
    setTimeout(() => setSuccess(null), 2000);
  };

  if (loading) {
    return (
      <div className="gallery-loading">
        <Loader2 size={40} className="spin" />
        <p>Carregando galeria...</p>
      </div>
    );
  }

  return (
    <div className="gallery-manager">
      <div className="manager-header">
        <div>
          <h1>Galeria de Fotos</h1>
          <p>Gerencie as imagens exibidas na página de Portfólio</p>
        </div>
        <button className="refresh-btn" onClick={loadPhotos}>
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {success && (
        <div className="success-message">
          <CheckCircle size={20} />
          <span>{success}</span>
          <button onClick={() => setSuccess(null)}>×</button>
        </div>
      )}

      <div className="gallery-actions">
        <button
          className="upload-btn"
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 size={18} className="spin" /> : <Upload size={18} />}
          {uploading ? "A carregar..." : "Adicionar Fotos"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </div>

      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <p>{Math.round(uploadProgress)}% - A carregar imagens...</p>
        </div>
      )}

      <div className="gallery-grid">
        <AnimatePresence>
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <img src={photo.url} alt={photo.name || `Foto ${index + 1}`} />
              <div className="gallery-overlay">
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePhoto(photo.id);
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {photos.length === 0 && !uploading && (
          <div className="empty-gallery">
            <ImageIcon size={48} />
            <p>Nenhuma foto na galeria</p>
            <button onClick={() => fileInputRef.current.click()}>
              Adicionar primeira foto
            </button>
          </div>
        )}
      </div>

      {/* Modal de visualização */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="photo-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedPhoto(null)}>
                <X size={24} />
              </button>
              <img src={selectedPhoto.url} alt={selectedPhoto.name || "Imagem"} />
              <div className="modal-info">
                <p>{selectedPhoto.name || "Imagem"}</p>
                <div className="modal-actions">
                  <button onClick={() => copyToClipboard(selectedPhoto.url)}>
                    Copiar URL
                  </button>
                  <button
                    className="delete-modal"
                    onClick={() => deletePhoto(selectedPhoto.id)}
                  >
                    Eliminar
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