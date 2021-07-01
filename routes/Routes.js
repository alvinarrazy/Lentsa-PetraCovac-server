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
router.post("/covid/tambah-desa", covid.tambahDesa); 
router.get("/covid/get-all-kecamatan", covid.getAllKecamatan); 
router.get("/covid/get-one-kecamatan/:namaKecamatan", covid.getOneKecamatan); 
router.get("/covid/get-desa-in-kecamatan/:idKecamatan", covid.getDesaInKecamatan); 

//ACCOUNT ROUTE
router.post("/admin/register", account.registerAdmin);
router.post("/admin/login", account.loginAdmin);

//TESTING ROUTES
router.get("/", testing.testLive);
router.get("/test/isAdminLogin", checkAuthAdmin, testing.testIfAdminLogin );

module.exports = router;
