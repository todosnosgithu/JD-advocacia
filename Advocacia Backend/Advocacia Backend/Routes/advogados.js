const express = require('express');
const router = express.Router();
const AdvogadoController = require('../controllers/advogados.js');
const UsuarioModel = require('../models/Users');
const {verifyToken} = require('../models/Users');

router.post('/', verifyToken, AdvogadoController.create);
router.get('/', verifyToken, AdvogadoController.findAll);
router.get('/:id', verifyToken, AdvogadoController.findById);
router.put('/:id', verifyToken, AdvogadoController.update);
router.delete('/:id', verifyToken, AdvogadoController.delete);

module.exports = router;