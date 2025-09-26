const mongoose = require("mongoose");

const EspeciesSchema = new mongoose.Schema({
    name: { type : String, required: true },
    classification: String,
    designation: String,
    average_height: Number,
    average_lifespan: Number,
    eye_colors: String,
    hair_colors: String,
    skin_colors: String,
    language: String,
    homeworld: { type: mongoose.Schema.Types.ObjectId, ref: "Planeta" },

}, { timestamps: true });

module.exports = mongoose.model("Especie", EspeciesSchema); 