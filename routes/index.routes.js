const router = require("express").Router()

// Routes index
router.use("/", require("./base.routes"))
router.use("/", require("./auth.routes"))
router.use("/housing", require("./housing.routes"))
router.use("/places", require("./places.routes"))
router.use("/user", require("./user.routes"))
router.use("/reviews", require("./comment.routes"))


module.exports = router