const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        //console.log("authorization!!!= "+ req.headers.authorization);
        const token = req.headers.authorization;
        //console.log(jwt.verify(token, "secret"));
        const decoded = jwt.verify(token, "secret");
        req.userData = decoded;
        next();
    } catch (error) {
        console.log(req.headers.authorization);
        console.log('Auth failed di check-auth')
        return res.status(401).json({
            message: 'Auth failed' 
        });
    }
};