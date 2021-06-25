const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const AccountModels = Schema({
    fullname : {type:String},
    username : {type:String},
    email : {type:String},
    password : {type:String},
    profilePic: {type:String}
})

//Contoh
// let TodoScrhema = Schema({
//     name : {type:String},
//     done : {type:Boolean}
// })

module.exports = mongoose.model("useraccounts", AccountModels)