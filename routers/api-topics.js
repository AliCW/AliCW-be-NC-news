const { listTopics,
        postTopic

} = require("../controllers/controller")
const express = require("express")
const topicsRouter = express.Router();

topicsRouter.get("/", listTopics)

topicsRouter.post("/", postTopic)

module.exports = { topicsRouter }



