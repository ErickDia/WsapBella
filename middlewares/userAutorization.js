import jwt from 'jsonwebtoken';


const userAutorization = (req, res, next) => {
    const authorization = req.get('authorization');
    console.log(authorization);
    let token = ""
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7);
    }
    let decodedToken = {}

    try {
        decodedToken = jwt.verify(token, "Secret_jwt_whatsendpro")
    } catch (e) {
    }

    if (!token || !decodedToken.usu_nombre) {
        return res.status(401).json({ status: "error", message: 'token missing or invalid' })
    }
    req.user = decodedToken
    next()
}
export default userAutorization;