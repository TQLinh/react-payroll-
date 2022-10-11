import multer from "multer";
import { connection2 as connection } from "../config/connectDB";
// import path from "path";
let homePage = async (rep, res) => {
  // let data = [];
  // connection.query("SELECT * FROM `users`", function (err, results, fields) {
  //   results.map((row) => {
  //     data.push({
  //       id: row.id,
  //       firstName: row.firstName,
  //       lastName: row.lastName,
  //       email: row.email,
  //       address: row.address,
  //     });
  //   });
  // });
  const [rows, fields] = await connection.execute("SELECT * FROM `users`");
  return res.render("index.ejs", { dataUser: rows });
};

let getDetailPage = async (rep, res) => {
  let userId = rep.params.userId;
  let user = await connection.execute(`select * from users where id = ?`, [
    userId,
  ]);
  console.log("user: ", user);
  return res.send(JSON.stringify(user[0]));
};

let createNewUser = async (rep, res) => {
  // console.log("res: ", rep.body);
  let { firstname, lastname, email, address } = rep.body;
  await connection.execute(
    `INSERT INTO users(firstname, lastname, email, address)
VALUES (?,?,?,?)`,
    [firstname, lastname, email, address]
  );
  return res.redirect("/");
};
let deleteUser = async (rep, res) => {
  const { userId } = rep.body;
  // DELETE FROM table_name WHERE condition;
  await connection.execute(`DELETE FROM users where id = ? `, [userId]);
  return res.redirect("/");
};

let editUser = async (rep, res) => {
  const userId = rep.params.userId;
  const [user] = await connection.execute(`select * from users where id =? `, [
    userId,
  ]);
  return res.render("updateUser.ejs", { dataUser: user[0] });
};
let updateUser = async (rep, res) => {
  const { firstName, lastName, email, address, userId } = rep.body;
  await connection.execute(
    `update users set firstName = ?, lastName = ?, email = ?, address = ? where id = ?;`,
    [firstName, lastName, email, address, userId]
  );
  return res.redirect("/");
};
let getUploadFilePage = async (req, res) => {
  return res.render("uploadFile.ejs");
};
let upload = multer().single("profile_pic");
let handleUploadFile = (req, res) => {
  upload(req, res, function (err) {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send("Please select an image to upload");
    }
    //  else if (err instanceof multer.MulterError) {
    //   return res.send(err);
    // } else if (err) {
    //   return res.send(err);
    // }
    res.send(
      `You have uploaded this image: <hr/><img src="/image/${req.file.filename}" width="200"><hr /><a href="/upload">Upload another image</a>`
    );
  });
};
let handleUploadMultipleFiles = async (req, res) => {
  if (req.fileValidationError) {
    return res.send(req.fileValidationError);
  } else if (!req.files) {
    return res.send("Please select an image to upload");
  }

  let result = "You have uploaded these images: <hr />";
  const files = req.files;
  let index, len;

  // Loop through all the uploaded images and display them on frontend
  for (index = 0, len = files.length; index < len; ++index) {
    result += `<img src="/image/${files[index].filename}" width="300" style="margin-right: 20px;">`;
  }
  result += '<hr/><a href="/upload">Upload more images</a>';
  res.send(result);
};
export {
  homePage,
  getDetailPage,
  createNewUser,
  deleteUser,
  editUser,
  updateUser,
  getUploadFilePage,
  handleUploadFile,
  handleUploadMultipleFiles,
};
