import express from 'express';
const router = express.Router();


const getPruebas = async (req, res) => {

    return res.status(200).json({
        status: "success",
        data: {
            saludo: "hola"
        }
    })
}

router.route('/').get(getPruebas);

export default router;
