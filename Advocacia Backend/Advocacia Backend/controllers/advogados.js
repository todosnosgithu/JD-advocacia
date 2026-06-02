const AdvogadoModel = require('../models/advogados');

class AdvogadoController {
    async create(req, res) {
        try {
            const advogado = await AdvogadoModel.create(req.body);
            res.status(201).json({ success: true, data: advogado });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async findAll(req, res) {
        try {
            const advogados = await AdvogadoModel.findAll();
            res.json({ success: true, data: advogados });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async findById(req, res) {
        try {
            const advogado = await AdvogadoModel.findById(req.params.id);
            if (!advogado) return res.status(404).json({ error: 'Advogado não encontrado' });
            res.json({ success: true, data: advogado });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const advogado = await AdvogadoModel.update(req.params.id, req.body);
            res.json({ success: true, data: advogado });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const advogado = await AdvogadoModel.delete(req.params.id);
            res.json({ success: true, message: 'Advogado desativado' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new AdvogadoController();