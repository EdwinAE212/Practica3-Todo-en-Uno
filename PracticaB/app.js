const express = require('express');
const cors = require("cors");
const conectarbd = require('./conexion');
require('dotenv').config();

const PeliculaRutas = require("./Routes/RutasPeliculas");
const PlanetaRutas = require("./Routes/RutasPlanetas");
const EspecieRutas = require("./Routes/RutasEspecies");
const NaveRutas = require("./Routes/RutasNaves");
const VehiculoRutas = require("./Routes/RutasVehiculos");
const PersonajeRutas = require("./Routes/RutasPersonajes");

const app = express();
app.use(express.json());
app.use(cors());

conectarbd();

app.use("/peliculas", PeliculaRutas);
app.use("/planetas", PlanetaRutas);
app.use("/especies", EspecieRutas);
app.use("/naves", NaveRutas);
app.use("/vehiculos", VehiculoRutas);
app.use("/personajes", PersonajeRutas);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
})