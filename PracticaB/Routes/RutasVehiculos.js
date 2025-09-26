const express = require('express');
const router = express.Router();
const VehiculoServ = require('../Services/Vehiculos')

router.post("/", async (req, res) => { 
    try {
        res.json(await VehiculoServ.Agregar(req.body));
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        res.json(await VehiculoServ.Editar(req.params.id, req.body));
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        res.json(await VehiculoServ.Eliminar(req.params.id));
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.get("/", async (req, res) => { 
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        const total = await VehiculoServ.Contar(search);
        const lista = await VehiculoServ.ListaTodos(page, limit, search);
        const totalGeneral = await VehiculoServ.Contar("");


        res.json({
            page,
            limit,
            total,
            totalGeneral,
            totalPages: Math.ceil(total / limit),
            data: lista
        });
    } catch (e) { 
        res.status(400).json({ error: e.message });
    } 
});

router.get("/personaje/:name", async (req, res) => {
    try {
    let name = req.params.name;
        
        if (!name || typeof name !== "string") {
            return res.status(400).json({ mensaje: "Debes proporcionar un nombre válido" });
        }

        name = name.trim();
        name = decodeURIComponent(name);
        res.json(await VehiculoServ.ListaPersonaje(name));
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        res.json(await VehiculoServ.BuscarPorId(req.params.id));
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

module.exports = router;