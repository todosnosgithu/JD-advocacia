require('dotenv').config();
const Database = require('../Connections/Database')
const JWT = require("jsonwebtoken")
const express = require("express")
const Bcrypt = require("bcrypt")
const Login = express.Router()

Login.post(req,res => {
    const {email , senha} = req.body
    const select = 'SELECT * FROM USERS WHERE email = ?'

    return new Promise((resolve,reject) => {
        Database.query(select , email , (error , user) => {
            if (error) {
                reject({errorMessage:error.message , errorInf:'Erro Interno'})
                return
            }

            if (user.length <= 0) {
                resolve({message:'Esse email não corresponde a nenhuma conta'})
            }

            const userFound = user[0]
            const password = userFound.password

            Bcrypt.compare(senha , password , (error , user_pass) => {
                if (error) {
                    reject({message:'Erro Interno', error:error.message})
                    return
                }

                if (!user_pass) {
                    resolve({message:'!Senha Invalida'})
                    return
                }

                const token = JWT.sign({id:userFound.id , nome:userFound.nome , email:userFound.email} , process.env.Secret_Key , {expiresIn:'1d'})
                resolve({
                    message:'Login Realizado com sucesso',
                    token:token,
                    userDetails:user
                })
            })
        })
    })
})

//module.exports = {Login}