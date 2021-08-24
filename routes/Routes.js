const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/checkIfLogin');//belum ditambahin protected route
const multer = require('multer');


const proofStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/proofStorage');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});


const csvStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/csvStorage');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});


const uploadProof = multer({
  storage: proofStorage
});
const uploadCSV = multer({
  storage: csvStorage
});



//CONTROLLERS
const covid = require("../controller/covidController");
const account = require("../controller/accountController");
const report = require("../controller/laporanController");
const dataRS = require("../controller/dataRSController");
const testing = require("../controller/testController");

//COVID ROUTES
router.post("/covid/tambah-kecamatan",checkAuth, covid.tambahKecamatan); 
router.post("/covid/tambah-kecamatan-csv",checkAuth, covid.tambahKecamatanCSV); 
router.post("/covid/tambah-desa",checkAuth, covid.tambahDesa); 
router.post("/covid/tambah-desa-csv",checkAuth, covid.tambahDesaCSV); 
router.get("/covid/get-all-kecamatan", covid.getAllKecamatan); 
router.get("/covid/get-sum-data-kecamatan/:idKecamatan", covid.getSumDataKecamatan); 
router.get("/covid/get-one-kecamatan/:namaKecamatan", covid.getOneKecamatan); 
router.get("/covid/get-desa-in-kecamatan/:idKecamatan", covid.getDesaInKecamatan); 
router.put("/covid/edit-kecamatan/:namaKecamatan",checkAuth, covid.updateDataKecamatan)
router.put("/covid/edit-desa/:namaDesa",checkAuth, covid.updateDataDesa);
router.put("/covid/edit-desa-by-url",checkAuth, covid.updateByURL);
router.delete("/covid/delete-kecamatan/:idKecamatan",checkAuth, covid.deleteKecamatan);
router.delete("/covid/delete-desa/:idDesa",checkAuth, covid.deleteDesa);

//REPORT ROUTES
router.post("/report/submit-report",checkAuth, uploadProof.single('photo'), report.createReport)
router.get("/report/get-report/:reportId", report.getReport)
router.put("/report/confirm-report/:reportId", report.confirmReport)
router.get("/report/get-all-reports", report.getAllReports)
router.post("/report/post-photo",checkAuth, uploadProof.single('photo'), report.uploadPhoto)

//RS ROUTES
router.post("/data-rs/create-first", dataRS.createDataRS )
router.put("/data-rs/update-data",checkAuth, dataRS.updateDataRS )
router.get("/data-rs/get-data", dataRS.getDataRS )
router.get("/data-rs/get-one-data/:dataRSId", dataRS.getOneDataRS )
router.delete("/data-rs/delete-data/:dataRSId", dataRS.deleteData )

//ACCOUNT ROUTE
router.post("/account/register", account.register);
router.post("/account/login", account.login);

//TESTING ROUTES
router.get("/", testing.testLive);
router.get("/test/isLogin", checkAuth, testing.testIfLogin );

module.exports = router;
