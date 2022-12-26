const express = require("express");
const app = express();

const { 
    listArticles, 
    listTopics, 
    findSpecificArticle,
    findArticleComments,
    postArticleComment,
    addVotesToArticle,
    listUsers,
    deleteCommentById,
} = require("./controllers/controller")

app.use(express.json());

app.get("/api/topics", listTopics)

app.get("/api/articles", listArticles)

app.get("/api/articles/:article_id", findSpecificArticle)

app.get("/api/articles/:article_id/comments", findArticleComments)

app.get("/api/users", listUsers)

app.post("/api/articles/:article_id/comments", postArticleComment)

app.patch("/api/articles/:article_id", addVotesToArticle)

app.delete("/api/comments/:comment_id", deleteCommentById)


app.all("/*", (request, response, next) => {
  response.status(404).send({ msg: "404 - Not found" });
  next();
});

app.use((error, request, response, next) => {
  if (
    error.code === "22P02" ||
    error.code === "23502" ||
    error.code === "23503" ||
    error.code === "42601"
  ) {
    response.status(400).send({ msg: "400 - Bad request" });
  } else if (error.code === "42703" || error.msg) {
    response.status(404).send({ msg: error.msg || "404 - Not found" });
  } else {
    console.log(error);
    response.status(500).send({ msg: "500 - Internal server error" });
  }
});

module.exports = app;


