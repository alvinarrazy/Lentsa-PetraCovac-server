//Models 
const desaModels = require("../model/desaModels");
const kecamatanModels = require("../model/kecamantanModels");

exports.getOneKecamatan = function (req, res) {
  kecamatanModels.find({nama_kecamatan: req.params.namaKecamatan})
    .then(results => {
      const response = {
        jumlah_kecamatan: results.length,
        semua_kecamatan: results.map(result => {
          return {
            _id: result._id,
            nama_kecamatan: result.nama_kecamatan
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}


//Ambil semua data kecamatan
exports.getAllKecamatan = function (req, res) {
  kecamatanModels.find()
    .then(results => {
      const response = {
        jumlah_kecamatan: results.length,
        semua_kecamatan: results.map(result => {
          return {
            _id: result._id,
            nama_kecamatan: result.nama_kecamatan
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}


//Tambah Kecamatan Baru
exports.tambahKecamatan = function (req, res) {
  let dataBaru = new kecamatanModels({
    nama_kecamatan: req.body.nama_kecamatan
  })
  dataBaru.save()
    .then(result => {
      res.status(201).json({
        message: "Kecamatan baru berhasil ditambahkan",
        createdKecamatan: {
          _id: result._id,
          nama_kecamatan: result.nama_kecamatan
        }
      })
    })
    .catch(er => {
      res.status(500).json({
        error: er
      })
    })
}

//Tambah Desa Baru
exports.tambahDesa = function (req, res) {
  var namaKecamatan = req.body.nama_kecamatan;
  var idKecamatan;
  kecamatanModels.find({ nama_kecamatan: namaKecamatan })
    .exec()
    .then(result => {
      idKecamatan = result[0]._id;
      let dataBaru = new desaModels({
        nama_desa: req.body.nama_desa,
        nama_kecamatan: namaKecamatan,
        id_kecamatan: idKecamatan,
        suspek: req.body.suspek,
        discharded: req.body.discharded,
        meninggal: req.body.meninggal,
        konfirmasi_symptomatik: req.body.konfirmasi_symptomatik,
        konfirmasi_asymptomatik: req.body.konfirmasi_asymptomatik,
        konfirmasi_sembuh: req.body.konfirmasi_sembuh,
        konfirmasi_meninggal: req.body.konfirmasi_meninggal
      });
      dataBaru.save()
        .then(result => {
          res.status(201).json({
            message: "Desa baru berhasil ditambahkan",
            createdProduct: {
              _id: result._id,
              nama_desa: result.nama_desa,
              id_kecamatan: result.id_kecamatan,
              nama_kecamatan: result.nama_kecamatan,
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
          res.status(500).json({
            error: err
          });
        });
    })
}

exports.getDesaInKecamatan = function (req, res) {
  desaModels.find({ id_kecamatan: req.params.idKecamatan })
    .exec()
    .then(results => {
      const response = {
        jumlah_desa_di_kecamatan: results.length,
        semua_desa: results.map(result => {
          return {
            _id: result._id,
            nama_desa: result.nama_desa,
            id_kecamatan: result.id_kecamatan,
            nama_kecamatan: result.nama_kecamatan,
            suspek: result.suspek,
            discharded: result.discharded,
            meninggal: result.meninggal,
            konfirmasi_symptomatik: result.konfirmasi_symptomatik,
            konfirmasi_asymptomatik: result.konfirmasi_asymptomatik,
            konfirmasi_sembuh: result.konfirmasi_sembuh,
            konfirmasi_meninggal: result.konfirmasi_meninggal
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}
