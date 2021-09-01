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
    if(filePath){
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
      let newPost = new LaporanModels({
        nik_pelapor: req.body.nik_pelapor,
        nama_pelapor: req.body.nama_pelapor,
        laporan: req.body.laporan,
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

exports.uploadPhoto = async function (req, res) {

}


exports.getAllReports = function (req, res) {
  LaporanModels.find()
    .select("nik_pelapor nama_pelapor laporan keterangan viewPhotoURL downloadPhotoURL photoId")//sesuai sama model
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
            viewPhotoURL: doc.viewPhotoURL,
            downloadPhotoURL: doc.downloadPhotoURL
          };
        })
      };
      if (docs.length >= 0) {
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
    .select('nik_pelapor nama_pelapor laporan keterangan viewPhotoURL downloadPhotoURL photoId')
    .exec()
    .then(doc => {
      if (doc) {
        return res.status(200).json({
          _id: doc._id,
          nik_pelapor: doc.nik_pelapor,
          nama_pelapor: doc.nama_pelapor,
          laporan: doc.laporan,
          photoId: doc.photoId,
          keterangan: doc.keterangan,
          viewPhotoURL: doc.viewPhotoURL,
          downloadPhotoURL: doc.downloadPhotoURL
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
    .then( async (doc) => {
      console.log(laporan)
      switch(laporan){
        case 'Gejala':
          userModels.findOneAndUpdate({nomorIndukKependudukan: idPelapor}, {
            statusCovid: laporan
          }).then(result=> console.log(result)).catch(error => console.log(error.message))
          break
        case 'Positif':
          userModels.findOneAndUpdate({nomorIndukKependudukan: idPelapor}, {
            statusCovid: laporan
          }).then(result=> console.log(result)).catch(error => console.log(error.message))
          break
        case 'Sudah Sembuh':
          userModels.findOneAndUpdate({nomorIndukKependudukan: idPelapor}, {
            statusCovid: laporan
          }).then(result=> console.log(result)).catch(error => console.log(error.message))
          break
        case 'Sudah Vaksin 1 kali':
          userModels.findOneAndUpdate({nomorIndukKependudukan: idPelapor}, {
            statusVaksin: laporan
          }).then(result=> console.log(result)).catch(error => console.log(error.message))
          break
        case 'Sudah Vaksin 2 kali':
          userModels.findOneAndUpdate({nomorIndukKependudukan: idPelapor}, {
            statusVaksin: laporan
          }).then(result=> console.log(result)).catch(error => console.log(error.message))
          break
        case 'Sudah Vaksin 3 kali':
          userModels.findOneAndUpdate({nomorIndukKependudukan: idPelapor}, {
            statusVaksin: laporan
          }).then(result=> console.log(result)).catch(error => console.log(error.message))
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