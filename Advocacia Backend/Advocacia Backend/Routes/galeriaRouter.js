const express = require("express");
const publicRoute = express.Router();
const multer = require("multer");
const path = require("path");
const GaleriaController = require("../controllers/GaleriaController");
const {verifyToken} = require('../models/Users.js')
const adminRoute = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/galeria");
  },
  filename: (req, file, cb) => {
    const nomeSeguro = file.originalname.replace(/ /g, "_");
    cb(null, `${Date.now()}-${nomeSeguro}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const tipos = /jpeg|jpg|png|webp/;
    const valido = tipos.test(path.extname(file.originalname).toLowerCase());
    valido ? cb(null, true) : cb(new Error("Apenas imagens são permitidas."));
  },
});

publicRoute.get("/", GaleriaController.listarGaleria);

adminRoute.post("/", verifyToken , upload.single("imagem"), GaleriaController.adicionarImagem);
adminRoute.delete("/:id", verifyToken ,  GaleriaController.deletarImagem);

module.exports = {publicRoute , adminRoute};
