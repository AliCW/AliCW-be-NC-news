const { listTopics } = require("../controllers/controller")
const express = require("express")
const topicsRouter = express.Router();

topicsRouter.get("/", listTopics)

module.exports = { topicsRouter }



