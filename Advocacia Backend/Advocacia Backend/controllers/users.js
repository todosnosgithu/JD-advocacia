const {UsuarioModel} = require('../models/Users');

class UsuarioController {
    async create(req, res) {
        try {
            const { nome, email, senha, cargo } = req.body;
            
            console.log('Body recebido:', req.body);

            if (!senha || senha.length < 6) {
                return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
            }
            
            const usuario = await UsuarioModel.create({ nome, email, senha, cargo });
            res.status(201).json({ success: true, data: usuario });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            console.log(`Vindo do body ${req.body}`);
            
            const resultado = await UsuarioModel.login(email, senha);
            
            if (!resultado) {
                return res.status(401).json({ error: 'Email ou senha inválidos' });
            }
            
            res.json({ 
                success: true, 
                token: resultado.token,
                usuario: resultado.usuario
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const usuarios = await UsuarioModel.findAll();
            if (usuarios.error) {
                res.status(401).json({success:false , errorMessage:usuarios.errorMessage})
            }
            res.json({ success: true, data: usuarios });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async findById(req, res) {
        try {
            const usuario = await UsuarioModel.findById(req.params.id);
            if (usuario.error) {
                return res.status(404).json({ success:false , errorMessage:usuario.errorMessage});
            }
            res.json({ success: true, data: usuario });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const usuario = await UsuarioModel.update(req.params.id, req.body);
            res.json({ success: true, data: usuario });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updatePassword(req, res) {
        try {
            const { senhaAntiga, senhaNova } = req.body;
            const resultado = await UsuarioModel.updatePassword(req.params.id, senhaAntiga, senhaNova);
            
            if (!resultado) {
                return res.status(401).json({ error: 'Senha antiga incorreta' });
            }
            
            res.json({ success: true, message: 'Senha atualizada com sucesso' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const usuario = await UsuarioModel.delete(req.params.id);
            res.json({ success: true, message: 'Usuário desativado' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new UsuarioController();