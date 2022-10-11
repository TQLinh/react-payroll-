import multer from "multer";
import pool, { connection2 } from "../config/connectDB";
let upload = multer().single("image");
const createNewUser = async (req, res) => {
  // let image = "";
  // upload(req, res, async function (err) {
  // if (req.fileValidationError) {
  //   return res.status(200).json({
  //     message: "ok",
  //     image: req.fileValidationError,
  //   });
  // } else if (!req.file) {
  //   return res.status(200).json({
  //     message: "please select file img",
  //   });
  // }
  // if (req.fileValidationError) {
  //   return res.send(req.fileValidationError);
  // } else if (!req.file) {
  //   return res.status(200).json({
  //     message: "please select file img",
  //   });
  // }
  // image = req.file.filename;
  // console.log("image: ", image);
  try {
    let {
      fullname,
      basicsalary,
      overtimesalary,
      insurance,
      responsibilityallowance,
      lunchallowance,
      gasolineallowance,
      workday,
      advance,
      ngaytangca,
    } = req.body;
    if (
      !fullname ||
      !basicsalary ||
      !overtimesalary ||
      !insurance ||
      !responsibilityallowance ||
      !lunchallowance ||
      !gasolineallowance ||
      !workday ||
      !advance
    ) {
      return res.status(200).json({
        message: "error",
      });
    }
    // let img = avatar;
    // img = image;
    await pool.execute(
      `INSERT INTO stafflist(fullname, basicsalary, overtimesalary, insurance, responsibilityallowance, lunchallowance, gasolineallowance, workday, advance,ngaytangca) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        fullname,
        basicsalary,
        overtimesalary,
        insurance,
        responsibilityallowance,
        lunchallowance,
        gasolineallowance,
        workday,
        advance,
        ngaytangca,
      ]
    );
    return res.status(200).json({
      message: "ok",
    });
  } catch (error) {
    console.log("error: ", error);
  }
  // });
};
const updateUser = async (rep, res) => {
  const {
    fullname,
    basicsalary,
    overtimesalary,
    insurance,
    responsibilityallowance,
    lunchallowance,
    gasolineallowance,
    workday,
    advance,
    ngaytangca,
  } = rep.body;
  const id2 = rep.params.id;
  if (
    !fullname ||
    !basicsalary ||
    !overtimesalary ||
    !insurance ||
    !responsibilityallowance ||
    !lunchallowance ||
    !gasolineallowance ||
    !workday ||
    !advance ||
    !ngaytangca
  ) {
    return res.status(200).json({
      message: "error",
    });
  }
  await pool.execute(
    `update stafflist set fullname = ?, basicsalary = ?, overtimesalary = ?,insurance = ?,responsibilityallowance = ?,lunchallowance = ?,gasolineallowance = ?, workday = ?,advance=?, ngaytangca=? where id = ?;`,
    [
      fullname,
      basicsalary,
      overtimesalary,
      insurance,
      responsibilityallowance,
      lunchallowance,
      gasolineallowance,
      workday,
      advance,
      ngaytangca,
      id2,
    ]
  );
  return res.status(200).json({
    message: "ok",
  });
};

const deleteUser = async (rep, res) => {
  const id = rep.params.id;
  if (!id) {
    return res.status(200).json({
      message: "error",
    });
  }
  await pool.execute(`DELETE FROM stafflist where id = ?;`, [id]);
  return res.status(200).json({
    message: "ok",
  });
};

const getAllUsers = async (req, res) => {
  const page = req.query.page;
  const PAGE_SIZE = req.query.limit || 6;
  const skip = Number((page - 1) * PAGE_SIZE);
  const search = req.query.search;
  // console.log("search: ", search);
  if (page) {
    const [rows, fields] = await pool.execute(
      `select * from stafflist Orders limit ? , ? ; `,
      [skip, PAGE_SIZE]
    );
    return res.status(200).json({
      message: "ok",
      data: rows,
    });
  } else {
    if (search) {
      // SELECT * FROM users WHERE lastName like "%?%" and firstName like "%?%"
      // const searchData = new RegExp(search, "i");
      const [rows, fields] = await pool.execute(
        `SELECT * FROM stafflist WHERE fullname like '%${search}%' `
        // [search]
      );
      return res.status(200).json({
        message: "ok1",
        data: rows,
      });
    }
    const [rows, fields] = await pool.execute("SELECT * FROM `stafflist`");
    return res.status(200).json({
      message: "ok",
      data: rows,
    });
  }
};

const getListImg = async (req, res) => {
  try {
    const [rows, fields] = await connection2.execute(
      "SELECT * FROM `listimg` ;"
    );
    return res.status(200).json({
      message: "ok",
      data: rows,
    });
  } catch (error) {
    console.log("error: ", error);
  }
};

const createImg = async (req, res) => {
  const img = `http://localhost:8080/image/${req.file.filename}`;
  console.log("img: ", img);
  if (!img) {
    return res.status(200).json({
      message: "plese enter all",
    });
  }
  upload(req, res, async function (err) {
    try {
      await connection2.execute(`INSERT INTO listimg(img) VALUES(?);`, [img]);
      return res.status(200).json({
        message: "add img successfly",
        data: `${img}`,
      });
    } catch (error) {
      return res.status(200).json({
        message: `${error}`,
      });
    }
  });
};

const getUser = async (req, res) => {
  try {
    const [rows] = await pool.execute(`SELECT * FROM user `);
    return res.status(200).json({
      message: "list user",
      data: rows,
    });
  } catch (error) {
    console.log("error: ", error);
  }
};
export {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getListImg,
  createImg,
  getUser,
};
