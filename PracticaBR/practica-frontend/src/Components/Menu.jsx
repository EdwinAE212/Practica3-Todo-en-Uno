import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UserGroupIcon,
  FilmIcon,
  GlobeAmericasIcon,
  RocketLaunchIcon,
  TruckIcon,
  FingerPrintIcon,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Personajes", icon: UserGroupIcon, path: "/personajes" },
  { name: "Películas", icon: FilmIcon, path: "/peliculas" },
  { name: "Especies", icon: FingerPrintIcon, path: "/especies" },
  { name: "Planetas", icon: GlobeAmericasIcon, path: "/planetas" },
  { name: "Naves", icon: RocketLaunchIcon, path: "/naves" },
  { name: "Vehículos", icon: TruckIcon, path: "/vehiculos" },
];

export default function Menu() {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`fixed top-0 left-0 h-full ${
        expanded ? "w-48" : "w-16"
      } bg-black shadow-lg flex flex-col transition-all duration-300`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-center w-full p-3 text-white hover:bg-gray-800 transition-colors cursor-pointer"
      >
        {expanded ? (
          <ArrowLeftCircleIcon className="w-6 h-6" />
        ) : (
          <ArrowRightCircleIcon className="w-6 h-6" />
        )}
      </button>

      <div className="flex flex-col gap-4 w-full mt-10 justify-start">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-2 pl-6 w-full rounded-lg transition-colors ${
                isActive ? "bg-gray-900" : "hover:bg-gray-800"
              }`}
            >
              <Icon className="w-6 h-6 text-white flex-shrink-0" />
              {expanded && (
                <span className="text-white text-sm font-medium">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
