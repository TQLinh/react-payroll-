import express from "express";
import multer from "multer";
import path from "path";
import {
  homePage,
  getDetailPage,
  createNewUser,
  deleteUser,
  editUser,
  updateUser,
  handleUploadFile,
  getUploadFilePage,
  handleUploadMultipleFiles,
} from "../controller/homeController";
var appRoot = require("app-root-path");
let router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, appRoot + "/src/public/image/");
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter });
let uploadMultipleFiles = multer({
  storage: storage,
  fileFilter: imageFilter,
}).array("multiple_images", 3);
const initWebRouter = (app) => {
  // app.METHOD(PATH, HANDLE);
  router.get("/", homePage);
  router.get("/detail/user/:userId", getDetailPage);
  router.post("/create-new-user", createNewUser);
  router.post("/delete-user", deleteUser);
  router.get("/edit-user/:userId", editUser);
  router.post("/update-user", updateUser);
  router.get("/upload", getUploadFilePage);
  router.post(
    "/upload-profile-pic",
    upload.single("profile_pic"),
    handleUploadFile
  );
  router.post(
    "/upload-multiple-images",
    (req, res, next) => {
      uploadMultipleFiles(req, res, (err) => {
        if (
          err instanceof multer.MulterError &&
          err.code === "LIMIT_UNEXPECTED_FILE"
        ) {
          // handle multer file limit error here
          res.send("LIMIT_UNEXPECTED_FILE");
        } else if (err) {
          res.send(err);
        } else {
          // make sure to call next() if all was well
          next();
        }
      });
    },
    handleUploadMultipleFiles
  );

  // router.get("/hi", (req, res) => {
  //   res.send("hi everyone:)");
  // });
  return app.use("/", router);
};
export { initWebRouter };
