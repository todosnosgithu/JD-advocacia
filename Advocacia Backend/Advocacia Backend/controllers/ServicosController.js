const ServicosModel = require("../models/ServicosModel");

// GET /admin/servicos
const listarServicos = async (req, res) => {
  try {
    const servicos = await ServicosModel.listarServicos();
    res.status(200).json(servicos);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar serviços.", detalhe: err.message });
  }
};

// POST /admin/servicos
const criarServico = async (req, res) => {
  try {
    const { titulo, descricao } = req.body;

    if (!titulo || !descricao) {
      return res.status(400).json({ erro: "Título e descrição são obrigatórios." });
    }

    const novo = await ServicosModel.criarServico(titulo, descricao);
    res.status(201).json({ mensagem: "Serviço criado com sucesso.", dados: novo });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar serviço.", detalhe: err.message });
  }
};

// PUT /admin/servicos/:id
const editarServico = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao } = req.body;

    const atualizado = await ServicosModel.editarServico(id, titulo, descricao);

    if (!atualizado) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }

    res.status(200).json({ mensagem: "Serviço atualizado.", dados: atualizado });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao editar serviço.", detalhe: err.message });
  }
};

// DELETE /admin/servicos/:id
const removerServico = async (req, res) => {
  try {
    const { id } = req.params;
    const removido = await ServicosModel.removerServico(id);

    if (!removido) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }

    res.status(200).json({ mensagem: "Serviço removido com sucesso." });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover serviço.", detalhe: err.message });
  }
};

module.exports = {
  listarServicos,
  criarServico,
  editarServico,
  removerServico,
};
