const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataRSModels = Schema({
    nama_rumahSakit: {type: String},
    jumlahKamarUmum: {type: Number},
    jumlahKamarCovid: {type: Number},
    jumlahNakes: {type: Number},
    kelas: {type: String},
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("dataDesa", DataRSModels)