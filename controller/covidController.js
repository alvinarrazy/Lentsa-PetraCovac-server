//Models 
const desaModels = require("../model/desaModels");
const kecamatanModels = require("../model/kecamantanModels");


exports.tambahKecamatan = function(req,res){
  var namaDesa = req.body.nama_desa;
  var idDesa;
  desaModels.find({namaDesa})
  .exec()
  .then(result =>{
    console.log(result)
  })
  let dataBaru = new kecamatanModels({
    nama_kecamatan: req.body.nama_kecamatan,
    nama_desa: req.body.nama_kecamatan
  })
}

//Tambah Desa Baru
exports.tambahDesa = function(req,res){
  let dataBaru = new desaModels({
    nama_desa: req.body.nama_desa,
    suspek: req.body.suspek,
    discharded: req.body.discharded,
    meninggal: req.body.meninggal,
    konfirmasi_symptomatik: req.body.konfirmasi_symptomatik,
    konfirmasi_asymptomatik: req.body.konfirmasi_asymptomatik,
    konfirmasi_sembuh: req.body.konfirmasi_sembuh,
    konfirmasi_meninggal: req.body.konfirmasi_meninggal
  });
  console.log(dataBaru);
  res.status(201).json({
    message: dataBaru
  })
  /*dataBaru.save()
  .then(result => {
    console.log(result);
    res.status(201).json({
      message: "Created product successfully",
      createdProduct: {
        _id: result._id,
        nama_desa: result.nama_desa,
        suspek: result.suspek,
        discharded: result.discharded,
        meninggal: result.meninggal,
        konfirmasi_symptomatik: result.konfirmasi_symptomatik,
        konfirmasi_asymptomatik: result.konfirmasi_asymptomatik,
        konfirmasi_sembuh: result.konfirmasi_sembuh,
        konfirmasi_meninggal: result.konfirmasi_meninggal
        // request: {
        //   type: 'GET',
        //   url: "http://localhost:3001/post/" + result._id
        // }
      }
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });*/
}