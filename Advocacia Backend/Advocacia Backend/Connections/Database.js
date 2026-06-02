require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    database: process.env.Database,
    user: process.env.User,
    port: process.env.Port,
    password: process.env.Password,
    host: process.env.Host
});

pool.connect((err, client, release) => {
    if (err) {
        console.log('❌ Erro durante a conexão com o database');
        return;
    }

    console.log('✅ Conectado ao Database');
    release(); // libera conexão
});

module.exports = pool;