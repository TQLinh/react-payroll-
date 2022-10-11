import path from "path";
import express from "express";
import multer from "multer";
import {
  createImg,
  createNewUser,
  deleteUser,
  getAllUsers,
  getListImg,
  getUser,
  updateUser,
} from "../controller/apiController";
let router = express.Router();
import appRoot from "app-root-path";
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, appRoot + "/src/public/image/");
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const imageFilter = function (req, file, cb) {
//   if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
//     req.fileValidationError = "Only image files are allowed!";
//     return cb(new Error("Only image files are allowed!"), false);
//   }
//   cb(null, true);
// };
// let upload = multer({ storage: storage, fileFilter: imageFilter });
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, appRoot + "/src/public/image/");
  },
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
});
const initApiRoute = (app) => {
  router.get("/users", getAllUsers);
  router.post("/users", createNewUser);
  router.put("/users/:id", updateUser);
  router.delete("/users/:id", deleteUser);
  router.get("/img", getListImg);
  router.post("/upload", upload.single("img"), createImg);
  router.get("/user", getUser);
  return app.use("/api/v1", router);
};

export default initApiRoute;
