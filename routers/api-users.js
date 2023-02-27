const { 
    listUsers,
    findUser,
    userSignup,
    userLogin,
 } = require("../controllers/controller")
const express = require("express")
const usersRouter = express.Router()

usersRouter.get("/", listUsers)

usersRouter.get("/:username", findUser)

usersRouter.post("/signup", userSignup)

usersRouter.post("/login", userLogin)

module.exports = { usersRouter }