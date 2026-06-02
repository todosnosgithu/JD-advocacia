const EquipaController = require("../controllers/EquipaController");
const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");

// Configuração do Multer para fotos dos advogados
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/equipa/");
  },
  filename: (req, file, cb) => {
    const nome = `${Date.now()}-${file.originalname}`;
    cb(null, nome);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // máx 5MB
  fileFilter: (req, file, cb) => {
    const tipos = /jpeg|jpg|png|webp/;
    const valido = tipos.test(path.extname(file.originalname).toLowerCase());
    valido ? cb(null, true) : cb(new Error("Apenas imagens são permitidas."));
  },
});

// Rotas de administrador
router.get("/", EquipaController.listarEquipa);
router.post("/", upload.single("foto"), EquipaController.criarAdvogado);
router.put("/:id", upload.single("foto"), EquipaController.editarAdvogado);
router.delete("/:id", EquipaController.removerAdvogado);

module.exports = router;
