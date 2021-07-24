const userModels = require("../model/userModels");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Secret} = require ('../config');

exports.register = function (req, res) {
  userModels.find({ username: req.body.username })//cancel jika ada username yang sama
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
            let newUser = new userModels({
              username: req.body.username,
              email: req.body.email,
              password: hash,
              role: "user"
            });
            newUser.save()
              .then(result => {
                res.status(201).json({
                  message: result.username + " berhasil ditambahkan",
                  createdUser: {
                    username: result.username,
                    email: result.email,
                    hashedPassword: result.password,
                    role: result.role
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

exports.login = function (req, res) {
  userModels.find({ username: req.body.username })
    .exec()
    .then(result => {
      if (result.length < 1) {
        return res.status(401).json({
          message: "Username tidak ditemukan"
        });
      }
      bcrypt.compare(req.body.password, result[0].password, (err) => {
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
              _id: result[0]._id
            },
            Secret,
            {
              expiresIn: "1h"
            }
          );
          return res.status(201).json({
            email: result[0].email,
            username: result[0].username,
            token: token,
            role: result[0].role
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

