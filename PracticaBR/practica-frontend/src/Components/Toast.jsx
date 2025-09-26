import React, { useEffect } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const Toast = ({ message, tipo = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "#384CB4",
    error: "#FF0000",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className={`pointer-events-auto flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl px-8 py-6 max-w-sm w-full transform transition-all duration-500 animate-toast-show`}
        style={{
          border: `4px solid ${tipo === "success" ? colors.success : colors.error}`,
        }}
      >
        <div className="mb-4">
          {tipo === "success" ? (
            <CheckCircleIcon className="w-16 h-16" style={{ color: colors.success }} />
          ) : (
            <XCircleIcon className="w-16 h-16" style={{ color: colors.error }} />
          )}
        </div>
        <div className="text-center font-bold text-lg text-gray-800">{message}</div>
      </div>
    </div>
  );
};

export default Toast;