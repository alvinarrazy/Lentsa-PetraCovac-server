//Contoh
exports.testLive = function (req, res) {
    console.log(__dirname);
    res.status(201).json({
        message: "Server Live"
    });
}

exports.testIfAdminLogin = function (req, res) {
    if (!req.adminLoginData) {
        return res.json({ message: "Unauthenticated" });
    }else{
        return res.json({adminLoginDataId: req.adminLoginData._id})
    }
}