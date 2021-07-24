const jwt = require('jsonwebtoken');
const {Secret} = require('../config');
module.exports = async (req, res, next) => {

    try {
        //console.log("authorization!!!= "+ req.headers.authorization);
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, Secret);
        req.loginData = decoded;
        console.log(req.loginData)
        next();
    } catch (error) {
        console.log(req.headers.authorization);
        console.log('Auth failed di check-auth')
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};