class Advogados {
    Init(conexao) {
        this.conexao = conexao
        this.CreateTable()
    };

    async CreateTable() {
        const table = `
            CREATE TABLE IF NOT EXISTS advogados (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(120) NOT NULL,
                especializacao VARCHAR(20) CHECK (especializacao IN ('Civel','Criminal','Trabalhista','Tributario','Empresarial','Familia','Outros')) NOT NULL,
                cargo VARCHAR(60),
                email VARCHAR(120),
                telefone VARCHAR(20),
                taxa_exito DECIMAL(5,2) DEFAULT 0.00,
                ativo BOOLEAN DEFAULT TRUE,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        try {
            await this.conexao.query(table);
            console.log('✅ Tabela advogados criada com sucesso');
        } catch (error) {
            console.log({ errorInfo: 'Erro na tabela advogados', errorMessage: error.message });
        }
    }
}

module.exports = new Advogados();