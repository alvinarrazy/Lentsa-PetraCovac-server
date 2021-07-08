const express = require("express");
const router = express.Router();
const checkAuthAdmin = require('../middleware/checkIfAdminLogin');//belum ditambahin protected route
const multer = require('multer');

//CONTROLLERS
const covid = require("../controller/covidController");
const account = require("../controller/accountController");
const testing = require("../controller/testController");

//COVID ROUTES
router.post("/covid/tambah-kecamatan", covid.tambahKecamatan); 
router.post("/covid/tambah-kecamatan-csv", covid.tambahKecamatanCSV); 
router.post("/covid/tambah-desa", covid.tambahDesa); 
router.post("/covid/tambah-desa-csv", covid.tambahDesaCSV); 
router.get("/covid/get-all-kecamatan", covid.getAllKecamatan); 
router.get("/covid/get-sum-data-kecamatan/:idKecamatan", covid.getSumDataKecamatan); 
router.get("/covid/get-one-kecamatan/:namaKecamatan", covid.getOneKecamatan); 
router.get("/covid/get-desa-in-kecamatan/:idKecamatan", covid.getDesaInKecamatan); 
router.put("/covid/edit-kecamatan/:namaKecamatan", covid.updateDataKecamatan)
router.put("/covid/edit-desa/:namaDesa", covid.updateDataDesa);
router.put("/covid/update-from-url", covid.updateDataFromURL);
router.delete("/covid/delete-kecamatan/:idKecamatan", covid.deleteKecamatan);
router.delete("/covid/delete-desa/:idDesa", covid.deleteDesa);

//ACCOUNT ROUTE
router.post("/admin/register", account.registerAdmin);
router.post("/admin/login", account.loginAdmin);

//TESTING ROUTES
router.get("/", testing.testLive);
router.get("/test/isAdminLogin", checkAuthAdmin, testing.testIfAdminLogin );

module.exports = router;
