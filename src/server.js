// const http = require("http");
// // server ảo http
// const server = http.createServer((req, res) => {
//   console.log("run request ... response");
//   res.setHeader("Content-Type", "text/html");
//   res.write("<h3>Hello world! </h3>");
//   res.write("<h2>Linh Tran base nodejs1 </h2>");
//   res.end();
// });

// server.listen(8080, "localhost", () => {
//   console.log("Node.JS server is running on port: 8080");
// });
// const path = require("path");

// app.use((req, res, next) => {
//   console.log("run middleware >>>>:");
//   console.log(req.method);
//   next();
// });
// app.use(morgan("combined"));
import express from "express";
import "dotenv/config";
import configViewEngine from "./config/viewEngive";
import { initWebRouter } from "./route/web";
import bodyParser from "body-parser";
import initApiRoute from "./route/api";
var cors = require("cors");
import morgan from "morgan";
import { Server } from "socket.io";
import http from "http";

const server = http.createServer(app);
const app = express();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
  },
});

const port = process.env.POST || 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
initWebRouter(app);
configViewEngine(app);
initApiRoute(app);
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});
io.on("connection", (socket) => {
  console.log("socket: ", socket.id);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
