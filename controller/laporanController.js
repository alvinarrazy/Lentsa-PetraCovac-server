const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = require('../config')
const LaporanModels = require("../model/laporanModels")
const { google } = require('googleapis');
const fs = require('fs')
const path = require('path');
const userModels = require('../model/userModels');


const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});


exports.createReport = async function (req, res) {
  try {
    const filePath = path.join(req.file.path);
    if (filePath) {
      const photo = await drive.files.create({
        requestBody: {
          name: req.body.nik_pelapor + '--' + req.body.nama_pelapor + '--' + new Date().toISOString().replace(/:/g, '-') + '.jpg', //This can be name of your choice
          mimeType: 'image/jpg',
          parents: ['1SV1m53RGYIHPNKHais3s39nHjOJ0jnOE'] //folder foto laporan
        },
        media: {
          mimeType: 'image/jpg',
          body: fs.createReadStream(filePath),
        },
      });
      const fileId = photo.data.id
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
      const photoPath = await drive.files.get({
        fileId: fileId,
        fields: 'webContentLink',
      });
      let dataPelapor = await userModels.find({
        nomorIndukKependudukan: req.body.nik_pelapor,
        namaPanjang: req.body.nama_pelapor
      })
      console.log(dataPelapor)
      if (!dataPelapor || dataPelapor.length === 0) return res.status(404).send({ message: 'Data user tidak ditemukan' })
      console.log('disini')
      let newPost = new LaporanModels({
        nik_pelapor: req.body.nik_pelapor,
        nama_pelapor: req.body.nama_pelapor,
        laporan: req.body.laporan,
        email_pelapor: dataPelapor[0].email,
        jenisKelamin: dataPelapor[0].jenisKelamin,
        provinsiDiKTP: dataPelapor[0].provinsiDiKTP,
        kotaDiKTP: dataPelapor[0].kotaDiKTP,
        kecamatanDiKTP: dataPelapor[0].kecamatanDiKTP,
        kelurahanDiKTP: dataPelapor[0].kelurahanDiKTP,
        alamatDiKTP: dataPelapor[0].alamatDiKTP,
        provinsiDomisili: dataPelapor[0].provinsiDomisili,
        kotaDomisili: dataPelapor[0].kotaDomisili,
        kecamatanDomisili: dataPelapor[0].kecamatanDomisili,
        kelurahanDomisili: dataPelapor[0].kelurahanDomisili,
        alamatDomisili: dataPelapor[0].alamatDomisili,
        noTelp: dataPelapor[0].noTelp,
        keterangan: req.body.keterangan,
        photoId: fileId,
        viewPhotoURL: `https://drive.google.com/uc?export=view&id=${fileId}`,
        downloadPhotoURL: photoPath.data.webContentLink
      })
      newPost.save()
        .then(result => {
          console.log(result);
          return res.status(201).send({
            addedReport: {
              nik_pelapor: result.nik_pelapor,
              nama_pelapor: result.nama_pelapor,
              laporan: result.laporan,
              keterangan: result.keterangan,
              viewPhotoURL: result.viewPhotoURL,
              downloadPhotoURL: result.downloadPhotoURL
            }
          });
        })
        .catch(err => {
          console.log(err);
          return res.status(500).json({
            error: err.message
          });
        });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: error.message })
  }
}


exports.getAllReports = function (req, res) {
  LaporanModels.find()
    .then(docs => {
      const response = {
        count: docs.length,
        posts: docs.map(doc => {
          return {
            _id: doc._id,
            nik_pelapor: doc.nik_pelapor,
            nama_pelapor: doc.nama_pelapor,
            laporan: doc.laporan,
            photoId: doc.photoId,
            keterangan: doc.keterangan,
            email_pelapor: doc.email_pelapor,
            jenisKelamin: doc.jenisKelamin,
            viewPhotoURL: doc.viewPhotoURL,
            downloadPhotoURL: doc.downloadPhotoURL,
            provinsiDiKTP: doc.provinsiDiKTP,
            kotaDiKTP: doc.kotaDiKTP,
            kecamatanDiKTP: doc.kecamatanDiKTP,
            kelurahanDiKTP: doc.kelurahanDiKTP,
            alamatDiKTP: doc.alamatDiKTP,
            provinsiDomisili: doc.provinsiDomisili,
            kotaDomisili: doc.kotaDomisili,
            kecamatanDomisili: doc.kecamatanDomisili,
            kelurahanDomisili: doc.kelurahanDomisili,
            alamatDomisili: doc.alamatDomisili,
            noTelp: doc.noTelp,
            postedDate: doc.postedDate
          };
        })
      };
      if (docs.length >= 0) {
        console.log(response)
        return res.status(200).json(response);
      } else {
        res.status(404).json({
          message: 'No entries found'
        });
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        error: err.message
      });
    });
}

