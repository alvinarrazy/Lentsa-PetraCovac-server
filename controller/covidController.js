//Models 
const { json } = require("body-parser");
const desaModels = require("../model/desaModels");
const kecamatanModels = require("../model/kecamatanModels");

//Ambil data 1 kecamatan berdasarkan nama
exports.getOneKecamatan = function (req, res) {
  kecamatanModels.find({ nama_kecamatan: req.params.namaKecamatan })
    .then(results => {
      const response = {
        semua_kecamatan: results.map(result => {
          return {
            _id: result._id,
            nama_kecamatan: result.nama_kecamatan
          };
        })
      };
      res.status(201).json(response);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).send({
        error: err.message
      });
    });
}


//Ambil semua data kecamatan
exports.getAllKecamatan = function (req, res) {
  kecamatanModels.find()
    .then(results => {
      const response = {
        semua_kecamatan: results.map(result => {
          return {
            _id: result._id,
            nama_kecamatan: result.nama_kecamatan
          };
        })
      };
      res.status(201).json(response);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).send({
        error: err.message
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
          res.status(500).send({
            error: er
          })
        })

    })
}


//tambah data dengan CSV
exports.tambahKecamatanCSV = function (req, res) {
  var jsonFile = keysToLowerCase(req.body);
  var paketDataBaru = []
  jsonFile.map(kecamatan => {
    paketDataBaru.push(kecamatan);
  })
  kecamatanModels.insertMany(paketDataBaru)
    .then(result => {
      res.status(201).json(result)
    })
    .catch(er => {
      res.status(500).send({ error: er })
    })
}


//Update data kecamatan
exports.updateDataKecamatan = function (req, res) {
  const namaKecamatanYangInginDiganti = req.params.namaKecamatan
  const namaKecamatanBaru = req.body.nama_kecamatan_baru
  // console.log(namaKecamatanYangInginDiganti)
  //Mencari apakah nama kecamatan sudah ada
  kecamatanModels.find({ nama_kecamatan: namaKecamatanYangInginDiganti })
    .exec()
    .then(resultPencarian => {
      if (resultPencarian.length < 1) return res.status(401).json({ message: "nama kecamatan tidak ada" })
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
      { nama_kecamatan: namaKecamatanYangInginDiganti },
      {
        $set: {
          nama_kecamatan: namaKecamatanBaru
        }
      },
      { upsert: false }
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
      console.log(err.message);
      return res.status(500).send({
        error: err.message
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
            keterangan: req.body.keterangan,
            konfirmasi_symptomatik: req.body.konfirmasi_symptomatik,
            konfirmasi_asymptomatik: req.body.konfirmasi_asymptomatik,
            konfirmasi_sembuh: req.body.konfirmasi_sembuh,
            konfirmasi_meninggal: req.body.konfirmasi_meninggal,
            keterangan_konfirmasi: req.body.keterangan_konfirmasi
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
              res.status(500).send({
                error: err.message
              });
            });
        })
    })

}


//lower Case JSON
function keysToLowerCase(obj) {
  if (obj instanceof Array) {
    for (var i in obj) {
      obj[i] = keysToLowerCase(obj[i]);
    }
  }
  if (!typeof (obj) === "object" || typeof (obj) === "string" || typeof (obj) === "number" || typeof (obj) === "boolean") {
    return obj;
  }
  var keys = Object.keys(obj);
  var n = keys.length;
  var lowKey;
  while (n--) {
    var key = keys[n];
    if (key === (lowKey = key.toLowerCase()))
      continue;
    obj[lowKey] = keysToLowerCase(obj[key]);
    delete obj[key];
  }
  return (obj);
}
async function checkIfKecamatanExist(desa) {
  try {
    result = await kecamatanModels.find({ nama_kecamatan: desa.nama_kecamatan }).exec()
    if (result.length >= 1) return result
    else return false
  }
  catch(error){
    console.log(error)
  }
}
//Async function untuk tambahDesaCSV gk tau kenapa harus terpisah jdi biarin gini aja
async function mapAddDesa(jsonFile) {
  try {
    var desaTertambah = []
    var errors = []
    var results = [];
    var desaDitolak = [];
    const value = await Promise.all(jsonFile.map(desa => {
      var checking = checkIfKecamatanExist(desa)
      return checking.then((result) => {
        if (result.length >= 1) {
          desa.id_kecamatan = result[0]._id
          return desaModels.create(desa).then(result => {
            desaTertambah.push(result)
            results.desaDiterima = desaTertambah
            return results;
          })
            .catch(error => {
              errors.push(error)
              results.error = errors
              return results
            })
        }
        else {
          desaDitolak.push(desa)
          results.desaTidakAdaKecamatan = desaDitolak
          return results
        }
      })
    }))
    return value[0];
  }
  catch (error) {
    return error
  }
}
exports.tambahDesaCSV = function (req, res) {
  const jsonFile = keysToLowerCase(req.body);

  let value = mapAddDesa(jsonFile) //calling async function
  value.then(result => {
    if (result) {

      res.status(201).json({
        message: "desa baru telah ditambahkan",
        createdProduct: result.desaDiterima,
        rejectedProduct: result.desaTidakAdaKecamatan,
        errors: result.error
      })
    }
  })
  //(promises).then(function (result) { console.log("Disini") })
}


