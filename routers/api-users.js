const { 
    listUsers,
    findUser,
    userSignup,
 } = require("../controllers/controller")
const express = require("express")
const usersRouter = express.Router()

usersRouter.get("/", listUsers)

usersRouter.get("/:username", findUser)

usersRouter.post("/signup", userSignup)

module.exports = { usersRouter }