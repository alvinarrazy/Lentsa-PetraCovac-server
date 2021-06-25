const AccountModels = require("../model/accountModels")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

 exports.register = function(req,res){
    AccountModels.find({ username: req.body.username })//cancel jika ada username yang sama
    .exec()
    .then(user => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: "Username exists"
          });//belum keluar apa2 di tampilan, mungkin bisa ditambahin
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                  return res.status(500).json({
                    error: err
                  });
                } else {
                    // if(!req.file){
                    //   return res.send('belum ada')
                    // }
                    let accountModels = new AccountModels({
                        fullname : req.body.fullname,
                        username : req.body.username,
                        email : req.body.email,
                        password : hash,
                        profilePic : req.file.path
                    });
                    accountModels.save(function(err){
                        if(err){
                            return next(err)
                        }
                    console.log(accountModels.username + " berhasil ditambah")
                    });
                }
            })
        }
    })
 }

 exports.login = function(req,res){    
    AccountModels.find({ username: req.body.username })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              fullname: user[0].fullname,
              email: user[0].email,
              username: user[0].username,
              userId: user[0]._id
            },
            "secret",
            {
                expiresIn: "1h"
            }
          );
          console.log(user[0].username + " berhasil login"); 
          let responseJson = {
              fullname: user[0].fullname,
              email: user[0].email,
              username: user[0].username,
              token: token
          }
          return res.json({
              fullname: user[0].fullname,
              email: user[0].email,
              username: user[0].username,
              token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });


    //////////////////////////////////////////////////yang lama//////////////////////////////
    // const accountModels = new AccountModels;
    // //Harus manggil langsung imported file nya, gk tau kenapa (gk bisa kalo manggil yang accountModels)
    // AccountModels.find({username: req.body.username, password: req.body.password},function(err,res){
    //     if(res.length>0){
    //         console.log(req.body.username + " berhasil ditemukan");
    //     }else if(err){
    //         return next(err);
    //     }else{
    //         console.log("Tidak ditemukan")
    //     }
        
    // })  
 
}

//Contoh
// exports.test = function(req,res){
//     res.send("ini udah bener komunikasi model control dan routes")
// }

// exports.create = function(req,res){
//     let todos = new Todos({
//         name : req.body.name,
//         done: false
//     });
    
//     todos.save(function(err){
//         if(err){
//             return next(err)
//         }
//     res.send("sukses nge mantab")
//     })  
     
// };

