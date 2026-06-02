const GaleriaModel = require("../models/GaleriaModel");
const fs = require("fs");


const listarGaleria = async (req, res) => {
  try {
    const imagens = await GaleriaModel.listarGaleria();
    
    const imagensComUrl = imagens.map((img) => ({
      ...img,
      url: `${req.protocol}://${req.get("host")}/${img.caminho.replace(/\\/g, "/")}`,
    }));

    res.status(200).json(imagensComUrl);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar galeria.", detalhe: err.message });
  }
};

const adicionarImagem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ erro: "Nenhuma imagem enviada." });
    }

    const nome = req.body.nome || req.file.originalname;
    const caminho = req.file.path;

    const nova = await GaleriaModel.adicionarImagem(nome, caminho);
    res.status(201).json({ mensagem: "Imagem adicionada com sucesso.", dados: nova });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao adicionar imagem.", detalhe: err.message });
  }
};

const deletarImagem = async (req, res) => {
  try {
    const { id } = req.params;

    const imagem = await GaleriaModel.buscarPorId(id);
    if (!imagem) return res.status(404).json({ erro: "Imagem não encontrada." });

    if (fs.existsSync(imagem.caminho)) {
      fs.unlinkSync(imagem.caminho);
    }

    await GaleriaModel.deletarImagem(id);

    res.status(200).json({ mensagem: "Imagem eliminada com sucesso." });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao deletar imagem.", detalhe: err.message });
  }
};

module.exports = { listarGaleria, adicionarImagem , deletarImagem};
