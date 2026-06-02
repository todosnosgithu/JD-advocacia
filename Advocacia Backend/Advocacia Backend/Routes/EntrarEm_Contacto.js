const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/EntrarEm_Contacto');
const UsuarioModel = require('../models/Users');
const {verifyToken} = require('../models/Users');

router.post('/', ClienteController.create);
router.get('/', verifyToken, ClienteController.findAll);
router.get('/:id', verifyToken, ClienteController.findById);
router.delete('/:id', verifyToken, ClienteController.delete);

module.exports = router;