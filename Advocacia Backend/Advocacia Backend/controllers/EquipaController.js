const EquipaModel = require("../models/EquipaModel");

// GET /admin/equipa
const listarEquipa = async (req, res) => {
  try {
    const equipa = await EquipaModel.listarEquipa();
    res.status(200).json(equipa);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar equipa.", detalhe: err.message });
  }
};

// POST /admin/equipa
const criarAdvogado = async (req, res) => {
  try {
    const { nome, especialidade } = req.body;

    if (!nome || !especialidade) {
      return res.status(400).json({ erro: "Nome e especialidade são obrigatórios." });
    }

    // Multer guarda o caminho do ficheiro em req.file
    const foto = req.file ? req.file.path : null;

    const novo = await EquipaModel.criarAdvogado(nome, especialidade, foto);
    res.status(201).json({ mensagem: "Advogado adicionado com sucesso.", dados: novo });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar advogado.", detalhe: err.message });
  }
};

// PUT /admin/equipa/:id
const editarAdvogado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, especialidade } = req.body;
    const foto = req.file ? req.file.path : null;

    const atualizado = await EquipaModel.editarAdvogado(id, nome, especialidade, foto);

    if (!atualizado) {
      return res.status(404).json({ erro: "Advogado não encontrado." });
    }

    res.status(200).json({ mensagem: "Advogado atualizado.", dados: atualizado });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao editar advogado.", detalhe: err.message });
  }
};

// DELETE /admin/equipa/:id
const removerAdvogado = async (req, res) => {
  try {
    const { id } = req.params;
    const removido = await EquipaModel.removerAdvogado(id);

    if (!removido) {
      return res.status(404).json({ erro: "Advogado não encontrado." });
    }

    res.status(200).json({ mensagem: "Advogado removido com sucesso." });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover advogado.", detalhe: err.message });
  }
};

module.exports = {
  listarEquipa,
  criarAdvogado,
  editarAdvogado,
  removerAdvogado,
};
