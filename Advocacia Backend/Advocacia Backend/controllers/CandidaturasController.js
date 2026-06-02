const CandidaturasModel = require("../Models/CandidaturasModel");

// GET /admin/candidaturas
const listarCandidaturas = async (req, res) => {
  try {
    const candidaturas = await CandidaturasModel.listarCandidaturas();
    res.status(200).json(candidaturas);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar candidaturas.", detalhe: err.message });
  }
};

 // /admin/candidaturas/:id
const atualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ erro: "O campo estado é obrigatório." });
    }

    const atualizado = await CandidaturasModel.atualizarEstado(id, estado);

    if (!atualizado) {
      return res.status(404).json({ erro: "Candidatura não encontrada." });
    }

    res.status(200).json({ mensagem: "Estado atualizado.", dados: atualizado });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};

// DELETE /admin/candidaturas/:id
const eliminarCandidatura = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await CandidaturasModel.eliminarCandidatura(id);

    if (!eliminado) {
      return res.status(404).json({ erro: "Candidatura não encontrada." });
    }

    res.status(200).json({ mensagem: "Candidatura eliminada com sucesso." });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao eliminar candidatura.", detalhe: err.message });
  }
};

// POST /candidatar  (formulário público do site)
const submeterCandidatura = async (req, res) => {
  try {
    const { nome, email, assunto, nivel, area, detalhes } = req.body;

    if (!nome || !email || !area) {
      return res.status(400).json({ erro: "Nome, email e área são obrigatórios." });
    }

    const nova = await CandidaturasModel.submeterCandidatura(
      nome, email, assunto, nivel, area, detalhes
    );
    res.status(201).json({ mensagem: "Candidatura submetida com sucesso.", dados: nova });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao submeter candidatura.", detalhe: err.message });
  }
};

module.exports = {
  listarCandidaturas,
  atualizarEstado,
  eliminarCandidatura,
  submeterCandidatura,
};