exports.updateDataDesa = function (req, res) {
  var idKecamatanBaru;
  const namaKecamatanBaru = req.body.nama_kecamatan_baru;
  const namaDesaYangInginDiganti = req.params.namaDesa;
  const namaDesaBaru = req.body.nama_desa_baru;
  const suspekBaru = req.body.suspek_baru;
  const dischardedBaru = req.body.discharded_baru;
  const meninggalBaru = req.body.meninggal_baru;
  const keteranganBaru = req.body.keterangan_baru;
  const konfirmasiSymptomatikBaru = req.body.konfirmasi_asymptomatik_baru;
  const konfirmasiAsymptomatikBaru = req.body.konfirmasi_symptomatik_baru;
  const konfirmasiSembuhBaru = req.body.konfirmasi_sembuh_baru;
  const konfirmasiMeninggalBaru = req.body.konfirmasi_meninggal_baru;
  const keteranganKonfirmasiBaru = req.body.keterangan_konfirmasi_baru

  //cek nama desa
  desaModels.find({ nama_desa: namaDesaYangInginDiganti })
    .exec()
    .then(resultPencarian => {
      if (resultPencarian.length < 1) return res.status(401).json({ message: "Nama desa tidak ditemukan" })
    })

  kecamatanModels.find({ nama_kecamatan: namaKecamatanBaru })
    .exec()
    .then(resultPencarian => {
      if (resultPencarian.length < 1) return res.status(401).json({ message: "Nama kecamatan pengganti tidak ditemukan" })
      idKecamatanBaru = resultPencarian[0]._id
      desaModels.findOneAndUpdate(
        { nama_desa: namaDesaYangInginDiganti },
        {
          $set: {
            nama_desa: namaDesaBaru,
            nama_kecamatan: namaKecamatanBaru,
            id_kecamatan: idKecamatanBaru,
            suspek: suspekBaru,
            discharded: dischardedBaru,
            meninggal: meninggalBaru,
            keterangan: keteranganBaru,
            konfirmasi_asymptomatik: konfirmasiAsymptomatikBaru,
            konfirmasi_symptomatik: konfirmasiSymptomatikBaru,
            konfirmasi_sembuh: konfirmasiSembuhBaru,
            konfirmasi_meninggal: konfirmasiMeninggalBaru,
            keterangan_konfirmasi: keteranganKonfirmasiBaru
          }
        },
        { upsert: false, omitUndefined: true }
      ).exec()
        .then(results => {
          if (results) {
            if (results.nama_desa == namaDesaBaru) {
              return res.status(201).json({
                message: "Data Desa " + results.nama_desa + " Telah diperbarui",
                updatedProduct: {
                  nama_desa: namaDesaBaru,
                  nama_kecamatan: namaKecamatanBaru,
                  id_kecamatan: idKecamatanBaru,
                  suspek: suspekBaru,
                  discharded: dischardedBaru,
                  meninggal: meninggalBaru,
                  keterangan: keteranganBaru,
                  konfirmasi_asymptomatik: konfirmasiAsymptomatikBaru,
                  konfirmasi_symptomatik: konfirmasiSymptomatikBaru,
                  konfirmasi_sembuh: konfirmasiSembuhBaru,
                  konfirmasi_meninggal: konfirmasiMeninggalBaru,
                  keterangan_konfirmasi: keteranganKonfirmasiBaru
                }
              });
            } else {
              return res.status(201).json({
                message: "Data Desa " + namaDesaYangInginDiganti + " telah diupdate dan namanya diganti menjadi " + namaDesaBaru,
                updatedProduct: {
                  nama_desa: namaDesaBaru,
                  nama_kecamatan: namaKecamatanBaru,
                  id_kecamatan: idKecamatanBaru,
                  suspek: suspekBaru,
                  discharded: dischardedBaru,
                  meninggal: meninggalBaru,
                  konfirmasi_asymptomatik: konfirmasiAsymptomatikBaru,
                  konfirmasi_symptomatik: konfirmasiSymptomatikBaru,
                  konfirmasi_sembuh: konfirmasiSembuhBaru,
                  konfirmasi_meninggal: konfirmasiMeninggalBaru
                }
              })
            }
          }
        })
        .catch(err => {
          return res.status(401).json({ message: "Gagal", error: err.message })
        })
    })


}


