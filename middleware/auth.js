const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

function authenticateJWT(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {    
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { authenticateJWT };
