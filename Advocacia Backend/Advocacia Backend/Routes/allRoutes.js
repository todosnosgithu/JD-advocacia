const express = require("express");
const Route = express.Router();
const ServicosController = require("../controllers/ServicosController");
const usersRT = require('./Users.js');
const advogadosRT = require('./advogados.js');
const equipaRouter = require("./equipaRouter.js");
const servicosRouter = require("./servicosRouter.js");
const contactarRoute = require('./EntrarEm_Contacto.js');
const candidaturasRouter = require("./candidaturasRouter.js");

// Rotas Publicas
Route.use("/api/candidatar", candidaturasRouter);
Route.use('/api/contactar', contactarRoute);
Route.use('/api/servicos/listar' , ServicosController.listarServicos);

// Rotas do admin
Route.use("/api/admin/candidaturas", candidaturasRouter);
Route.use("/api/admin/servicos", servicosRouter);
Route.use('/api/admin/advogados', advogadosRT);
Route.use("/api/admin/equipa", equipaRouter);
Route.use('/api/admin/usuarios', usersRT);
Route.use('/api/admin/contactar' , contactarRoute)

module.exports = Route;