const express = require("express");
const app = express();

const { 
    listArticles, 
    listTopics, 
    findSpecificArticle 
} = require("./controllers/controller")


app.get("/api/topics", listTopics)

app.get("/api/articles", listArticles)

app.get("/api/articles/:article_id", findSpecificArticle)

app.all("/*", (request, response, next) => {
  response.status(404).send({ msg: "404 - Not found" });
  next();
});

app.use((error, request, response, next) => {
  if (error.msg === "404 - No rows found") {
    response.status(404).send({ msg: "404 - Not found" });
  }
  next();
});

module.exports = app;
