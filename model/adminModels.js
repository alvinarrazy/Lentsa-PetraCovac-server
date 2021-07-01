const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const AdminModels = Schema({
    username : {type:String},
    email : {type:String},
    password : {type:String},
    role: {type:String}
})

//Contoh
// let TodoScrhema = Schema({
//     name : {type:String},
//     done : {type:Boolean}
// })

module.exports = mongoose.model("adminaccount", AdminModels)