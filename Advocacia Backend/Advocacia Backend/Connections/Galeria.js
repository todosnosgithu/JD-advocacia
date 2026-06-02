class Galeria {
    Init(db){
        this.db = db
        this.CreateTable();
    }

    CreateTable(){
        const table = `
            CREATE TABLE IF NOT EXISTS galeria (
                id        SERIAL PRIMARY KEY,
                nome      VARCHAR(200),
                caminho   TEXT NOT NULL,
                criado_em TIMESTAMP DEFAULT NOW()
            );
        `;

        this.db.query(table , (err) => {
            if (err) {
                console.log({err:"Erro durante a criação da galeria : "+err.message});
                return;
            }
            console.log('Tabela galeria criada com sucesso');
        })
    }
}
module.exports = new Galeria();