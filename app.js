const express = require("express");
const app = express();

const { listArticles, listTopics, handle404Errors } = require("./controllers/controller")


app.get("/api/topics", listTopics)

app.get("/api/articles", listArticles)

app.all("/*", handle404Errors)

module.exports = app