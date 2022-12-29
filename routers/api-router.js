const express = require("express")
const { listEndpoints } = require("../controllers/controller")
const apiRouter = express.Router()

const { topicsRouter,
 } = require("./api-topics")

apiRouter.get("/", listEndpoints)

apiRouter.use("/topics", topicsRouter)

module.exports = { apiRouter };