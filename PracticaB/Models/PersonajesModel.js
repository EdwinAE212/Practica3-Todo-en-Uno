const mongoose = require("mongoose");

const PersonajeSchema = new mongoose.Schema({
    name : { type : String, required: true },
    birth_year : String,
    eye_color : String,
    gender : String,
    hair_color : String,
    height : Number,
    mass : Number,
    skin_color : String,
    films : [{ type: mongoose.Schema.Types.ObjectId, ref: "Pelicula" }],
    homeworld: { type: mongoose.Schema.Types.ObjectId, ref: "Planeta" },
    species : [{ type: mongoose.Schema.Types.ObjectId, ref: "Especie" }],
    starships : [{ type: mongoose.Schema.Types.ObjectId, ref: "Nave" }],
    vehicles : [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehiculo" }]

}, { timestamps: true });

module.exports = mongoose.model("Personaje", PersonajeSchema);