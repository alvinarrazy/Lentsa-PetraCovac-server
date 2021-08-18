const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = require('../config')
const dataRSModels = require("../model/dataRSModels")


exports.createDataRS = async function (req, res) {
    try {
        let searchResult = await dataRSModels.find({nama_rumahSakit: req.body.nama_rumahSakit})
        if(searchResult.length >= 1) return res.status(406).send({message: 'Nama RS Sudah ada'})
        let firstData = await dataRSModels.create({
            nama_rumahSakit: req.body.nama_rumahSakit,
            jumlahKamarUmum: req.body.jumlahKamarUmum,
            jumlahKamarCovid: req.body.jumlahKamarCovid,
            jumlahNakes: req.body.jumlahNakes,
            kelas: req.body.kelas
        })
        if (firstData) return res.status(201).send({ createdProduct: firstData })
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({ error: error.message })
    }
}

exports.updateDataRS = async function (req, res) {
    try {
        let updatedData = await dataRSModels.findByIdAndUpdate(req.body._id, {
            jumlahKamarUmum: req.body.jumlahKamarUmum,
            jumlahKamarCovid: req.body.jumlahKamarCovid,
            jumlahNakes: req.body.jumlahNakes,
            kelas: req.body.kelas
        })
        if (updatedData) return res.status(201).send({updatedProduct: updatedData})
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({ error: error.message })
    }
}

exports.getDataRS = async function (req, res){
    try {
        let dataRS = await dataRSModels.find()
        if(dataRS) return res.status(201).send(dataRS)
        else return res.status(404).send({error: "Data RS tidak ditemukan"})
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({ error: error.message })
    }
}

exports.getOneDataRS = async function (req, res){
    try {
        let oneDataRS = await dataRSModels.findById(req.params.dataRSId)
        if(oneDataRS) return res.status(201).send(oneDataRS)
        else return res.status(404).send({error: "Data RS tidak ditemukan"})
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({ error: error.message })
    }
}