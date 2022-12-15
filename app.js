const express = require("express");
const app = express();

const { 
    listArticles, 
    listTopics, 
    findSpecificArticle,
    findArticleComments,
} = require("./controllers/controller")


app.get("/api/topics", listTopics)

app.get("/api/articles", listArticles)

app.get("/api/articles/:article_id", findSpecificArticle)

app.get("/api/articles/:article_id/comments", findArticleComments)

app.all("/*", (request, response, next) => {
  response.status(404).send({ msg: "404 - Not found" });
  next();
});

app.use((error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ msg: "400 - Bad request" });
  }
  else if (error.msg) {
    response.status(404).send({ msg: error.msg || "404 - Not found" })
  }
  else {
    console.log(error)
    response.status(500).send({ msg: "500 - Internal server error"})
  }
});

module.exports = app;
