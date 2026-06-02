const pool = require("../Connections/Database");

// Listar todos
const listarEquipa = async () => {
  const result = await pool.query(
    "SELECT * FROM equipa ORDER BY criado_em DESC"
  );
  return result.rows;
};

// Criar advogado
const criarAdvogado = async (nome, especialidade, foto) => {
  const result = await pool.query(
    "INSERT INTO equipa (nome, especialidade, foto) VALUES ($1, $2, $3) RETURNING *",
    [nome, especialidade, foto]
  );
  return result.rows[0];
};

// Editar advogado
const editarAdvogado = async (id, nome, especialidade, foto) => {
  const result = await pool.query(
    `UPDATE equipa
     SET nome = COALESCE($1, nome),
         especialidade = COALESCE($2, especialidade),
         foto = COALESCE($3, foto)
     WHERE id = $4
     RETURNING *`,
    [nome, especialidade, foto, id]
  );
  return result.rows[0];
};

// Remover advogado
const removerAdvogado = async (id) => {
  const result = await pool.query(
    "DELETE FROM equipa WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

module.exports = {
  listarEquipa,
  criarAdvogado,
  editarAdvogado,
  removerAdvogado,
};
