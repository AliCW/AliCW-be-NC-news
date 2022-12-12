const express = require("express");
const app = express();

const { listTopics, handle404Errors } = require("./controllers/controller")


app.use(express.json());

app.get("/api/topics", listTopics)

app.all("/*", handle404Errors)

module.exports = app