const mongoose = require("mongoose");

const navesSquema = new mongoose.Schema({
    name: { type : String, required: true },
    model: { type : String, required: true },
    starship_class: String,
    length: Number,
    passengers: Number,
    max_atmosphering_speed: Number,
    hyperdrive_rating: String,
    MGLT: Number,
    cargo_capacity: Number,
    consumables: String,
    
}, { timestamps: true});

module.exports = mongoose.model("Nave", navesSquema);