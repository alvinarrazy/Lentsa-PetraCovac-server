const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const DesaModels = Schema({
        nama_desa: { type: String, unique: true },
        id_kecamatan: { type: String },
        nama_kecamatan: { type: String },
        suspek: { type: Number },
        discharded: { type: Number },
        meninggal: { type: Number },
        keterangan: { type: String },
        konfirmasi_symptomatik: { type: Number },
        konfirmasi_asymptomatik: { type: Number },
        konfirmasi_sembuh: { type: Number },
        konfirmasi_meninggal: { type: Number },
        keterangan_konfirmasi: { type: String }
})

//Contoh
// let TodoScrhema = Schema({
//     name : {type:String},
//     done : {type:Boolean}
// })

module.exports = mongoose.model("dataDesa", DesaModels)