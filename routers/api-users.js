const { listUsers } = require("../controllers/controller")
const express = require("express")
const usersRouter = express.Router()

usersRouter.get("/", listUsers)

module.exports = { usersRouter }