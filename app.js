const express = require("express");
const app = express();
const cors = require('cors');

const {
  apiRouter,
} = require("./routers/api-router")

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter)
                              
app.all("/*", (request, response, next) => {
  response.status(404).send({ msg: "404 - Not found" });
  next();
});

app.use((error, request, response, next) => {
  if (error.msg === "401 - Unauthorized"){
    response.status(401).send({ msg: "401 - Unauthorized"}) 
  }
  else if (
    error.code === "22P02" ||
    error.code === "23502" ||
    error.code === "23503" ||
    error.code === "42601"
  ) {
    response.status(400).send({ msg: "400 - Bad request" });
  } else if (error.code === "42703" || error.msg) {
    response.status(404).send({ msg: error.msg || "404 - Not found" });
  } else if (error.code === "23505" || error.msg) {
    response.status(409).send({ body: "409 - Conflict"})
  }
  else {
    console.log(error);
    response.status(500).send({ msg: "500 - Internal server error" });
  }
});

module.exports = app;


