class Equipa {
    Init(conexao) {
        this.conexao = conexao
        this.CreateTable()
    }

    async CreateTable() {
        const table = `
            CREATE TABLE IF NOT EXISTS equipa (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(150)  NOT NULL,
                especialidade VARCHAR(150) NOT NULL,
                foto TEXT,
                criado_em TIMESTAMP DEFAULT NOW()
            );
        `;

        try {
            await this.conexao.query(table);
            console.log('✅ Tabela equipa criada com sucesso');
        } catch (error) {
            console.log({ errorInfo: 'Erro na tabela equipa', errorMessage: error.message });
        }
    }
}

module.exports = new Equipa();