exports.getReport = function (req, res) {
  const id = req.params.reportId;
  LaporanModels.findById(id)
    .exec()
    .then(doc => {
      if (doc) {
        return res.status(200).json({
          _id: doc._id,
          nik_pelapor: doc.nik_pelapor,
          nama_pelapor: doc.nama_pelapor,
          email_pelapor: doc.email_pelapor,
          laporan: doc.laporan,
          photoId: doc.photoId,
          keterangan: doc.keterangan,
          viewPhotoURL: doc.viewPhotoURL,
          downloadPhotoURL: doc.downloadPhotoURL,
          jenisKelamin: doc.jenisKelamin,
          provinsiDiKTP: doc.provinsiDiKTP,
          kotaDiKTP: doc.kotaDiKTP,
          kecamatanDiKTP: doc.kecamatanDiKTP,
          kelurahanDiKTP: doc.kelurahanDiKTP,
          alamatDiKTP: doc.alamatDiKTP,
          provinsiDomisili: doc.provinsiDomisili,
          kotaDomisili: doc.kotaDomisili,
          kecamatanDomisili: doc.kecamatanDomisili,
          kelurahanDomisili: doc.kelurahanDomisili,
          alamatDomisili: doc.alamatDomisili,
          noTelp: doc.noTelp,
        });
      } else {
        return res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: err });
    });
}

exports.confirmReport = async function (req, res) {
  const id = req.params.reportId;
  const report = await LaporanModels.findById(id)
  let laporan = report.laporan
  let idPelapor = report.nik_pelapor

  LaporanModels.findByIdAndDelete(id)
    .exec()
    .then(async (doc) => {
      console.log(laporan)
      switch (laporan) {
        case 'Gejala':
          userModels.findOneAndUpdate({ nomorIndukKependudukan: idPelapor }, {
            statusCovid: laporan
          }).then(result => console.log(result)).catch(error => console.log(error.message))
          break
        case 'Positif':
          userModels.findOneAndUpdate({ nomorIndukKependudukan: idPelapor }, {
            statusCovid: laporan
          }).then(result => console.log(result)).catch(error => console.log(error.message))
          break
        case 'Sudah Sembuh':
          userModels.findOneAndUpdate({ nomorIndukKependudukan: idPelapor }, {
            statusCovid: laporan
          }).then(result => console.log(result)).catch(error => console.log(error.message))
          break
        case 'Sudah Vaksin 1 kali':
          userModels.findOneAndUpdate({ nomorIndukKependudukan: idPelapor }, {
            statusVaksin: laporan
          }).then(result => console.log(result)).catch(error => console.log(error.message))
          break
        case 'Sudah Vaksin 2 kali':
          userModels.findOneAndUpdate({ nomorIndukKependudukan: idPelapor }, {
            statusVaksin: laporan
          }).then(result => console.log(result)).catch(error => console.log(error.message))
          break
        case 'Sudah Vaksin 3 kali':
          userModels.findOneAndUpdate({ nomorIndukKependudukan: idPelapor }, {
            statusVaksin: laporan
          }).then(result => console.log(result)).catch(error => console.log(error.message))
        default:
      }
      const response = await drive.files.delete({
        fileId: report.photoId
      })
      if (doc && response) {
        return res.status(200).json({
          data: {
            doc,
            response
          }
        });
      } else {
        return res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: err });
    });
}

exports.deleteReport = async function (req, res) {
  try {
    const id = req.params.reportId;
    const report = await LaporanModels.findById(id)
    const deletedReport = await LaporanModels.findByIdAndDelete(id)
    const response = await drive.files.delete({
      fileId: report.photoId
    })
    console.log(deletedReport)
    if (deletedReport && response) return res.status(201).send({ deletedReport: deletedReport })
    else return res.status(404).send({ message: 'laporan tidak ditemukan' })
  } catch (error) {
    console.log(error.message)
    return res.status.send({ error: error.message })
  }
}

/*exports.findReports = async function (req, res){
  try {
    if(req.body.nomorIndukKependudukan && req.body.namaPanjang){
      let findResult = await userModels.find({
        "nomorIndukKependudukan": { "$regex": req.body.nomorIndukKependudukan, "$options": "i" },
        "namaPanjang":  { "$regex": req.body.namaPanjang, "$options": "i" }
      })
      if (findResult) return res.status(201).send(findResult)
      else res.status(404).send({ error: 'user not found' })
    }else if(req.body.nomorIndukKependudukan && !req.body.namaPanjang){
      let findResult = await userModels.find({
        "nomorIndukKependudukan": { "$regex": req.body.nomorIndukKependudukan, "$options": "i" }
      })
      if (findResult) return res.status(201).send(findResult)
      else res.status(404).send({ error: 'user not found' })
    }else{
      let findResult = await userModels.find({
        "namaPanjang":  { "$regex": req.body.namaPanjang, "$options": "i" }
      })
      if (findResult) return res.status(201).send(findResult)
      else res.status(404).send({ error: 'user not found' })
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ error: error.message })
  }
}
*/