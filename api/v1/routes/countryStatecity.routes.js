const { getStatecontroller, getCitiesController } = require("../controllers/countryStateCity.controller");
const router = require("express").Router();
router.get("/get-state/:countryCode", getStatecontroller);
router.get("/get-cities/:countryCode/:stateCode", getCitiesController)
module.exports = router;