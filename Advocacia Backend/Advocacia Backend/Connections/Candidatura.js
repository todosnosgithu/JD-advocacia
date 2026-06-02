class Candidaturas {
    Init(conexao) {
        this.conexao = conexao
        this.CreateTable()
    }

    async CreateTable() {
        const table = `
            CREATE TABLE IF NOT EXISTS candidaturas (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(150)  NOT NULL,
                email VARCHAR(150)  NOT NULL,
                assunto VARCHAR(200),
                nivel VARCHAR(80),
                area VARCHAR(80),
                detalhes TEXT,
                estado VARCHAR(50) DEFAULT 'pendente',
                criado_em TIMESTAMP DEFAULT NOW()
            );
        `;

        try {
            await this.conexao.query(table);
            console.log('✅ Tabela candidaturas candidaturas com sucesso');
        } catch (error) {
            console.log({ errorInfo: 'Erro na tabela candidaturas', errorMessage: error.message });
        }
    }
}

module.exports = new Candidaturas();