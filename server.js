//Applying static files to the router (routing file)

//imports
require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const cookeiParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

//Homebrew middlewares imports
const { logger } = require("./middleware/logEvent");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");

//Middleware

app.use(express.json());
app.use(cookeiParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(logger);
app.use(errorHandler);
app.use(cors(corsOptions));

//Routes
// app.use("/subdir", require("./routes/subdir"));
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/cars", require("./routes/cars"));

app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else req.accepts("txt");
  {
    res.type({ error: "404 Not Found" });
  }
});

//port definition

const logEvents = require("./middleware/logEvent");
const EventEmitter = require("events");

class TheEmitter extends EventEmitter {}
const emitter = new TheEmitter();

emitter.on("log", (msg) => logEvents(msg));

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  emitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");

  const extension = path.extname(req.url);

  let contentType;

  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;

    default:
      contentType = "text/html";
      break;
  }

  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "view", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "view", req.url, "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "view", req.url)
      : path.join(__dirname, req.url);

  const serverFile = async (filePath, contentType, response) => {
    try {
      const rewData = await fsPromises.readFile(
        filePath,
        !contentType.includes("image") ? "utf8" : ""
      );
      const data =
        contentType === "application/json" ? JSON.parse(rewData) : rewData;
      response.writeHead(filePath.includes("404.html") ? 404 : 200, {
        "Content-Type": contentType,
      });
      response.end(
        contentType === "application/json" ? JSON.stringify(data) : data
      );
    } catch (err) {
      console.log(err);
      emitter.emit("log", `${err.name}: ${err.message}`, "errLog.txt");
      response.statusCode = 500;
      response.end();
    }
  };

  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    serverFile(filePath, contentType, res);
  } else {
    switch (path.parse(filePath).base) {
      case "old-page.html":
        res.writeHead(301, { Location: "/new-page.html" });
        res.end();
        break;
      case "www-page.html":
        res.writeHead(301, { Location: "/" });
        res.end();
        break;
      default:
        serverFile(path.join(__dirname, "view", "404.html"), "text/html", res);
    }
  }
});

const PORT = process.env.PORT || 3500;

connectDB();

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`App running on port ${PORT}`));
});
