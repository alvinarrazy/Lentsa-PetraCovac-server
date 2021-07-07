const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");
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

DesaModels.plugin(mongooseUniqueValidator)

module.exports = mongoose.model("dataDesa", DesaModels)