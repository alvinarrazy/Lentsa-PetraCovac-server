const stokDarahModels = require('../model/stokDarahModels')

exports.getStokDarah = async function (req, res){
    try {
        let resultFind = await stokDarahModels.find()
        if(resultFind) return res.status(201).send(resultFind)
        else return res.status(404).send({error: 'stok darah tidak ditemukan'})
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({error: error.message})
    }
}

exports.addStokDarah = async function (req,res){
    try {
        console.log(req.body)
        let addedData = await stokDarahModels.create({
            stokDarah: req.body.stokDarah,
            golonganA: req.body.golonganA,
            golonganB: req.body.golonganB,
            golonganO: req.body.golonganO,
            golonganAB: req.body.golonganAB
        })
        if(addedData) return res.status(201).send({addedData: addedData})
        else return res.status(500).send({error: 'sesuatu yang salah pada server, sehingga menambahkan data gagal'})
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({error: error.message})
    }
}

exports.editStokDarah = async function (req,res){
    try {
        console.log(req.body)
        let editedData = await stokDarahModels.findByIdAndUpdate(req.body._id, {
            stokDarah: req.body.stokDarah,
            golonganA: req.body.golonganA,
            golonganB: req.body.golonganB,
            golonganO: req.body.golonganO,
            golonganAB: req.body.golonganAB 
        })
        if(editedData) return res.status(201).send({editedData: editedData})
        else return res.status(500).send({error: 'sesuatu yang salah pada server, sehingga mengedit data gagal'})
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({error: error.message})
    }
}

exports.deleteStokDarah = async function (req, res){
    try {
        let deletedData = await stokDarahModels.findByIdAndDelete(req.params.dataId)
        if(deletedData) return res.status(201).send({deletedData: deletedData})
        else return res.status(404).send({error: 'data not found'})
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({error: error.message})
    }
}