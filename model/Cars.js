const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
  make: {
    type: String,
    require: true,
  },
  model: {
    type: String,
    require: true,
  },
  year: {
    type: Number,
    require: true,
  },
  class: {
    type: Number,
    require: true,
  },
  location: {
    type: Number,
    require: true,
  },
  Engine: {
    type: Number,
    require: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
