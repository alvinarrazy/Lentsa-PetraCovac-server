//Models 
const { json } = require("body-parser");
const desaModels = require("../model/desaModels");
const kecamatanModels = require("../model/kecamantanModels");


//Ambil data 1 kecamatan berdasarkan nama
exports.getOneKecamatan = function (req, res) {
  kecamatanModels.find({ nama_kecamatan: req.params.namaKecamatan })
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
  kecamatanModels.find({ nama_kecamatan: req.body.nama_kecamatan })
    .exec()
    .then(result => {
      if (result.length >= 1) {
        return res.status(401).json({
          message: "Kecamatan sudah ada"
        });
      }//kalau nama masih baru
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

    })
}

//Update data kecamatan
exports.updateDataKecamatan = function (req, res) {
  const namaKecamatanYangInginDiganti = req.params.namaKecamatan
  const namaKecamatanBaru = req.body.nama_kecamatan_baru
  // console.log(namaKecamatanYangInginDiganti)
  //Mencari apakah nama kecamatan sudah ada
  kecamatanModels.find({nama_kecamatan: namaKecamatanYangInginDiganti})
  .exec()
  .then(resultPencarian => {
    if(resultPencarian < 1) return res.status(401).json({message: "nama kecamatan tidak ada"})
  })
  kecamatanModels.findOneAndUpdate(
    { nama_kecamatan: namaKecamatanYangInginDiganti },
    {
      $set: {
        nama_kecamatan: namaKecamatanBaru
      }
    },
    {
      upsert: false
    }
  ).then(result => {
    desaModels.updateMany(
      {nama_kecamatan: namaKecamatanYangInginDiganti},
      {$set: {
        nama_kecamatan: namaKecamatanBaru
      }},
      {upsert: false}
    ).exec()
    if (namaKecamatanYangInginDiganti == namaKecamatanBaru) {
      return res.status(201).json({
        message: "Data Kecamatan " + namaKecamatanYangInginDiganti + " Telah diperbarui",
        updatedProduct: {
          nama_kecamatan: namaKecamatanBaru,
          nama_kecamatan_lama: namaKecamatanYangInginDiganti
        }
      });
    } else {
      return res.status(201).json({
        message: "Data Kecamatan " + namaKecamatanYangInginDiganti + " telah diupdate dan namanya diganti menjadi " + namaKecamatanBaru,
        updatedProduct: {
          nama_kecamatan: namaKecamatanBaru,
          nama_kecamatan_lama: namaKecamatanYangInginDiganti
        }
      })
    }
  })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        error: err
      });
    })
}

//Tambah Desa Baru
exports.tambahDesa = function (req, res) {
  var namaKecamatan = req.body.nama_kecamatan;
  var idKecamatan;
  desaModels.find({ nama_desa: req.body.nama_desa })
    .exec()
    .then(result => {
      if (result.length >= 1) {
        return res.status(401).json({
          message: "Desa sudah ada"
        });
      }
      kecamatanModels.find({ nama_kecamatan: namaKecamatan })
        .exec()
        .then(result => {
          if (result.length < 1) {
            return res.status(401).json({
              message: "Kecamatan tidak ditemukan"
            });
          }
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
    })

}

exports.updateDataDesa = function (req, res) {
  var idKecamatanBaru;
  var namaKecamatanBaru;
  var namaDesaYangInginDiganti = req.params.namaDesa
  desaModels.find({ nama_desa: namaDesaYangInginDiganti })
    .exec()
    .then(resultPencarianDesa => {
      namaKecamatanBaru = req.body.nama_kecamatan_baru;
      kecamatanModels.find({nama_kecamatan: namaKecamatanBaru})
      .exec()
      .then(resultPencarianKecamatanBaru => {
        idKecamatanBaru = resultPencarianKecamatanBaru._id;
        desaModels.findOneAndUpdate(
          {nama_desa: namaDesaYangInginDiganti},
          {$set: {
            nama_desa: req.body.nama_desa_baru,
            nama_kecamatan: namaKecamatanBaru,
            id_kecamatan: idKecamatanBaru,
            suspek: req.body.suspek_baru,
            discharded: req.body.discharded_baru,
            meninggal: req.body.meninggal_baru,
            konfirmasi_symptomatik: req.body.konfirmasi_symptomatik_baru,
            konfirmasi_asymptomatik: req.body.konfirmasi_asymptomatik_baru,
            konfirmasi_sembuh: req.body.konfirmasi_sembuh_baru,
            konfirmasi_meninggal: req.body.konfirmasi_meninggal_baru
          }},
          {upsert: true}
        )
        .then(result => {
          if (req.params.namaDesa == result.nama_desa) {
            return res.status(201).json({
              message: "Data Desa " + result.nama_desa + " Telah diperbarui",
              updatedProduct: {
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
                konfirmasi_meninggal: result.konfirmasi_meninggal              }
            });
          } else {
            return res.status(201).json({
              message: "Data Kecamatan " + result.nama_desa + " telah diupdate dan namanya diganti menjadi " + result.nama_kecamatan,
              updatedProduct: {
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
                konfirmasi_meninggal: result.konfirmasi_meninggal              }
            })
          }
        })
          .catch(err => {
            console.log(err);
            return res.status(500).json({
              error: err
            });
          })
      })
    })
  const namaKecamatanYangInginDiganti = req.body.nama_kecamatan
  kecamatanModels.findOneAndUpdate(
    { nama_kecamatan: namaKecamatanYangInginDiganti },
    {
      $set: {
        nama_kecamatan: req.body.nama_kecamatan_baru
      }
    },
    {
      upsert: true
    }
  )
}


//Ambil data desa-desa yang ada pada kecamatan
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
