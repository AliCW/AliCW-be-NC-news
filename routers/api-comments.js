const { deleteCommentById } = require("../controllers/controller")
const express = require("express")
const commentsRouter = express.Router()

commentsRouter.delete("/:comment_id", deleteCommentById)

module.exports = { commentsRouter }