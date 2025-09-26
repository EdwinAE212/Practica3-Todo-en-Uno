const Especie = require("../Models/EspeciesModel");
const Personaje = require("../Models/PersonajesModel");

const Agregar = async (data) => new Especie(data).save();

const Editar = async (id, data) => {
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { mensaje: "No se encontró la especie con ese ID" };
    }

    const result = await Especie.findByIdAndUpdate(id, data, { new: true, select: "-createdAt -updatedAt" });
    if (!result) {
        return { mensaje: "No se encontró la especie con ese ID" };
    }
    return result;
};

const Eliminar = async (id) => {
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { mensaje: "No se encontró la especie con ese ID" };
    }

    const result = await Especie.findByIdAndDelete(id);
    if (!result) {
        return { mensaje: "No se encontró la especie con ese ID" };
    }
    return { message: "La especie ha sido eliminada" };
};

async function ListaTodos(page, limit, search) {
    const skip = (page - 1) * limit;
    const query = search ? { name: new RegExp(search, "i") } : {};

    return await Especie.find(query)
        .skip(skip)
        .limit(limit)
        .populate("homeworld", "name");
}

async function Contar(search) {
    const query = search ? { name: new RegExp(search, "i") } : {};
    return await Especie.countDocuments(query);
}

const ListaPersonaje = async (name) => {
    const personaje = await Personaje.findOne({ 
        name: { $regex: name, $options: "i" } 
    }).populate({
        path: "species",           
        select: "_id name"  
    });

    if (!personaje || !personaje.species || personaje.species.length === 0) {
        return { mensaje: "No se encontró ese personaje o no tiene una especie asociadas, intente con otro nombre" };
    }

    return personaje.species;
};

const BuscarPorId = async (id) => {
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { mensaje: "No se encontró la especie con ese ID" };
    }

    const result = await Especie.findById(id, "-createdAt -updatedAt")
        .populate("homeworld", "name"); // <-- agrega el populate aquí
    if (!result) {
        return { mensaje: "No se encontró la especie con ese ID" };
    }
    return result;
};

module.exports = { Agregar, Editar, Eliminar, ListaTodos, Contar, ListaPersonaje, BuscarPorId };