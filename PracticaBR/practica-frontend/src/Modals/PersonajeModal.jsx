import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import { XMarkIcon, UserIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Listbox } from "@headlessui/react";

import { getPeliculas } from "../Services/PeliculasServ";
import { getNaves } from "../Services/NavesServ";
import { getVehiculos } from "../Services/VehiculosServ";
import { getEspecies } from "../Services/EspeciesServ";
import { getPlanetas } from "../Services/PlanetasServ";

const PersonajeModal = ({ visible, onClose, onGuardar, personaje = {}, modo = "agregar" }) => {
  const [loading, setLoading] = useState(false);
  const [peliculas, setPeliculas] = useState([]);
  const [naves, setNaves] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [especies, setEspecies] = useState([]);
  const [planetas, setPlanetas] = useState([]);

  const getAllPaginated = async (getFunc) => {
    let all = [];
    let page = 1;
    let res;
    do {
      res = await getFunc(page, 100);
      all = all.concat(res.data || []);
      page++;
    } while (res.data && res.data.length > 0);
    return all;
  };

  useEffect(() => {
    if (visible) {
      getAllPaginated(getPeliculas).then(setPeliculas);
      getAllPaginated(getNaves).then(setNaves);
      getAllPaginated(getVehiculos).then(setVehiculos);
      getAllPaginated(getEspecies).then(setEspecies);
      getAllPaginated(getPlanetas).then(setPlanetas);
    }
  }, [visible]);

  if (!visible) return null;

  const validationSchema = Yup.object({
    name: Yup.string().required("Campo obligatorio"),
  });

  const initialValues = {
    name: personaje?.name || "",
    birth_year: personaje?.birth_year || "",
    gender: personaje?.gender || "",
    hair_color: personaje?.hair_color || "",
    height: personaje?.height || "",
    mass: personaje?.mass || "",
    skin_color: personaje?.skin_color || "",
    eye_color: personaje?.eye_color || "",
    films: personaje?.films?.map((f) => f._id) || [],
    homeworld: personaje?.homeworld?._id || "",
    species: personaje?.species?.map((s) => s._id) || [],
    starships: personaje?.starships?.map((s) => s._id) || [],
    vehicles: personaje?.vehicles?.map((v) => v._id) || [],
  };

  const Chips = ({ items, onRemove, options }) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((id) => {
        const obj = options.find((o) => o._id === id);
        if (!obj) return null;
        return (
          <span
            key={id}
            className="bg-[#384CB4]/20 text-[#384CB4] px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium transition-colors hover:bg-[#384CB4]/40"
          >
            {obj.name || obj.title}
            {modo !== "ver" && (
              <button
                type="button"
                className="text-gray-500 hover:text-red-500"
                onClick={() => onRemove(id)}
              >
                <XMarkIcon className="w-4 h-4 cursor-pointer transition-colors" />
              </button>
            )}
          </span>
        );
      })}
    </div>
  );

  const MultiSelectListbox = ({ label, name, options, values, setFieldValue }) => {
    const handleAdd = (id) => {
      if (!values[name].includes(id)) {
        setFieldValue(name, [...values[name], id]);
      }
    };

    const handleRemove = (id) => {
      setFieldValue(name, values[name].filter((item) => item !== id));
    };

    return (
      <div className="mb-4 md:col-span-1 relative">
        <label className="block mb-1 font-semibold text-gray-700">{label}</label>

        <Listbox disabled={modo === "ver"} value={""} onChange={handleAdd}>
          <div className="relative">
            <Listbox.Button className="border border-gray-300 rounded-lg p-2 w-full text-gray-800 flex justify-between items-center hover:border-[#384CB4] focus:outline-none focus:ring-2 focus:ring-[#384CB4] transition-colors cursor-pointer">
              Selecciona una opción
              <ChevronUpDownIcon className="w-5 h-5 text-gray-500" />
            </Listbox.Button>

            <Listbox.Options className="absolute z-10 bottom-full mb-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {options.map((opt) => (
                <Listbox.Option
                  key={opt._id}
                  value={opt._id}
                  disabled={values[name].includes(opt._id)}
                  className={({ active, disabled }) =>
                    `cursor-pointer select-none relative py-2 px-4 ${
                      active ? "bg-[#384CB4] text-white" : "text-gray-800"
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
                  }
                >
                  {opt.name || opt.title}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>

        <Chips items={values[name]} options={options} onRemove={handleRemove} />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose}></div>

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl p-6 overflow-y-auto transform transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <UserIcon className="w-8 h-8 text-[#384CB4]" />
            <h2 className="text-3xl font-extrabold">
              {modo === "agregar"
                ? "Agregar Personaje"
                : modo === "editar"
                ? "Editar Personaje"
                : "Ver Personaje"}
            </h2>
          </div>
          <button onClick={onClose} className="cursor-pointer">
            <XMarkIcon className="w-8 h-8 text-gray-700 hover:text-gray-900" />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={modo === "ver" ? null : validationSchema}
          enableReinitialize
          onSubmit={async (values, { resetForm }) => {
            setLoading(true);
            try {
              if (modo === "editar" && personaje?._id) values._id = personaje._id;
              await onGuardar(values);
              resetForm();
            } catch (err) {
              console.error(err);
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "name", label: "Nombre" },
                { name: "birth_year", label: "Año de Nacimiento" },
                { name: "gender", label: "Género" },
                { name: "hair_color", label: "Color de Cabello" },
                { name: "height", label: "Altura" },
                { name: "mass", label: "Masa" },
                { name: "skin_color", label: "Color de Piel" },
                { name: "eye_color", label: "Color de Ojos" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block mb-1 font-semibold text-gray-700">{field.label}</label>
                  <Field
                    type="text"
                    name={field.name}
                    disabled={modo === "ver"}
                    className="border border-gray-300 rounded-lg p-2 w-full text-gray-800 hover:border-[#384CB4] focus:outline-none focus:ring-2 focus:ring-[#384CB4] transition-colors"
                  />
                  <ErrorMessage
                    name={field.name}
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block mb-1 font-semibold text-gray-700">Planeta natal</label>
                <select
                  name="homeworld"
                  disabled={modo === "ver"}
                  value={values.homeworld}
                  onChange={(e) => setFieldValue("homeworld", e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full text-gray-800 hover:border-[#384CB4] focus:outline-none focus:ring-2 focus:ring-[#384CB4] transition-colors cursor-pointer"
                >
                  <option value="">Selecciona un planeta</option>
                  {planetas.map((pl) => (
                    <option key={pl._id} value={pl._id}>
                      {pl.name}
                    </option>
                  ))}
                </select>
              </div>

              <MultiSelectListbox
                label="Películas"
                name="films"
                options={peliculas}
                values={values}
                setFieldValue={setFieldValue}
              />

              <MultiSelectListbox
                label="Especies"
                name="species"
                options={especies}
                values={values}
                setFieldValue={setFieldValue}
              />

              <MultiSelectListbox
                label="Naves"
                name="starships"
                options={naves}
                values={values}
                setFieldValue={setFieldValue}
              />

              <MultiSelectListbox
                label="Vehículos"
                name="vehicles"
                options={vehiculos}
                values={values}
                setFieldValue={setFieldValue}
              />

              {modo !== "ver" && (
                <div className="col-span-2 flex justify-end gap-4 mt-6">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#384CB4] text-white rounded hover:bg-[#3a55d9] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    {loading ? <ClipLoader color="#fff" size={20} /> : "Guardar"}
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PersonajeModal;