class EntrarEm_Contacto {
    Init(conexao) {
        this.conexao = conexao
        this.CreateTable()
    }

    async CreateTable() {
        const table = `
            CREATE TABLE IF NOT EXISTS entrar_em_contacto (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(200) NOT NULL,
                email VARCHAR(120),
                telefone VARCHAR(20),
                assunto TEXT ,
                mensagem TEXT,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        try {
            await this.conexao.query(table);
            console.log('✅ Tabela EntrarEm_Contacto criada com sucesso');
        } catch (error) {
            console.log({ errorInfo: 'Erro na tabela EntrarEm_Contacto', errorMessage: error.message });
        }
    }
}

module.exports = new EntrarEm_Contacto();