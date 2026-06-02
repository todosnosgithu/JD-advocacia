const pool = require("../Connections/Database");

// Listar todos
const listarServicos = async () => {
  const result = await pool.query(
    "SELECT * FROM servicos ORDER BY criado_em DESC"
  );
  return result.rows;
};

// Criar serviço
const criarServico = async (titulo, descricao) => {
  const result = await pool.query(
    "INSERT INTO servicos (titulo, descricao) VALUES ($1, $2) RETURNING *",
    [titulo, descricao]
  );
  return result.rows[0];
};

// Editar serviço
const editarServico = async (id, titulo, descricao) => {
  const result = await pool.query(
    `UPDATE servicos
     SET titulo = COALESCE($1, titulo),
         descricao = COALESCE($2, descricao)
     WHERE id = $3
     RETURNING *`,
    [titulo, descricao, id]
  );
  return result.rows[0];
};

// Remover serviço
const removerServico = async (id) => {
  const result = await pool.query(
    "DELETE FROM servicos WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

module.exports = {
  listarServicos,
  criarServico,
  editarServico,
  removerServico,
};
