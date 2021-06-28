const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const KecamatanModels = Schema({
        nama_kecamatan : {type:String},
        id_desa : {type:String},
        nama_desa : {type:String}
})

//Contoh
// let TodoScrhema = Schema({
//     name : {type:String},
//     done : {type:Boolean}
// })

module.exports = mongoose.model("dataKecamatan", KecamatanModels)