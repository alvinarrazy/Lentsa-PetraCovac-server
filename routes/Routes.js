const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');//belum ditambahin protected route
const multer = require('multer');

//CONTROLLERS
const covid = require("../controller/covidController");
const testing = require("../controller/testController");

//COVID ROUTES
router.post("/covid/tambah-kecamatan", covid.tambahKecamatan); 
router.post("/covid/tambah-desa", covid.tambahDesa); 
router.get("/covid/get-all-kecamatan", covid.getAllKecamatan); 
router.get("/covid/get-one-kecamatan/:namaKecamatan", covid.getOneKecamatan); 
router.get("/covid/get-desa-in-kecamatan/:idKecamatan", covid.getDesaInKecamatan); 


router.get("/", testing.test)

module.exports = router;
