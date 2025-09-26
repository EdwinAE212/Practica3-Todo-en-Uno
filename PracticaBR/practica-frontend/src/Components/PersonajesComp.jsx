import React, { useEffect, useState } from "react";
import axios from "axios";
import { getPersonajes } from "../Services/PersonajesServ";
import PersonajeModal from "../Modals/PersonajeModal";
import Toast from "../Components/Toast";
import ConfirmarEliminar from "../Modals/ConfirmarEliminar";

import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

function PersonajesComp() {
  const [personajes, setPersonajes] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [totalRegistros, setTotalRegistros] = useState(0);
  const [totalFiltrados, setTotalFiltrados] = useState(0);

  const registrosPorPagina = 10;
  const [busqueda, setBusqueda] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalModo, setModalModo] = useState("agregar");
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
  const [confirmarVisible, setConfirmarVisible] = useState(false);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    tipo: "success",
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const mostrarToast = (message, tipo = "success") => {
    setToast({ visible: true, message, tipo });
  };

  const cargarPagina = async (page, query = "") => {
    try {
      const res = await getPersonajes(page, registrosPorPagina, query);

      setPersonajes(Array.isArray(res.data) ? res.data : []);

      setPagina(res.page || page);
      setTotalPaginas(res.totalPages || 1);

      setTotalFiltrados(res.total ?? 0);

      if (res.totalGeneral !== undefined) {
        setTotalRegistros(res.totalGeneral);
      } else {
        if (!query) {
          setTotalRegistros(res.total ?? 0);
        } else {
          try {
            const resGlobal = await getPersonajes(1, 1, "");
            setTotalRegistros(resGlobal.total ?? 0);
          } catch (err) {
            console.error("Error obteniendo total global:", err);
            setTotalRegistros(0);
          }
        }
      }
    } catch (error) {
      console.error("Error al cargar los personajes", error);
      mostrarToast("Error al cargar personajes", "error");
    }
  };

  const guardarPersonaje = async (valores) => {
    try {
      if (valores._id) {
        await axios.put(`${API_BASE_URL}/personajes/${valores._id}`, valores);
        mostrarToast("Personaje editado con éxito", "success");
      } else {
        await axios.post(`${API_BASE_URL}/personajes`, valores);
        mostrarToast("Personaje agregado con éxito", "success");
      }
      setModalVisible(false);
      cargarPagina(pagina, busqueda);
    } catch (error) {
      console.error("Error guardando personaje", error);
      mostrarToast("Error al guardar registro", "error");
    }
  };

  useEffect(() => {
    cargarPagina(pagina, busqueda);
  }, [pagina, busqueda]);

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPagina(1);
  };

  const handleEliminarClick = (personaje) => {
    setPersonajeSeleccionado(personaje);
    setConfirmarVisible(true);
  };

  const eliminarPersonaje = async () => {
    try {
      await axios.delete(
        `${API_BASE_URL}/personajes/${personajeSeleccionado._id}`
      );
      mostrarToast("Personaje eliminado con éxito", "success");
      setConfirmarVisible(false);
      cargarPagina(pagina, busqueda);
    } catch (error) {
      console.error("Error eliminando personaje", error);
      mostrarToast("Error al eliminar personaje", "error");
    }
  };

  const paginasVisibles = [];
  if (totalPaginas <= 3) {
    for (let i = 1; i <= totalPaginas; i++) {
      paginasVisibles.push(i);
    }
  } else {
    if (pagina === 1) {
      paginasVisibles.push(1, 2, 3);
    } else if (pagina === totalPaginas) {
      paginasVisibles.push(totalPaginas - 2, totalPaginas - 1, totalPaginas);
    } else {
      paginasVisibles.push(pagina - 1, pagina, pagina + 1);
    }
  }

  return (
    <div className="p-6 w-full bg-gradient-to-b bg-[D8D7D533]">
      <div className="bg-white rounded-2xl shadow-md shadow-gray-300 mb-6 p-6 flex justify-between items-center border border-gray-200 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <UserGroupIcon className="w-9 h-9 text-blue-800" />
          <h1 className="text-3xl font-bold text-blue-800 tracking-tight">
            Personajes
          </h1>
        </div>
        <button
          className="flex items-center gap-2 px-5 py-2 bg-blue-100 text-blue-800 font-medium rounded-4xl hover:bg-blue-200 shadow-md transition cursor-pointer"
          onClick={() => {
            setModalModo("agregar");
            setPersonajeSeleccionado(null);
            setModalVisible(true);
          }}
        >
          <PlusIcon className="w-6 h-6" />
          Agregar Registro
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-md shadow-gray-300 p-6 border border-gray-200 w-full max-w-7xl mx-auto">
        <div className="flex justify-end mb-4">
          <div className="relative w-80">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar personaje..."
              value={busqueda}
              onChange={handleBusqueda}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="table-auto w-full rounded-2xl overflow-hidden border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-[18px] font-semibold align-middle">
                <th className="px-4 py-3 h-12 whitespace-nowrap align-middle bg-[#384CB4] text-white rounded-tl-xl rounded-bl-xl">
                  No.
                </th>
                <th className="px-4 py-3 h-12 whitespace-nowrap align-middle bg-[#384CB4] text-white">
                  Nombre
                </th>
                <th className="px-4 py-3 h-12 whitespace-nowrap align-middle bg-[#384CB4] text-white">
                  Año de Nacimiento
                </th>
                <th className="px-4 py-3 h-12 whitespace-nowrap align-middle bg-[#384CB4] text-white">
                  Color de ojos
                </th>
                <th className="px-4 py-3 h-12 whitespace-nowrap align-middle bg-[#384CB4] text-white">
                  Género
                </th>
                <th className="px-4 py-3 h-12 whitespace-nowrap align-middle bg-[#384CB4] text-white">
                  Altura
                </th>
                <th className="px-4 py-3 h-12 whitespace-nowrap align-middle bg-[#384CB4] text-white">
                  Masa
                </th>
                <th className="px-4 py-3 h-12 whitespace-nowrap align-middle bg-[#384CB4] text-white">
                  Piel
                </th>
                <th className="px-4 py-3 h-12 whitespace-nowrap align-middle bg-[#384CB4] text-white">
                  Color de pelo
                </th>
                <th className="px-4 py-3 h-12 whitespace-nowrap align-middle bg-[#384CB4] text-white rounded-tr-xl rounded-br-xl">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="min-h-[560px] align-top">
              {personajes.length > 0 ? (
                personajes.map((p, index) => (
                  <tr
                    key={p._id}
                    className="border-b hover:bg-gray-50 transition text-gray-800"
                  >
                    <td className="px-4 py-3 text-center">
                      {(pagina - 1) * registrosPorPagina + index + 1}
                    </td>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{p.birth_year}</td>
                    <td className="px-4 py-3">{p.eye_color}</td>
                    <td className="px-4 py-3">{p.gender}</td>
                    <td className="px-4 py-3">{p.hair_color}</td>
                    <td className="px-4 py-3">{p.height}</td>
                    <td className="px-4 py-3">{p.mass}</td>
                    <td className="px-4 py-3">{p.skin_color}</td>
                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <button
                        className="w-[28px] h-[27px] bg-[#EAEEFE] rounded-lg hover:bg-blue-200 transition cursor-pointer flex items-center justify-center"
                        onClick={() => {
                          setModalModo("ver");
                          setPersonajeSeleccionado(p);
                          setModalVisible(true);
                        }}
                      >
                        <EyeIcon className="w-4 h-4 text-[#4F68F3]" />
                      </button>
                      <button
                        className="w-[28px] h-[27px] bg-[#EEEDF9] rounded-lg hover:bg-purple-200 transition cursor-pointer flex items-center justify-center"
                        onClick={() => {
                          setModalModo("editar");
                          setPersonajeSeleccionado(p);
                          setModalVisible(true);
                        }}
                      >
                        <PencilIcon className="w-4 h-4 text-[#6454C8]" />
                      </button>
                      <button
                        className="w-[28px] h-[27px] bg-[#FFBBAC] rounded-lg hover:bg-red-300 transition cursor-pointer flex items-center justify-center"
                        onClick={() => handleEliminarClick(p)}
                      >
                        <TrashIcon className="w-4 h-4 text-[#FC4828]" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-6 text-[#D8D7D5] font-bold text-[46px]"
                  >
                    No existen registros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-[#DDDFE1] font-medium">
            {totalFiltrados} de {totalRegistros}
          </div>

          <div className="flex items-center bg-gray-200 rounded-4xl shadow border border-gray-300 px-2">
            <button
              onClick={() => setPagina(1)}
              disabled={pagina === 1}
              className="p-2 rounded-l-4xl transition hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer"
            >
              <ChevronDoubleLeftIcon className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={() => setPagina(pagina - 1)}
              disabled={pagina === 1}
              className="p-2 transition hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
            </button>

            {paginasVisibles.map((num) => (
              <button
                key={num}
                onClick={() => setPagina(num)}
                className={`mx-1 px-3 py-1 rounded-lg cursor-pointer font-medium transition ${
                  num === pagina
                    ? "bg-[#6454C8] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-300"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setPagina(pagina + 1)}
              disabled={pagina === totalPaginas}
              className="p-2 transition hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={() => setPagina(totalPaginas)}
              disabled={pagina === totalPaginas}
              className="p-2 rounded-r-4xl transition hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer"
            >
              <ChevronDoubleRightIcon className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      <PersonajeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onGuardar={guardarPersonaje}
        personaje={personajeSeleccionado}
        modo={modalModo}
      />

      {confirmarVisible && (
        <ConfirmarEliminar
          personaje={personajeSeleccionado}
          onClose={() => setConfirmarVisible(false)}
          onConfirm={eliminarPersonaje}
        />
      )}

      {toast.visible && (
        <Toast
          message={toast.message}
          tipo={toast.tipo}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
    </div>
  );
}

export default PersonajesComp;