const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = jwt.verify(token, 'komi_kouma_game_seva_fia_deka');
        req.userData = {email: decodedToken.email, userId: decodedToken.userId};
        next();
    } catch (error) {

        res.status(401)
        .json({message: "Authentication failed!"});
    }
    
};