import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import { XMarkIcon, GlobeAmericasIcon } from "@heroicons/react/24/outline";

const PlanetaModal = ({ visible, onClose, onGuardar, planeta = {}, modo = "agregar" }) => {
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const validationSchema = Yup.object({
    name: Yup.string().required("Campo obligatorio"),
  });

  const initialValues = {
    name: planeta?.name || "",
    diameter: planeta?.diameter || "",
    rotation_period: planeta?.rotation_period || "",
    orbital_period: planeta?.orbital_period || "",
    gravity: planeta?.gravity || "",
    population: planeta?.population || "",
    climate: planeta?.climate || "",
    terrain: planeta?.terrain || "",
    surface_water: planeta?.surface_water || "",
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
            <GlobeAmericasIcon className="w-8 h-8 text-[#384CB4]" />
            <h2 className="text-3xl font-extrabold">
              {modo === "agregar"
                ? "Agregar Planeta"
                : modo === "editar"
                ? "Editar Planeta"
                : "Ver Planeta"}
            </h2>
          </div>
          <button onClick={onClose} className="cursor-pointer">
            <XMarkIcon className="w-8 h-8 text-gray-700 hover:text-gray-900" />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={modo === "ver" ? null : validationSchema}
          onSubmit={async (values, { resetForm }) => {
            setLoading(true);
            try {
              if (modo === "editar" && planeta?._id) values._id = planeta._id;
              await onGuardar(values);
              resetForm();
            } catch (err) {
              console.error(err);
            } finally {
              setLoading(false);
            }
          }}
        >
          {() => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "name", label: "Nombre" },
                { name: "diameter", label: "Diámetro" },
                { name: "rotation_period", label: "Período de Rotación" },
                { name: "orbital_period", label: "Período Orbital" },
                { name: "gravity", label: "Gravedad" },
                { name: "population", label: "Población" },
                { name: "climate", label: "Clima" },
                { name: "terrain", label: "Terreno" },
                { name: "surface_water", label: "Agua Superficial" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block mb-1 font-semibold text-gray-700">{field.label}</label>
                  <Field
                    type="text"
                    name={field.name}
                    placeholder={field.label}
                    disabled={modo === "ver"}
                    className={`border border-gray-300 rounded-lg p-2 w-full text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#384CB4] ${
                      modo === "ver" ? "bg-gray-100 cursor-not-allowed" : "hover:border-[#384CB4]"
                    }`}
                  />
                  <ErrorMessage name={field.name} component="div" className="text-red-500 text-sm" />
                </div>
              ))}

              {modo !== "ver" && (
                <div className="md:col-span-2 flex justify-end mt-6">
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

export default PlanetaModal;
