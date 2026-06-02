const ClienteModel = require('../models/EntrarEm_Contacto');

class EntrarEm_Contacto {
    async create(req, res) {
        try {
            const cliente = await ClienteModel.create(req.body);
            res.status(201).json({ success: true, data: cliente });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const clientes = await ClienteModel.findAll();
            res.json({ success: true, data: clientes });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async findById(req, res) {
        try {
            const cliente = await ClienteModel.findById(req.params.id);
            if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
            res.json({ success: true, data: cliente });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const cliente = await ClienteModel.delete(req.params.id);
            res.json({ success: true, message: 'Cliente desativado' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new EntrarEm_Contacto();