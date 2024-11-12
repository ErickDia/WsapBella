
import express from 'express';
import jwt from 'jsonwebtoken';
import userAutorization from '../middlewares/userAutorization.js'


const router = express.Router();


const login = async (req, res) => {

    const { usu_nombre, usu_password } = req.body;

    console.log(req.body);

    if (usu_nombre === "Erick" && usu_password === "secret123") {
        const tokenUsuario = jwt.sign({usu_nombre}, "Secret_jwt_whatsendpro")
        return res.status(200).json({
            status: "success",
            message: "Acceso concedido!",
            data: {
                usu_nombre: usu_nombre,
                token: tokenUsuario
            }
        })
    } else {
        return res.status(400).json({
            status: "error",
            message: "Usuario o contraseña incorrecto"
        })
    }
}
const getUserByToken = async (req, res) => {
    return res.status(200).json({
        status: "success",
        data: req.user,
        message: "usuario verificado, mantener la sesion"
    })
}

router.route('/login').post(login);
router.route('/getUserToken').get(userAutorization, getUserByToken);



export default router;  
