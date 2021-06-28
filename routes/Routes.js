const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');//belum ditambahin protected route
const multer = require('multer');

//CONTROLLERS
const covid = require("../controller/covidController");

//COVID ROUTES
router.post("/covid/tambah-kecamatan", covid.tambahKecamatan); 
router.post("/covid/tambah-desa", covid.tambahDesa); 


module.exports = router;
