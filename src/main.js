/* eslint-disable no-undef */
const express = require("express")
const router  = express.Router()
const product = require("./Routers/product")
const history = require("./Routers/history")
const users = require("./Routers/users")
const auth = require("./Routers/auth")
const categories = require("./Routers/categories")
const {cloudinaryConfig} = require("./Configs/cloudinary")

router.use("*", cloudinaryConfig)
router.use("/product", product)
router.use("/history", history)
router.use("/users", users)
router.use("/auth", auth)
router.use("/categories", categories)

module.exports = router