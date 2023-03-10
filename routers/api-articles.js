const express = require("express")
const articlesRouter = express.Router()

const { 
    listArticles,
    findSpecificArticle,
    findArticleComments,
    postArticleComment,
    addVotesToArticle,
    postArticle,
    deleteArticleById,
 } = require("../controllers/controller")

 articlesRouter.get("/", listArticles)

 articlesRouter.get("/:article_id", findSpecificArticle)

 articlesRouter.get("/:article_id/comments", findArticleComments)

 articlesRouter.post("/:article_id/comments", postArticleComment)

 articlesRouter.post("/", postArticle)

 articlesRouter.patch("/:article_id", addVotesToArticle)

 articlesRouter.delete("/:article_id", deleteArticleById)

module.exports = { articlesRouter }