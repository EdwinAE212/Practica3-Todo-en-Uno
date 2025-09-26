const mongoose = require("mongoose");

const PlanetasSchema = new mongoose.Schema({
    name: { type : String, required: true },
    diameter: Number,
    rotation_period: Number,
    orbital_period: Number,
    gravity: String,
    population: Number,
    climate: String,
    terrain: String,
    surface_water: Number

}, { timestamps: true });

module.exports = mongoose.model("Planeta", PlanetasSchema);