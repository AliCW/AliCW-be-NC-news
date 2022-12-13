const express = require("express");
const app = express();

const { 
    listArticles, 
    listTopics, 
    handle404Errors,
    findSpecificArticle 
} = require("./controllers/controller")


app.get("/api/topics", listTopics)

app.get("/api/articles", listArticles)

app.get("/api/articles/:article_id", findSpecificArticle)

app.all("/*", handle404Errors)

module.exports = app