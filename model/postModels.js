const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const PostModels = Schema({
    image : {type:String},
    description : {type:String},
    // name : {type:String},
    // hp : {type:String},
    // mp : {type:String},
    // atk : {type:String},
    // def : {type:String},
    // matk : {type:String},
    // mdef : {type:String},
    // spd : {type:String},
    // acc : {type:String}
    // path : {type:String}
})

//Contoh
// let TodoScrhema = Schema({
//     name : {type:String},
//     done : {type:Boolean}
// })

module.exports = mongoose.model("posts", PostModels)