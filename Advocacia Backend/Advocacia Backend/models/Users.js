require('dotenv').config()
const pool = require('../Connections/Database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'pedrondozi';

class UsuarioModel {
    async create(usuario) {
        const { nome, email, senha, cargo } = usuario;
    
        const senha_hash = await bcrypt.hash(senha, 10);
        
        const query = `
            INSERT INTO usuarios (nome, email, senha_hash, cargo)
            VALUES ($1, $2, $3, $4) RETURNING id, nome, email, ativo
        `;
        const result = await pool.query(query, [nome, email, senha_hash, cargo]);
        return result.rows[0];
    }

    async login(email, senha) {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1 AND ativo = true',
            [email]
        );
        
        const usuario = result.rows[0];
        if (!usuario) return null;
        
        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaValida) return null;
        
        const token = jwt.sign(
            { 
                id: usuario.id, 
                email: usuario.email, 
                cargo: usuario.cargo 
            },
            SECRET_KEY,
            { expiresIn: '8h' }
        );
        
        await pool.query(
            'UPDATE usuarios SET ultimo_login = CURRENT_TIMESTAMP WHERE id = $1',
            [usuario.id]
        );
        
        return {
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                cargo: usuario.cargo
            }
        };
    }

    async findAll() {
        const result = await pool.query(
            'SELECT id, nome, email, cargo, ativo, ultimo_login, criado_em FROM usuarios WHERE ativo = true'
        );

        if (!result.rows) {
            return {error:true,errorMessage:'Nenhum usuario foi encontrado'}
        }

        return {error:false , data:result.rows};
    }

    async findById(id) {
        const result = await pool.query(
            'SELECT id, nome, email, cargo, ativo, ultimo_login, criado_em FROM usuarios WHERE id = $1',
            [id]
        );
        if (!result.rows[0]) {
            return {error:true , errorMessage:'Esse usuário não existe'}
        }

        return {error:false , data:result.rows[0]};
    }

    async update(id, dados) {
        const { nome, email, cargo, ativo } = dados;
        const query = `
            UPDATE usuarios 
            SET nome = $1, email = $2, cargo = $3, ativo = $4, atualizado_em = CURRENT_TIMESTAMP
            WHERE id = $5 RETURNING id, nome, email, cargo, ativo
        `;
        const result = await pool.query(query, [nome, email, cargo, ativo, id]);
        if (!result.rows[0]) {
            return {error:true , errorMessage:'Erro durante o update'}
        }

        return {error:false , data:result.rows[0]};
    }

    async updatePassword(id, senhaAntiga, senhaNova) {

        const usuario = await this.findById(id);
        if (!usuario) return null;
        
        const result = await pool.query('SELECT senha_hash FROM usuarios WHERE id = $1', [id]);
        const senhaValida = await bcrypt.compare(senhaAntiga, result.rows[0].senha_hash);
        if (!senhaValida) return null;
        
        const novaHash = await bcrypt.hash(senhaNova, 10);
        
        await pool.query('UPDATE usuarios SET senha_hash = $1 WHERE id = $2', [novaHash, id]);
        return true;
    }

    async delete(id) {
        const result = await pool.query(
            'UPDATE usuarios SET ativo = false WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0];
    }

}

function verifyToken(req, res, next) {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }
        
        const token = authHeader.split(' ')[1];
        
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.usuario = decoded;
            next();  // ← ESSE next() é essencial!
        } catch (error) {
            return res.status(401).json({ error: 'Token inválido ou expirado' });
        }
    }

module.exports = { UsuarioModel: new UsuarioModel(), verifyToken };