const jwt = require('jsonwebtoken');
const {userSecret} = require('../config');
module.exports = async (req, res, next) => {


    try {
        //console.log("authorization!!!= "+ req.headers.authorization);
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, userSecret);
        req.adminLoginData = decoded;
        console.log(req.adminLoginData)
        next();
    } catch (error) {
        console.log(req.headers.authorization);
        console.log('Auth failed di check-auth')
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};