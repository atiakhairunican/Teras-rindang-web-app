/* eslint-disable no-undef */
const express = require("express")
const router = express.Router()
const control = require("../Controllers/product")
const validate = require("../middleware/validate")
const upload = require("../middleware/multer")
const cache = require("../middleware/cache")

router.get("/commit", control.commit)
router.get("/drop", control.drop)
router.get("/name", control.search)
router.get("/", validate(["admin", "customer"]), cache, control.get)
router.get("/searchAll/orderedAll", validate(["admin", "customer"]), control.orderedAll)
router.get("/search/ordered", validate(["admin", "customer"]), control.ordered)
router.post("/", validate(["admin"]), upload.single('image'), control.add)
router.put("/", validate(["admin"]), upload.single('image'), control.update)
router.delete("/del", validate(["admin"]), control.del)

module.exports = router