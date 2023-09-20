const Car = require("../model/Cars");

//function for create car post

const createCar = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      carClass,
      location,
      transmission,
      postedBy,
      description,
      price,
    } = req.body;

    const newCar = new Car({
      make,
      model,
      year,
      carClass,
      location,
      transmission,
      postedBy,
      description,
      price,
    });

    // Если есть файл изображения, сохраняем его путь в объект машины
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map((file) => file.path);
      newCar.imageUrl = imageUrls;
    }

    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (err) {
    console.error("Error in createCar:", err);
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

const getCarById = async (req, res) => {
  try {
    const carId = req.params.carId;
    const car = await Car.findById(carId); //searching car

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

//function for update

const updateCar = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      carClass,
      location,
      transmision,
      imageUrl,
      postedBy,
    } = req.body;
    const carId = req.params.carId;

    if (!carId) {
      return res.status(400).json({ error: "Invalid carId" });
    }

    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      { make, model, year, carClass, location, transmision, imageUrl },
      { new: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(updatedCar);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteCar = async (req, res) => {
  try {
    const carId = req.params.carId;
    const deletedCar = await Car.findByIdAndDelete(carId);
    if (!deletedCar) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json({ message: "Car removed" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createCar, getCars, updateCar, deleteCar, getCarById };
