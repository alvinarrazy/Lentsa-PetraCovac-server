const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/checkIfLogin');//belum ditambahin protected route
const multer = require('multer');

//CONTROLLERS
const covid = require("../controller/covidController");
const account = require("../controller/accountController");
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

//ACCOUNT ROUTE
router.post("/account/register", account.register);
router.post("/account/login", account.login);

//TESTING ROUTES
router.get("/", testing.testLive);
router.get("/test/isLogin", checkAuth, testing.testIfLogin );

module.exports = router;
