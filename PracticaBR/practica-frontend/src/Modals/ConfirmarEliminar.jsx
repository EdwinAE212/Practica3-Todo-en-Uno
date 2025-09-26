import React from "react";

export default function ConfirmarEliminar({ personaje, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-40">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">
          ¿Estás seguro de eliminar este registro?
        </h2>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-[#384CB4] text-white rounded hover:bg-[#2242e3] cursor-pointer"
            onClick={() => {
              onConfirm();
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
