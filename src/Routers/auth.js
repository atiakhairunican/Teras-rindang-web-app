/* eslint-disable no-undef */
const express = require("express")
const router = express.Router()
const control = require("../Controllers/auth")

router.post("/", control.login)

module.exports = router