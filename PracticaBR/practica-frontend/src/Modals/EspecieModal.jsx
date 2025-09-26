import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import { XMarkIcon, FingerPrintIcon } from "@heroicons/react/24/outline";
import { getPlanetas } from "../Services/PlanetasServ";

const EspecieModal = ({ visible, onClose, onGuardar, especie = {}, modo = "agregar" }) => {
  const [loading, setLoading] = useState(false);
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
    if (visible) getAllPaginated(getPlanetas).then(setPlanetas);
  }, [visible]);

  if (!visible) return null;

  const validationSchema = Yup.object({
    name: Yup.string().required("Campo obligatorio"),
  });

  const initialValues = {
    name: especie?.name || "",
    classification: especie?.classification || "",
    designation: especie?.designation || "",
    average_height: especie?.average_height || "",
    average_lifespan: especie?.average_lifespan || "",
    eye_colors: especie?.eye_colors || "",
    hair_colors: especie?.hair_colors || "",
    skin_colors: especie?.skin_colors || "",
    language: especie?.language || "",
    homeworld: especie?.homeworld?._id || "",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose}></div>

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-3xl bg-white shadow-xl p-6 overflow-y-auto transform transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FingerPrintIcon className="w-8 h-8 text-[#384CB4]" />
            <h2 className="text-3xl font-extrabold">
              {modo === "agregar"
                ? "Agregar Especie"
                : modo === "editar"
                ? "Editar Especie"
                : "Ver Especie"}
            </h2>
          </div>
          <button onClick={onClose}>
            <XMarkIcon className="w-8 h-8 cursor-pointer text-gray-700 hover:text-gray-900" />
          </button>
        </div>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={modo === "ver" ? null : validationSchema}
          onSubmit={async (values) => {
            setLoading(true);
            try {
              const payload = {
                ...values,
                _id: especie?._id,
                homeworld: values.homeworld || null,
              };
              await onGuardar(payload);
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
                { name: "classification", label: "Clasificación" },
                { name: "designation", label: "Designación" },
                { name: "average_height", label: "Altura Promedio" },
                { name: "average_lifespan", label: "Esperanza de Vida" },
                { name: "eye_colors", label: "Color de Ojos" },
                { name: "hair_colors", label: "Color de Pelo" },
                { name: "skin_colors", label: "Color de Piel" },
                { name: "language", label: "Lenguaje" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block mb-1 font-semibold text-gray-700">{field.label}</label>
                  <Field
                    type={["average_height", "average_lifespan"].includes(field.name) ? "number" : "text"}
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

              <div className="md:col-span-2">
                <label className="block mb-1 font-semibold text-gray-700">Planeta de origen</label>
                <select
                  name="homeworld"
                  value={values.homeworld || ""}
                  onChange={(e) => setFieldValue("homeworld", e.target.value)}
                  disabled={modo === "ver"}
                  className={`w-full border border-gray-300 rounded-lg p-2 text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#384CB4] ${
                    modo === "ver" ? "bg-gray-100 cursor-not-allowed" : "hover:border-[#384CB4]"
                  }`}
                >
                  <option value="">Selecciona un planeta</option>
                  {planetas.map((pl) => (
                    <option key={pl._id} value={pl._id}>
                      {pl.name}
                    </option>
                  ))}
                </select>
              </div>

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

export default EspecieModal;