class Servico {
    Init(conexao) {
        this.conexao = conexao
        this.CreateTable()
    }

    async CreateTable() {
        const table = `
            CREATE TABLE IF NOT EXISTS servicos (
                id SERIAL PRIMARY KEY,
                titulo VARCHAR(150) NOT NULL,
                descricao TEXT NOT NULL,
                criado_em TIMESTAMP DEFAULT NOW()
            );
        `;

        try {
            await this.conexao.query(table);
            console.log('✅ Tabela servicos criada com sucesso');
        } catch (error) {
            console.log({ errorInfo: 'Erro na tabela servicos', errorMessage: error.message });
        }
    }
}

module.exports = new Servico();