const express = require("express");
const router = express.Router();
const { getUserById } = require("../../controllers/userIdController");

// Маршрут для получения данных о пользователе по _id
router.get("/:id", getUserById);

module.exports = router;
