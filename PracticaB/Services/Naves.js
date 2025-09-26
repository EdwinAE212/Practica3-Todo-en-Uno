const Nave = require("../Models/NavesModel");
const Personaje = require("../Models/PersonajesModel");

const Agregar = async (data) => new Nave(data).save();

const Editar = async (id, data) => {
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { mensaje: "No se encontró la nave espacial con ese ID" };
    }

    const result = await Nave.findByIdAndUpdate(id, data, { new: true, select: "-createdAt -updatedAt" });
    if (!result) {
        return { mensaje: "No se encontró la nave espacial con ese ID" };
    }
    return result;
};

const Eliminar = async (id) => {
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { mensaje: "No se encontró la nave espacial con ese ID" };
    }

    const result = await Nave.findByIdAndDelete(id);
    if (!result) {
        return { mensaje: "No se encontró la nave espacial con ese ID" };
    }
    return { message: "La nave espacial ha sido eliminada" };
};

async function ListaTodos(page, limit, search) {
    const skip = (page - 1) * limit;
    const query = search ? { name: new RegExp(search, "i") } : {};

    return await Nave.find(query)
        .skip(skip)
        .limit(limit)
}

async function Contar(search) {
    const query = search ? { name: new RegExp(search, "i") } : {};
    return await Nave.countDocuments(query);
}

const ListaPersonaje = async (name) => {
    const personaje = await Personaje.findOne({ 
        name: { $regex: name, $options: "i" } 
    }).populate({
        path: "starships",           
        select: "_id name"  
    });

    if (!personaje || !personaje.starships || personaje.starships.length === 0) {
        return { mensaje: "No se encontró ese personaje o no tiene naves espaciales asociadas, intente con otro nombre" };
    }

    return personaje.starships;
};

const BuscarPorId = async (id) => {
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { mensaje: "No se encontró la nave espacial con ese ID" };
    }

    const result = await Nave.findById(id, "-createdAt -updatedAt");
    if (!result) {
        return { mensaje: "No se encontró la nave espacial con ese ID" };
    }
    return result;
};


module.exports = { Agregar, Editar, Eliminar, ListaTodos, Contar, ListaPersonaje, BuscarPorId };