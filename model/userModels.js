const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const AccountModels = Schema({
    nomorIndukKependudukan: {type: String},
    namaPanjang : {type:String},
    email : {type:String},
    password : {type:String},
    noTelp: {type:String},
    jenisKelamin: {type:String},
    kotaLahir: {type:String},
    tanggalLahir:{type:Date},
    statusVaksin:{type:String},
    statusCovid:{type:String},
    role: {type:String}
})

//Contoh
// let TodoScrhema = Schema({
//     name : {type:String},
//     done : {type:Boolean}
// })

module.exports = mongoose.model("useraccounts", AccountModels)