//Ambil data desa-desa yang ada pada kecamatan
exports.getDesaInKecamatan = function (req, res) {
  desaModels.find({ id_kecamatan: req.params.idKecamatan })
    .exec()
    .then(results => {
      const response = {
        semua_desa: results.map(result => {
          return {
            _id: result._id,
            nama_desa: result.nama_desa,
            id_kecamatan: result.id_kecamatan,
            nama_kecamatan: result.nama_kecamatan,
            suspek: result.suspek,
            discharded: result.discharded,
            meninggal: result.meninggal,
            keterangan: result.keterangan,
            konfirmasi_symptomatik: result.konfirmasi_symptomatik,
            konfirmasi_asymptomatik: result.konfirmasi_asymptomatik,
            konfirmasi_sembuh: result.konfirmasi_sembuh,
            konfirmasi_meninggal: result.konfirmasi_meninggal,
            keterangan_konfirmasi: result.keterangan_konfirmasi
          };
        })
      };
      res.status(201).json(response);
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).send({
        error: err.message
      });
    });
}


exports.deleteKecamatan = function (req, res) {
  desaModels.find({ id_kecamatan: req.params.idKecamatan })
    .exec()
    .then(results => {
      if (results.length > 0) return res.status(401).json({ message: "Terdapat " + results.length + " Desa dalam kecamatan tersebut" })

      var namaKecamatan;
      kecamatanModels.find({ _id: req.params.idKecamatan })
        .exec()
        .then(result => {
          if (result.length < 1) return res.status(401).json({ message: "Nama kecamatan tidak ditemukan!" })
          namaKecamatan = result[0].nama_kecamatan;
        })

      kecamatanModels.deleteOne({ _id: req.params.idKecamatan })
        .exec()
        .then(result => {
          return res.status(201).json({
            message: "Kecamatan " + namaKecamatan + " berhasil dihapus!"
          })
        })
        .catch(err => {
          return res.status(500).send({
            error: err.message
          })
        })
    })
}


exports.deleteDesa = function (req, res) {
  var namaDesa;
  desaModels.find({ _id: req.params.idDesa })
    .exec()
    .then(results => {
      if (results.length < 1) return res.status(401).json({ message: "nama desa tidak ditemukan" });

      namaDesa = results[0].nama_desa;
    })

  desaModels.deleteOne({ _id: req.params.idDesa })
    .exec()
    .then(result => {
      return res.status(201).json({ message: "Desa " + namaDesa + " berhasil dihapus" })
    })
    .catch(err => {
      res.status(500).send({
        error: err.message
      })
    })
}




