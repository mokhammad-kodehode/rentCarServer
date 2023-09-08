const Car = require("../model/Cars");

//function for create car post

const createCar = async (req, res) => {
  try {
    const { make, model, year } = req.body;
    const newCar = new Car({
      make,
      model,
      year,
      postedBy: req.user._id,
    });
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

//function for show list of cars

const getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

//function for update

const updateCar = async (req, res) => {
  try {
    const { make, model, year } = req.body;
    const carId = req.params.carId;
    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      { make, model, year },
      { new: true }
    );
    if (!updatedCar) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const deleteCar = async (req, res) => {
  try {
    const carId = req.params.carId;
    const deletedCar = await Car.findByIdAndUpdate(carId);
    if (!deletedCar) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json({ message: "Car removed" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createCar, getCars, updateCar, deleteCar };
