const Personaje = require("../Models/PersonajesModel");
const mongoose = require("mongoose");

const Agregar = async (data) => new Personaje(data).save();

const Editar = async (id, data) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { mensaje: "No se encontró el personaje con ese ID" };
    }

    const result = await Personaje.findByIdAndUpdate(id, data, { new: true, select: "-createdAt -updatedAt" })
        .populate("films", "title")
        .populate("homeworld", "name")
        .populate("species", "name")
        .populate("starships", "name")
        .populate("vehicles", "name");

    if (!result) {
        return { mensaje: "No se encontró el personaje con ese ID" };
    }
    return result;
};

const Eliminar = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { mensaje: "No se encontró el personaje con ese ID" };
    }

    const result = await Personaje.findByIdAndDelete(id);
    if (!result) {
        return { mensaje: "No se encontró el personaje con ese ID" };
    }
    return { message: "El personaje ha sido eliminado" };
};

async function ListaTodos(page, limit, search) {
    const skip = (page - 1) * limit;
    const query = search ? { name: new RegExp(search, "i") } : {};

    return await Personaje.find(query)
        .skip(skip)
        .limit(limit)
        .populate("films", "title")
        .populate("homeworld", "name")
        .populate("species", "name")
        .populate("starships", "name")
        .populate("vehicles", "name");
}

async function Contar(search) {
    const query = search ? { name: new RegExp(search, "i") } : {};
    return await Personaje.countDocuments(query);
}

const BuscarNombre = async (name) => {
    const resultados = await Personaje.find({ name: new RegExp(name, "i") }, "-createdAt -updatedAt")
        .populate("films", "title")
        .populate("homeworld", "name")
        .populate("species", "name")
        .populate("starships", "name")
        .populate("vehicles", "name");

    if (!resultados || resultados.length === 0) {
        return { mensaje: "No se encontraron personajes con ese nombre" };
    }

    return resultados;
};

const BuscarPorId = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { mensaje: "No se encontró el personaje con ese ID" };
    }

    const result = await Personaje.findById(id, "-createdAt -updatedAt")
        .populate("films", "title")
        .populate("homeworld", "name")
        .populate("species", "name")
        .populate("starships", "name")
        .populate("vehicles", "name");

    if (!result) {
        return { mensaje: "No se encontró el personaje con ese ID" };
    }
    return result;
};

module.exports = { Agregar, Editar, Eliminar, ListaTodos, BuscarNombre, BuscarPorId, Contar };