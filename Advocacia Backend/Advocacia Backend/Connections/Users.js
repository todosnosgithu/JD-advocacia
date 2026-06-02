class Users {
    Init(conexao) {
        this.conexao = conexao
        this.CreateTable();
    }

    async CreateTable() {
        const table = `
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(120) NOT NULL,
                email VARCHAR(120) NOT NULL UNIQUE,
                senha VARCHAR(255) NOT NULL,
                cargo VARCHAR(20) CHECK (cargo IN ('user', 'admin')) DEFAULT user,
                ultimo_login TIMESTAMP,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        try {
            await this.conexao.query(table);
            console.log('✅ Tabela usuarios criada com sucesso');
        } catch (error) {
            console.log({ errorInfo: 'Erro na tabela usuarios', errorMessage: error.message });
        }
    }
}

module.exports = new Users();