//Contoh
exports.testLive = function (req, res) {
    console.log(__dirname);
    res.status(201).json({
        message: "Server Live"
    });
}

exports.testIfLogin = function (req, res) {
    if (!req.loginData) {
        return res.json({ message: "Unauthenticated" });
    }else{
        return res.json({loginDataId: req.loginData._id})
    }
}