exports.getSumDataKecamatan = function (req, res) {
  desaModels.find({ id_kecamatan: req.params.idKecamatan })
    .exec()
    .then(results => {
      const data = {
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
            keterangan: result.keterangan,
            konfirmasi_symptomatik: result.konfirmasi_symptomatik,
            konfirmasi_asymptomatik: result.konfirmasi_asymptomatik,
            konfirmasi_sembuh: result.konfirmasi_sembuh,
            konfirmasi_meninggal: result.konfirmasi_meninggal,
            keterangan_konfirmasi: result.keterangan_konfirmasi
          };
        })
      };
      var suspek = 0
      var discharded = 0
      var meninggal = 0
      var konfirmasiSymptomatik = 0
      var konfirmasiAsymptomatik = 0
      var konfirmasiSembuh = 0
      var konfirmasiMeninggal = 0
      let jumlahDesa = data.jumlah_desa_di_kecamatan
      for (var i = 0; i < jumlahDesa; i++) {
        suspek += data.semua_desa[i].suspek
      }
      for (var i = 0; i < jumlahDesa; i++) {
        discharded += data.semua_desa[i].discharded
      }
      for (var i = 0; i < jumlahDesa; i++) {
        meninggal += data.semua_desa[i].meninggal
      }
      for (var i = 0; i < jumlahDesa; i++) {
        konfirmasiAsymptomatik += data.semua_desa[i].konfirmasi_asymptomatik
      }
      for (var i = 0; i < jumlahDesa; i++) {
        konfirmasiSymptomatik += data.semua_desa[i].konfirmasi_symptomatik
      }
      for (var i = 0; i < jumlahDesa; i++) {
        konfirmasiSembuh += data.semua_desa[i].konfirmasi_sembuh
      }
      for (var i = 0; i < jumlahDesa; i++) {
        konfirmasiMeninggal += data.semua_desa[i].konfirmasi_meninggal
      }
      return res.status(201).json({
        nama_kecamatan: results[0].nama_kecamatan,
        id_kecamatan: results[0].id_kecamatan,
        suspek: suspek,
        discharded: discharded,
        meninggal: meninggal,
        konfirmasi_asymptomatik: konfirmasiAsymptomatik,
        konfirmasi_symptomatik: konfirmasiSymptomatik,
        konfirmasi_sembuh: konfirmasiSembuh,
        konfirmasi_meninggal: konfirmasiMeninggal
      })
    })
    .catch(err => {
      res.status(500).send({ error: err.message })
    })
}

exports.updateByURL = function (req, res) {

  var data = req.body
  const namaDesa = data.nama_desa;
  const suspekBaru = data.suspek;
  const dischardedBaru = data.discharded;
  const meninggalBaru = data.meninggal;
  const keteranganBaru = data.keterangan;
  const konfirmasiSymptomatikBaru = data.konfirmasi_symptomatik;
  const konfirmasiAsymptomatikBaru = data.konfirmasi_asymptomatik;
  const konfirmasiSembuhBaru = data.konfirmasi_sembuh;
  const konfirmasiMeninggalBaru = data.konfirmasi_meninggal;
  const keteranganKonfirmasiBaru = data.keterangan_konfirmasi

  //cek nama desa
  desaModels.find({ nama_desa: namaDesa })
    .exec()
    .then(resultPencarian => {
      if (resultPencarian.length < 1) return res.status(500).json({ message: "Nama desa tidak ditemukan" })
      console.log(namaDesa)
      desaModels.findOneAndUpdate(
        { nama_desa: namaDesa },
        {
          $set: {
            nama_desa: namaDesa,
            suspek: suspekBaru,
            discharded: dischardedBaru,
            meninggal: meninggalBaru,
            keterangan: keteranganBaru,
            konfirmasi_asymptomatik: konfirmasiAsymptomatikBaru,
            konfirmasi_symptomatik: konfirmasiSymptomatikBaru,
            konfirmasi_sembuh: konfirmasiSembuhBaru,
            konfirmasi_meninggal: konfirmasiMeninggalBaru,
            keterangan_konfirmasi: keteranganKonfirmasiBaru
          }
        },
        { upsert: false, omitUndefined: true }
      )
        .then(results => {
          if (results) {
            if (results.nama_desa == namaDesa) {
              return res.status(201).send({
                nama_desa: namaDesa,
                suspek: suspekBaru,
                discharded: dischardedBaru,
                meninggal: meninggalBaru,
                keterangan: keteranganBaru,
                konfirmasi_asymptomatik: konfirmasiAsymptomatikBaru,
                konfirmasi_symptomatik: konfirmasiSymptomatikBaru,
                konfirmasi_sembuh: konfirmasiSembuhBaru,
                konfirmasi_meninggal: konfirmasiMeninggalBaru,
                keterangan_konfirmasi: keteranganKonfirmasiBaru
              });
            }
          }
        })
        .catch(err => {
          console.log(err.message, "inikan?")
          return res.status(500).send({ message: "Gagal2", error: err.message })
        })
    })
    .catch(err => {
      return res.status(500).send({ message: "Gagal1", error: err.message })
    })

}