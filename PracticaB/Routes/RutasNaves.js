const express = require('express');
const router = express.Router();
const NaveServ = require('../Services/Naves')

router.post("/", async (req, res) => { 
    try {
        res.json(await NaveServ.Agregar(req.body));
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        res.json(await NaveServ.Editar(req.params.id, req.body));
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        res.json(await NaveServ.Eliminar(req.params.id));
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.get("/", async (req, res) => { 
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let search = req.query.search || "";

        const total = await NaveServ.Contar(search);
        const lista = await NaveServ.ListaTodos(page, limit, search);
        const totalGeneral = await NaveServ.Contar("");

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
        res.json(await NaveServ.ListaPersonaje(name));
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        res.json(await NaveServ.BuscarPorId(req.params.id));
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

module.exports = router;