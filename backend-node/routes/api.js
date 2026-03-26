const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");

router.post("/decide", controller.decide);
router.post("/train", controller.train);

module.exports = router;