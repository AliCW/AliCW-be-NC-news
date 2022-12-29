const express = require("express")
const { listEndpoints } = require("../controllers/controller")
const apiRouter = express.Router()

const { topicsRouter } = require("./api-topics")
const { articlesRouter } = require("./api-articles")
const { usersRouter } = require("./api-users")
const { commentsRouter } = require("./api-comments")

apiRouter.get("/", listEndpoints)

apiRouter.use("/topics", topicsRouter)

apiRouter.use("/articles", articlesRouter)

apiRouter.use("/users", usersRouter)

apiRouter.use("/comments", commentsRouter)

module.exports = { apiRouter };