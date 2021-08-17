const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const LaporanModels = Schema({
    nik_pelapor: { type: String },
    nama_pelapor: { type: String },
    laporan: { type: String }, //sesuai sama entitas desa models, terjangkit, sudah vaksin, gejala
    keterangan: { type: String },
    photoId: { type: String },
    viewPhotoURL: {type: String},
    downloadPhotoURL: {type: String},
    postedDate: { type: Date, default: Date.now }
})

//Contoh
// let TodoScrhema = Schema({
//     name : {type:String},
//     done : {type:Boolean}
// })

module.exports = mongoose.model("laporan", LaporanModels)