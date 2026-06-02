const express = require("express");
const router = express.Router();
const ServicosController = require("../controllers/ServicosController");

// Rotas de administrador
//router.get("/", ServicosController.listarServicos);
router.post("/", ServicosController.criarServico);
router.put("/:id", ServicosController.editarServico);
router.delete("/:id", ServicosController.removerServico);

module.exports = router;
