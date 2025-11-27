const router = require("express").Router();
const {
  getUserSamplesController,
} = require("../controllers/samples.controller");

router.get("/list-user-samples", getUserSamplesController);
module.exports = router;
