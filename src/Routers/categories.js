/* eslint-disable no-undef */
const express = require("express")
const router = express.Router()
const control = require("../Controllers/categories")

router.get("/commit", control.commit)
router.get("/drop", control.drop)
router.get("/", control.get)
router.post("/", control.add)
router.put("/", control.update)
router.delete("/del", control.del)

module.exports = router