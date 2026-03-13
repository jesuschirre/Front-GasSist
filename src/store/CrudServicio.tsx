import axios from "axios";
import API_URL from "../services/Api";

// --- INTERFACES ---

export interface ServiceType {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  status: number;
}

// Interfaz para Crear (coincide con el método store)
export interface CreateServiceTypeDTO {
  name: string;
  description?: string | null;
  category?: string | null;
  status?: number | string; // 0 o 1
}

// Interfaz para Editar (coincide con el método update)
export interface UpdateServiceTypeDTO {
  name?: string;
  description?: string | null;
  category?: string | null;
  status?: number | string;
}

// --- FUNCIONES CRUD ---

// Nota: Asumo que la ruta en Laravel es '/api/service-types'. 
// Si usas otro nombre en tu archivo api.php (ej. '/api/service_types'), cámbialo aquí.

export const getServiceTypes = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/services-type`,
      { withCredentials: true }
    );
    return res.data.data; 
  } catch (error) {
    console.error("Error al obtener tipos de servicio:", error);
    throw error;
  }
};

export const postServiceType = async (data: CreateServiceTypeDTO) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/services-type`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error al crear tipo de servicio:", error);
    throw error; // Lanzamos para que el modal capture errores 422 (ej. nombre duplicado)
  }
};

export const putServiceType = async (id: number | string, data: UpdateServiceTypeDTO) => {
  try {
    const res = await axios.patch(
      `${API_URL}/api/services-type/${id}`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(`Error al actualizar tipo de servicio con ID ${id}:`, error);
    throw error;
  }
};

export const deleteServiceType = async (id: number | string) => {
  try {
    const res = await axios.delete(
      `${API_URL}/api/services-type/${id}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(`Error al desactivar/eliminar tipo de servicio con ID ${id}:`, error);
    throw error;
  }
};