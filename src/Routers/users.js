/* eslint-disable no-undef */
const express = require("express")
const router = express.Router()
const control = require("../Controllers/users")
const validate = require("../middleware/validate")

router.get("/commit", control.commit)
router.get("/drop", control.drop)
router.get("/", validate(["admin"]), control.getAll)
router.post("/", control.add)
router.put("/", validate(["admin"]), control.update)
router.delete("/del", validate(["admin"]), control.del)

module.exports = router