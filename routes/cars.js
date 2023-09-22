const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");

router.post("/", carController.createCar);
router.get("/", carController.getCars);
router.get("/:carId", carController.getCarById);
router.put("/:carId", carController.updateCar);
router.delete("/:carId", carController.deleteCar);

module.exports = router;
