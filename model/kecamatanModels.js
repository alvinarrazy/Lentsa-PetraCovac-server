const mongoose = require("mongoose")
var uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

const KecamatanModels = Schema({
        nama_kecamatan: {
                type: String,
                unique: true
        }
})

KecamatanModels.plugin(uniqueValidator)

module.exports = mongoose.model("dataKecamatan", KecamatanModels)