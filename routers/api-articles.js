const express = require("express")
const articlesRouter = express.Router()

const { 
    listArticles,
    findSpecificArticle,
    findArticleComments,
    postArticleComment,
    addVotesToArticle,
 } = require("../controllers/controller")

 articlesRouter.get("/", listArticles)

 articlesRouter.get("/:article_id", findSpecificArticle)

 articlesRouter.get("/:article_id/comments", findArticleComments)

 articlesRouter.post("/:article_id/comments", postArticleComment)

 articlesRouter.patch("/:article_id", addVotesToArticle)

module.exports = { articlesRouter }