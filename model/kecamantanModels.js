const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const KecamatanModels = Schema({
        nama_kecamatan: {
                type: String,
                unique: true
        }
})

//Contoh
// let TodoScrhema = Schema({
//     name : {type:String},
//     done : {type:Boolean}
// })

module.exports = mongoose.model("dataKecamatan", KecamatanModels)