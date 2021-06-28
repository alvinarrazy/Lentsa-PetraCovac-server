const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');//belum ditambahin protected route
const multer = require('multer');

const profilePicStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './imageUploads/profilePic');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const uploadRegistration = multer({
  storage: profilePicStorage
});


//CONTROLLERS
const account = require("../controller/accountController");
const post = require("../controller/postController");

//NAMA ROUTER HARUS SESUAI DENGAN ISI TYPES DI FRONT END
//ACCOUNT
router.post("/register", uploadRegistration.single('profilePic'),  account.register);//upload.single("harus sama dengan name di frontend")
router.post("/login", account.login)


//POST
// router.post("/post/add-post", upload.single('image'), post.createPost);
router.get("/post/getcard", post.getAllPost);
router.get("/post/getcard/:postId", post.getCard); 


//TESTING
// router.get("/tes", tes.test);

//Contoh
// router.get("/test",todoController.test);
// router.post("/create", todoController.create);
// router.get("/", todoController.todoShow);
// router.get("/:id", todoController.todoDetails);
// router.put("/:id/update",todoController.todoUpdate);
// router.delete("/:id/delete",todoController.todoDelete);


module.exports = router;
