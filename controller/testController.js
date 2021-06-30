//Contoh
 exports.test = function(req,res){
     console.log(__dirname);
    res.status(201).json({
        message: "Server Live"
    });
 }