// authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    console.log(token)

    if (!token) {
        return res.status(401).send({ error: 'Acesso não autorizado' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).send({ error: 'Token inválido' });
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;

