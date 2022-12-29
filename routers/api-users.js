const { 
    listUsers,
    findUser,
 } = require("../controllers/controller")
const express = require("express")
const usersRouter = express.Router()

usersRouter.get("/", listUsers)

usersRouter.get("/:username", findUser)

module.exports = { usersRouter }