import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Menu from './Components/Menu'
import PersonajesComp from './Components/PersonajesComp'
import PeliculasComp from './Components/PeliculasComp'
import EspeciesComp from './Components/EspeciesComp'
import PlanetasComp from './Components/PlanetasComp'
import NavesComp from './Components/NavesComp'
import VehiculosComp from './Components/VehiculosComp'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex bg-[D8D7D533]">
        <Menu />

        <div className="flex-1 p-6 ml-16">
          <div className="w-full mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/personajes" replace />} />
              <Route path="/personajes" element={<PersonajesComp />} />
              <Route path="/peliculas" element={<PeliculasComp />} />
              <Route path="/especies" element={<EspeciesComp />} />
              <Route path="/planetas" element={<PlanetasComp />} />
              <Route path="/naves" element={<NavesComp />} />
              <Route path="/vehiculos" element={<VehiculosComp />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App