const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/users.js');
//const UsuarioModel = require('../models/Users.js');
const {verifyToken} = require('../models/Users.js')


router.post('/', UsuarioController.create);
router.post('/login', UsuarioController.login);


router.get('/', verifyToken, UsuarioController.findAll);
router.get('/:id', verifyToken, UsuarioController.findById);
router.put('/:id', verifyToken, UsuarioController.update);
router.put('/:id/password', verifyToken, UsuarioController.updatePassword);
router.delete('/:id', verifyToken, UsuarioController.delete);

module.exports = router;