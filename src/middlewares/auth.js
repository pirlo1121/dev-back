import { verifyToken } from "../helpers/helper.hash.js"



export function auth(req,res,next){
    const token = req.headers["authorization"]?.split(" ")[1]
    if( !token ) return res.status(403).json({ok: false, msg: "TOKEN REQUERIDO"})

    try {
        const decode = verifyToken(token);
        if(!decode) return res.status(401).json({ok:false, msg: "TOKEN INVALIDO"})

        req.user = decode
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok: false, msg: "ERROR DE AUTENTICAIÓN"})
    }
}