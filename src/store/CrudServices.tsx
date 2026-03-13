import axios from "axios";
import API_URL from "../services/Api";

// --- INTERFACES ---

export interface ServiceDetail {
  id: number;
  service_id: number;
  observations: string | null;
  recommendation: string | null;
}

export interface Service {
  id: number;
  vehicle_id: number;
  client_id: number;
  service_type_id: number;
  service_date: string;
  mileage_at_service: number;
  status: number;
  // Relaciones devueltas por el "with" de Laravel
  vehicle?: any;
  client?: any;
  serviceType?: any;
  details?: ServiceDetail; 
}

// Interfaz para Crear (coincide con el método store)
export interface CreateServiceDTO {
  vehicle_id: number | string;
  client_id: number | string;
  service_type_id: number | string;
  service_date: string; // Formato YYYY-MM-DD
  mileage_at_service: number | string;
  status?: number | string; // 0, 1, 2, 3, 4
  details?: {
    observations?: string | null;
    recommendation?: string | null;
  };
}

// Interfaz para Editar (coincide con el método update)
// Nota: Tu controlador NO permite actualizar vehicle_id, client_id ni service_type_id
export interface UpdateServiceDTO {
  service_date?: string;
  mileage_at_service?: number | string;
  status?: number | string;
  details?: {
    observations?: string | null;
    recommendation?: string | null;
  };
}

// --- FUNCIONES CRUD ---

export const getServices = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/services`,
      { withCredentials: true }
    );
    // Laravel retorna los datos paginados dentro de 'data'. 
    // Dependiendo de cómo lo consumas, devuelves la data paginada completa o solo el array.
    return res.data.data; 
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    throw error;
  }
};

export const postService = async (data: CreateServiceDTO) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/services`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error al crear servicio:", error);
    throw error; // Lanzamos para que el modal capture el 422
  }
};

export const putService = async (id: number | string, data: UpdateServiceDTO) => {
  try {
    const res = await axios.put(
      `${API_URL}/api/services/${id}`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(`Error al actualizar servicio con ID ${id}:`, error);
    throw error;
  }
};

export const deleteService = async (id: number | string) => {
  try {
    const res = await axios.delete(
      `${API_URL}/api/services/${id}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(`Error al eliminar servicio con ID ${id}:`, error);
    throw error;
  }
};