const Vehiculo = require("../Models/VehiculosModel");
const Personaje = require("../Models/PersonajesModel");

const Agregar = async (data) => new Vehiculo(data).save();

const Editar = async (id, data) => {
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { mensaje: "No se encontró el vehiculo con ese ID" };
    }

    const result = await Vehiculo.findByIdAndUpdate(id, data, { new: true, select: "-createdAt -updatedAt" });
    if (!result) {
        return { mensaje: "No se encontró el vehiculo con ese ID" };
    }
    return result;
};

const Eliminar = async (id) => {
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { mensaje: "No se encontró el vehiculo con ese ID" };
    }

    const result = await Vehiculo.findByIdAndDelete(id);
    if (!result) {
        return { mensaje: "No se encontró el vehiculo con ese ID" };
    }
    return { message: "El vehiculo ha sido eliminado" };
};

async function ListaTodos(page, limit, search) {
    const skip = (page - 1) * limit;
    const query = search ? { name: new RegExp(search, "i") } : {};

    return await Vehiculo.find(query)
        .skip(skip)
        .limit(limit)
}

async function Contar(search) {
    const query = search ? { name: new RegExp(search, "i") } : {};
    return await Vehiculo.countDocuments(query);
}

const ListaPersonaje = async (name) => {
    const personaje = await Personaje.findOne({ 
        name: { $regex: name, $options: "i" } 
    }).populate({
        path: "vehicles",           
        select: "_id name"  
    });

    if (!personaje || !personaje.vehicles || personaje.vehicles.length === 0) {
        return { mensaje: "No se encontró ese personaje o no tiene vehiculos asociados, intente con otro nombre" };
    }

    return personaje.vehicles;
};

const BuscarPorId = async (id) => {
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { mensaje: "No se encontró el vehiculo con ese ID" };
    }

    const result = await Vehiculo.findById(id, "-createdAt -updatedAt");
    if (!result) {
        return { mensaje: "No se encontró el vehiculo con ese ID" };
    }
    return result;
};

module.exports = { Agregar, Editar, Eliminar, ListaTodos, Contar, ListaPersonaje, BuscarPorId };