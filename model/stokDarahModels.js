const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stokDarahModels = Schema({
    stokDarah: {type: String},
    golonganA: {type: Number},
    golonganB: {type: Number},
    golonganO: {type: Number},
    golonganAB: {type: Number}
})

module.exports = mongoose.model("dataDarah", stokDarahModels)