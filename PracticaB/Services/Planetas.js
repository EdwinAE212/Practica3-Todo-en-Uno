const Planeta = require("../Models/PlanetasModel");
const Personaje = require("../Models/PersonajesModel");

const Agregar = async (data) => new Planeta(data).save();

const Editar = async (id, data) => {
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { mensaje: "No se encontró el planeta con ese ID" };
    }

    const result = await Planeta.findByIdAndUpdate(id, data, { new: true, select: "-createdAt -updatedAt" });
    if (!result) {
        return { mensaje: "No se encontró el planeta con ese ID" };
    }
    return result;
};

const Eliminar = async (id) => {
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { mensaje: "No se encontró el planeta con ese ID" };
    }

    const result = await Planeta.findByIdAndDelete(id);
    if (!result) {
        return { mensaje: "No se encontró el planeta con ese ID" };
    }
    return { message: "El planeta ha sido eliminado" };
};

async function ListaTodos(page, limit, search) {
    const skip = (page - 1) * limit;
    const query = search ? { name: new RegExp(search, "i") } : {};

    return await Planeta.find(query)
        .skip(skip)
        .limit(limit);
}

async function Contar(search) {
    const query = search ? { name: new RegExp(search, "i") } : {};
    return await Planeta.countDocuments(query);
}

const ListaPersonaje = async (name) => {
    const personaje = await Personaje.findOne({ 
        name: { $regex: name, $options: "i" } 
    }).populate({
        path: "homeworld",           
        select: "_id name"  
    });

    if (!personaje || !personaje.homeworld || personaje.homeworld.length === 0) {
        return { mensaje: "No se encontró ese personaje o no tiene un planeta asociado, intente con otro nombre" };
    }

    return personaje.homeworld;
};

const BuscarPorId = async (id) => {
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { mensaje: "No se encontró el planeta con ese ID" };
    }

    const result = await Planeta.findById(id, "-createdAt -updatedAt");
    if (!result) {
        return { mensaje: "No se encontró el planeta con ese ID" };
    }
    return result;
};

module.exports = { Agregar, Editar, Eliminar, ListaTodos, Contar, ListaPersonaje, BuscarPorId };