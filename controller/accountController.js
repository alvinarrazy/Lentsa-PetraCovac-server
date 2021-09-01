const userModels = require("../model/userModels");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Secret } = require('../config');

exports.register = async function (req, res) {
  try {
    let findNik = await userModels.find({ nomorIndukKependudukan: req.body.nomorIndukKependudukan })
    let findEmail = await userModels.find({ email: req.body.email })
    if (findNik.length >= 1) return res.status(409).send({ message: "NIK telah terdaftar" })
    if (findEmail.length >= 1) return res.status(409).send({ message: "Email telah terdaftar" })
    try {
      let hash = await bcrypt.hash(req.body.password, 12)
      let newUser = new userModels({
        nomorIndukKependudukan: req.body.nomorIndukKependudukan,
        namaPanjang: req.body.namaPanjang,
        email: req.body.email,
        noTelp: req.body.noTelp,
        jenisKelamin: req.body.jenisKelamin,
        kotaLahir: req.body.kotaLahir,
        tanggalLahir: req.body.tanggalLahir,
        password: hash,
        role: "user",
        statusVaksin:'Belum Vaksin',
        statusCovid:'Belum Terpapar',
      });
      let result = await newUser.save()
      if (result) {
        return res.status(201).send({
          nomorIndukKependudukan: result.nomorIndukKependudukan,
          namaPanjang: result.namaPanjang,
          email: result.email,
          noTelp: result.noTelp,
          jenisKelamin: result.jenisKelamin,
          kotaLahir: result.kotaLahir,
          tanggalLahir: result.tanggalLahir,
          role: result.role
        })
      }
    } catch (error) {
      console.log(error.message)
      return res.status(500).send({ error: error.message })
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error.message })
  }
}

exports.login = function (req, res) {
  userModels.find({ email: req.body.email })
    .exec()
    .then(result => {
      if (result.length < 1) {
        console.log("Email tidak ditemukan")
        return res.status(404).send({
          error: "Email tidak ditemukan"
        });
      }
      bcrypt.compare(req.body.password, result[0].password, (err) => {
        if (err) {
          console.log("Auth failed")
          return res.status(401).send({
            error: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              nomorIndukKependudukan: result[0].nomorIndukKependudukan,
              namaPanjang: result[0].namaPanjang,
              email: result[0].email,
              noTelp: result[0].noTelp,
              jenisKelamin: result[0].jenisKelamin,
              kotaLahir: result[0].kotaLahir,
              tanggalLahir: result[0].tanggalLahir,
              role: result[0].role,
              _id: result[0]._id
            },
            Secret,
            {
              expiresIn: "6h"
            }
          );
          console.log(token)
          return res.status(201).send({
            nomorIndukKependudukan: result[0].nomorIndukKependudukan,
            namaPanjang: result[0].namaPanjang,
            email: result[0].email,
            noTelp: result[0].noTelp,
            jenisKelamin: result[0].jenisKelamin,
            kotaLahir: result[0].kotaLahir,
            tanggalLahir: result[0].tanggalLahir,
            role: result[0].role,
            token: token
          });
        } else {
          res.status(401).send({
            message: "Authentication failed"
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send({
        error: err
      });
    });
}

exports.getAllUsers = async function (req, res) {
  try {
    let allUsers = await userModels.find()
    console.log(allUsers)
    return res.status(201).send({ users: allUsers })
  } catch (err) {
    console.log(err.message)
    return res.status(500).send({ error: err.message })
  }
}

exports.getUser = async function (req, res) {
  try {
    let user = await userModels.findById(req.params.userId)
    if (user) return res.status(201).send(user)
    else res.status(404).send({ error: 'user not found' })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error.message })
  }
}

exports.findUser = async function (req, res){
  try {
    if(req.body.nomorIndukKependudukan && req.body.namaPanjang){
      let findResult = await userModels.find({
        "nomorIndukKependudukan": { "$regex": req.body.nomorIndukKependudukan, "$options": "i" },
        "namaPanjang":  { "$regex": req.body.namaPanjang, "$options": "i" }
      })
      if (findResult) return res.status(201).send(findResult)
      else res.status(404).send({ error: 'user not found' })
    }else if(req.body.nomorIndukKependudukan && !req.body.namaPanjang){
      let findResult = await userModels.find({
        "nomorIndukKependudukan": { "$regex": req.body.nomorIndukKependudukan, "$options": "i" }
      })
      if (findResult) return res.status(201).send(findResult)
      else res.status(404).send({ error: 'user not found' })
    }else{
      let findResult = await userModels.find({
        "namaPanjang":  { "$regex": req.body.namaPanjang, "$options": "i" }
      })
      if (findResult) return res.status(201).send(findResult)
      else res.status(404).send({ error: 'user not found' })
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error.message })
  }
}

exports.deleteUser = async function(req, res){
  try {
    let userAboutToBeDeleted = await userModels.findById(req.params.userId)
    if(userAboutToBeDeleted.role === 'user'){
      let userDeleted = await userModels.findByIdAndDelete(req.params.userId)
      if(userDeleted){
        return res.status(201).send(userDeleted)
      }
      else return res.status(404).send({error: 'user not found'})
    }else{
      return res.status(401).send({error: 'forbidden to delete an admin'})
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error.message })
  }
}