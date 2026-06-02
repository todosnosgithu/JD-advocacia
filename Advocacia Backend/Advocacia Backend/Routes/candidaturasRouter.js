const express = require("express");
const router = express.Router();
const CandidaturasController = require("../controllers/CandidaturasController");

// Rota pública — formulário do site
router.post("/", CandidaturasController.submeterCandidatura);

// Rotas de administrador
router.get("/", CandidaturasController.listarCandidaturas);
router.put("/:id", CandidaturasController.atualizarEstado);
router.delete("/:id", CandidaturasController.eliminarCandidatura);

module.exports = router;
