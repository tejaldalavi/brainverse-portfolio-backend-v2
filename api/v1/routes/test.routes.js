const TestService = require("../services/test.service");
const router = require('express').Router();
router.get("/test", TestService);
module.exports = router;