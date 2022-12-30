const { 
    deleteCommentById,
    alterCommentVotes,
 } = require("../controllers/controller")
const express = require("express")
const commentsRouter = express.Router()

commentsRouter.patch("/:comment_id", alterCommentVotes)

commentsRouter.delete("/:comment_id", deleteCommentById)

module.exports = { commentsRouter }