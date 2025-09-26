import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/personajes`;

export const getPersonajes = async (pagina = 1, limit = 10, search = "") => {
  try {
    const response = await axios.get(
      `${API_URL}?page=${pagina}&limit=${limit}&search=${search}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener personajes:", error);
    return { data: [], page: 1, totalPages: 1 };
  }
};