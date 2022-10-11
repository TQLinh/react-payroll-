import mysql from "mysql2/promise";
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "payroll",
});
export const connection2 = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "nodejsbasic",
});
// connection.execute(
//   `CREATE TABLE stafflist (
// id INT(10) AUTO_INCREMENT PRIMARY KEY,
// fullname VARCHAR(30) ,
// basicsalary int ,
// overtimesalary int,
// insurance int,
// responsibilityallowance int,
// lunchallowance int,
// gasolineallowance int,
// workday int,
// advance int,
// )`
// );
// simple query

export default connection;
