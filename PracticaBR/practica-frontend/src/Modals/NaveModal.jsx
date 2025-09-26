import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import { XMarkIcon, GlobeAmericasIcon } from "@heroicons/react/24/outline";

const NaveModal = ({ visible, onClose, onGuardar, nave = {}, modo = "agregar", mostrarToast }) => {
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const validationSchema = Yup.object({
    name: Yup.string().required("Campo obligatorio"),
    model: Yup.string().required("Campo obligatorio"),
  });

  const initialValues = {
    name: nave?.name || "",
    model: nave?.model || "",
    starship_class: nave?.starship_class || "",
    length: nave?.length || "",
    passengers: nave?.passengers || "",
    max_atmosphering_speed: nave?.max_atmosphering_speed || "",
    hyperdrive_rating: nave?.hyperdrive_rating || "",
    MGLT: nave?.MGLT || "",
    cargo_capacity: nave?.cargo_capacity || "",
    consumables: nave?.consumables || "",
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
                ? "Agregar Nave"
                : modo === "editar"
                ? "Editar Nave"
                : "Ver Nave"}
            </h2>
          </div>
          <button onClick={onClose}>
            <XMarkIcon className="w-8 h-8 text-gray-700 hover:text-gray-900 cursor-pointer" />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={modo === "ver" ? null : validationSchema}
          onSubmit={async (values, { resetForm }) => {
            setLoading(true);
            try {
              if (modo === "editar" && nave?._id) values._id = nave._id;
              await onGuardar(values);
              resetForm();
            } catch (err) {
              console.error(err);
              mostrarToast?.("Error al guardar registro", "error");
            } finally {
              setLoading(false);
            }
          }}
        >
          {() => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "name", label: "Nombre" },
                { name: "model", label: "Modelo" },
                { name: "starship_class", label: "Clase" },
                { name: "length", label: "Longitud" },
                { name: "passengers", label: "Pasajeros" },
                { name: "max_atmosphering_speed", label: "Velocidad Máx. Atmosférica" },
                { name: "hyperdrive_rating", label: "Clasificación de hiperpropulsión" },
                { name: "MGLT", label: "MGLT" },
                { name: "cargo_capacity", label: "Capacidad de Carga" },
                { name: "consumables", label: "Consumibles" },
              ].map((campo) => (
                <div
                  key={campo.name}
                  className={campo.name === "consumables" ? "md:col-span-2" : "col-span-1"}
                >
                  <label className="block mb-1 font-semibold text-gray-700">{campo.label}</label>
                  <Field
                    type={["length","passengers","max_atmosphering_speed","MGLT","cargo_capacity"].includes(campo.name) ? "number" : "text"}
                    name={campo.name}
                    placeholder={campo.label}
                    disabled={modo === "ver"}
                    className={`border border-gray-300 rounded-lg p-2 w-full text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#384CB4] ${
                      modo === "ver" ? "bg-gray-100 cursor-not-allowed" : "hover:border-[#384CB4]"
                    }`}
                  />
                  <ErrorMessage name={campo.name} component="div" className="text-red-500 text-sm" />
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

export default NaveModal;