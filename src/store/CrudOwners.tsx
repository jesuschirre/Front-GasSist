import axios from "axios";
import API_URL from "../services/Api";

// Tipado para la creación
export interface CreateOwnerDTO {
  name: string;
  phone?: string;
  email?: string;
  identification_type: string;
  number: string;
}

// Tipado para la edición (los campos suelen ser opcionales al editar)
export interface UpdateOwnerDTO {
  name?: string;
  phone?: string;
  email?: string;
  identification_type?: string;
  number?: string;
  status?: number; // Por si tu backend permite cambiar el estado a inactivo
}

export const getDuenos = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/owners`,
      { withCredentials: true }
    );
    // Tu backend de Laravel devuelve un objeto paginado, por eso res.data.data
    return res.data.data;
  } catch (error) {
    console.error("Error al obtener dueños:", error);
  }
};

// FUNCIÓN: Crear Dueño
export const postDuenos = async (data: CreateOwnerDTO) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/owners`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error al crear dueño:", error);
    throw error; // Lanzamos el error para que el modal sepa si falló
  }
};

// NUEVA FUNCIÓN: Actualizar Dueño
export const putDuenos = async (id: number | string, data: UpdateOwnerDTO) => {
  try {
    // Usamos PUT o PATCH dependiendo de lo que espere tu backend en Laravel
    const res = await axios.patch(
      `${API_URL}/api/owners/${id}`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(`Error al actualizar el dueño con ID ${id}:`, error);
    throw error; // Lanzamos el error para capturarlo en el modal de edición
  }
};

// NUEVA FUNCIÓN: Eliminar Dueño
export const deleteDuenos = async (id: number | string) => {
  try {
    const res = await axios.delete(
      `${API_URL}/api/owners/${id}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(`Error al eliminar el dueño con ID ${id}:`, error);
    throw error; // Lanzamos el error para mostrar una alerta si falla
  }
};