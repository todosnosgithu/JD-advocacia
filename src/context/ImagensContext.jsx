// src/context/ImagensContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { listaImagens as imagensPadrao, getAliasMap } from "../Pages/data/ImagensData";

const ImagensContext = createContext();

export function ImagensProvider({ children }) {
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const aliasMap = getAliasMap();

  useEffect(() => {
    loadImagens();
  }, []);

  const loadImagens = () => {
    try {
      const saved = localStorage.getItem("site_imagens");
      if (saved && saved !== "undefined") {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setImagens(parsed);
          console.log("✅ Imagens carregadas:", parsed.length);
          setLoading(false);
          return;
        }
      }
      console.log("⚠️ Usando imagens padrão");
      setImagens(imagensPadrao);
      localStorage.setItem("site_imagens", JSON.stringify(imagensPadrao));
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);
      setImagens(imagensPadrao);
    } finally {
      setLoading(false);
    }
  };

  const getImagemUrl = (id) => {
    if (!imagens || imagens.length === 0) {
      console.warn("⚠️ Array de imagens vazio");
      return "";
    }
    const realId = aliasMap[id] || id;
    const imagem = imagens.find(img => img && img.id === realId);
    if (!imagem) {
      console.warn(`⚠️ Imagem não encontrada: ${id} -> ${realId}`);
      const padrao = imagensPadrao.find(img => img.id === realId);
      return padrao?.url || "";
    }
    return imagem.url;
  };

  const updateImagem = (id, novaUrl) => {
    const updated = imagens.map(img => 
      img.id === id ? { ...img, url: novaUrl, updatedAt: new Date().toISOString() } : img
    );
    setImagens(updated);
    localStorage.setItem("site_imagens", JSON.stringify(updated));
    return updated.find(img => img.id === id);
  };

  const uploadImagem = (file, id) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const novaUrl = reader.result;
        const imagemAtualizada = updateImagem(id, novaUrl);
        resolve(imagemAtualizada);
      };
      reader.readAsDataURL(file);
    });
  };

  const getImagem = (id) => {
    const realId = aliasMap[id] || id;
    return imagens.find(img => img.id === realId) || null;
  };

  const refreshImagens = () => {
    loadImagens();
  };

  return (
    <ImagensContext.Provider value={{
      imagens,
      loading,
      selectedImage,
      setSelectedImage,
      showUploadModal,
      setShowUploadModal,
      updateImagem,
      uploadImagem,
      getImagem,
      getImagemUrl,
      refreshImagens,
      loadImagens,
    }}>
      {children}
    </ImagensContext.Provider>
  );
}

export function useImagens() {
  const context = useContext(ImagensContext);
  if (!context) {
    throw new Error("useImagens must be used within ImagensProvider");
  }
  return context;
}