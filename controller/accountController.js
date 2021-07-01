const UserModels = require("../model/userModels")
const AdminModels = require("../model/userModels")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerAdmin = function (req, res) {
  AdminModels.find({ username: req.body.username })//cancel jika ada username yang sama
    .exec()
    .then(result => {
      if (result.length >= 1) {
        return res.status(409).json({
          message: "Username exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            // if(!req.file){
            //   return res.send('belum ada')
            // }
            let AdminModels = new AdminModels({
              username: req.body.username,
              email: req.body.email,
              password: hash
            });
            AdminModels.save()
              .then(result => {
                res.status(201).json({
                  message: result.username + " berhasil ditambahkan sebagai admin baru",
                  createdAdmin: {
                    username: result.username,
                    email: result.email,
                    hashedPassword: result.password
                  }
                })
              })
              .catch(er => {
                res.status(500).json({
                  error: er
                })
              })
          }
        })
      }
    })
}

exports.loginAdmin = function (req, res) {
  AdminModels.find({ username: req.body.username })
    .exec()
    .then(result => {
      if (result.length < 1) {
        return res.status(401).json({
          message: "Username Admin tidak ditemukan"
        });
      }
      bcrypt.compare(req.body.password, result[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: result[0].email,
              username: result[0].username,
              userId: result[0]._id
            },
            "secret",
            {
              expiresIn: "1h"
            }
          );
          return res.json({
            fullname: result[0].fullname,
            email: result[0].email,
            username: result[0].username,
            token: token
          });
        }else{
          res.status(401).json({
            message: "Auth failed"
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });


  //////////////////////////////////////////////////yang lama//////////////////////////////
  // const UserModels = new UserModels;
  // //Harus manggil langsung imported file nya, gk tau kenapa (gk bisa kalo manggil yang UserModels)
  // UserModels.find({username: req.body.username, password: req.body.password},function(err,res){
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

