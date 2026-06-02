const pool = require('../Connections/Database');

class AdvogadoModel {
    async create(advogado) {
        const { nome, especializacao, cargo, email, telefone, taxa_exito } = advogado;
        const query = `
            INSERT INTO advogados (nome, especializacao, cargo, email, telefone, taxa_exito)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `;
        const result = await pool.query(query, [nome, especializacao, cargo, email, telefone, taxa_exito]);
        return result.rows[0];
    }

    async findAll() {
        const result = await pool.query('SELECT * FROM advogados WHERE ativo = true');
        return result.rows;
    }

    async findById(id) {
        const result = await pool.query('SELECT * FROM advogados WHERE id = $1', [id]);
        return result.rows[0];
    }

    async update(id, dados) {
        const { nome, especializacao, cargo, email, telefone, taxa_exito, ativo } = dados;
        const query = `
            UPDATE advogados 
            SET nome = $1, especializacao = $2, cargo = $3, email = $4, 
                telefone = $5, taxa_exito = $6, ativo = $7
            WHERE id = $8 RETURNING *
        `;
        const result = await pool.query(query, [nome, especializacao, cargo, email, telefone, taxa_exito, ativo, id]);
        return result.rows[0];
    }

    async delete(id) {
        const result = await pool.query(
            'UPDATE advogados SET ativo = false WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0];
    }
}

module.exports = new AdvogadoModel();