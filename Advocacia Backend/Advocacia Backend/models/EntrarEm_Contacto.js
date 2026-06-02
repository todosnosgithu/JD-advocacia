const pool = require('../Connections/Database');

class EntrarEm_Contacto {
    async create(cliente) {
        const { nome, email, telefone, assunto, mensagem} = cliente;
        const query = `
            INSERT INTO entrar_em_contacto ( nome, email, telefone, assunto, mensagem)
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;
        const result = await pool.query(query, [ nome, email, telefone, assunto, mensagem]);
        return result.rows[0];
    }

    async findAll() {
        const result = await pool.query('SELECT * FROM entrar_em_contacto');
        return result.rows;
    }

    async findById(id) {
        const result = await pool.query('SELECT * FROM entrar_em_contacto WHERE id = $1', [id]);
        return result.rows[0];
    }

    async delete(id) {
        const result = await pool.query(
            "DELETE FROM entrar_em_contacto WHERE id = $1 RETURNING *",
            [id]
        );
        return result.rows[0];
    }
}

module.exports = new EntrarEm_Contacto();