const pool = require("../Connections/Database");

// Listar todas as candidaturas
const listarCandidaturas = async () => {
  const result = await pool.query(
    "SELECT * FROM candidaturas ORDER BY criado_em DESC"
  );
  return result.rows;
};

// Atualizar estado
const atualizarEstado = async (id, estado) => {
  const estadosValidos = ["pendente", "em análise", "aprovado", "rejeitado"];
  if (!estadosValidos.includes(estado)) {
    throw new Error(`Estado inválido. Use: ${estadosValidos.join(", ")}`);
  }

  const result = await pool.query(
    "UPDATE candidaturas SET estado = $1 WHERE id = $2 RETURNING *",
    [estado, id]
  );
  return result.rows[0];
};

// Eliminar candidatura
const eliminarCandidatura = async (id) => {
  const result = await pool.query(
    "DELETE FROM candidaturas WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

// Submeter candidatura (chamado pelo formulário público)
const submeterCandidatura = async (nome, email, assunto, nivel, area, detalhes) => {
  const result = await pool.query(
    `INSERT INTO candidaturas (nome, email, assunto, nivel, area, detalhes)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [nome, email, assunto, nivel, area, detalhes]
  );
  return result.rows[0];
};

module.exports = {
  listarCandidaturas,
  atualizarEstado,
  eliminarCandidatura,
  submeterCandidatura,
};
