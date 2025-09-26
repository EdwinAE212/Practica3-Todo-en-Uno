const mongoose = require("mongoose");

const PeliculasSquema = new mongoose.Schema({
    title : { type : String, required: true },
    director : { type : String, required: true },
    producer : { type : String, required: true }
    
}, { timestamps: true});

module.exports = mongoose.model("Pelicula", PeliculasSquema);