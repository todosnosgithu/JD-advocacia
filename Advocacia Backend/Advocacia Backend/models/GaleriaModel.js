const pool = require("../Connections/Database");

const listarGaleria = async () => {
  const result = await pool.query(
    "SELECT * FROM galeria ORDER BY criado_em DESC"
  );
  return result.rows;
};

const buscarPorId = async (id) => {
  const result = await pool.query("SELECT * FROM galeria WHERE id = $1", [id]);
  return result.rows[0];
};

const adicionarImagem = async (nome, caminho) => {
  const result = await pool.query(
    "INSERT INTO galeria (nome, caminho) VALUES ($1, $2) RETURNING *",
    [nome, caminho]
  );
  return result.rows[0];
};

const deletarImagem = async (id) => {
  const result = await pool.query("DELETE FROM galeria WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};

module.exports = { listarGaleria, adicionarImagem , buscarPorId , deletarImagem};
