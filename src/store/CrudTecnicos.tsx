import axios from "axios";
import API_URL from "../services/Api";

// --- INTERFACES ---

export interface Technician {
  id: number;
  user_id: number;
  company_id: number | null;
  specialty: string | null;
  license_number: string | null;
  experience_years: number | null;
  // Relación con el usuario (devuelta por el with('user') en Laravel)
  user?: {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    status: number;
  };
}

// Interfaz para Crear (coincide con el método store)
export interface CreateTechnicianDTO {
  // Datos del usuario
  name: string;
  phone?: string | null;
  email?: string | null;
  
  // Datos de identificación (Obligatorios al crear)
  identification_type: string; // Ej. 'DNI', 'PASAPORTE' (debe existir en identification_types.code)
  number: string;
  
  // Datos del técnico
  specialty?: string | null;
  license_number?: string | null;
  experience_years?: number | null;
}

// Interfaz para Editar (coincide con el método update)
// Nota: Tu controlador NO permite modificar la identificación una vez creado
export interface UpdateTechnicianDTO {
  name?: string;
  phone?: string | null;
  email?: string | null;
  specialty?: string | null;
  license_number?: string | null;
  experience_years?: number | null;
}

// --- FUNCIONES CRUD ---

// Nota: Asumo que la ruta en Laravel es '/api/technicians'

export const getTechnicians = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/technicians`,
      { withCredentials: true }
    );
    // Laravel retorna la colección paginada dentro de 'data'
    return res.data.data; 
  } catch (error) {
    console.error("Error al obtener técnicos:", error);
    throw error;
  }
};

export const postTechnician = async (data: CreateTechnicianDTO) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/technicians`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error al crear técnico:", error);
    throw error; // Para que el modal capture errores 422 (Ej. Identificación duplicada)
  }
};

export const putTechnician = async (id: number | string, data: UpdateTechnicianDTO) => {
  try {
    const res = await axios.put(
      `${API_URL}/api/technicians/${id}`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(`Error al actualizar técnico con ID ${id}:`, error);
    throw error;
  }
};

export const deleteTechnician = async (id: number | string) => {
  try {
    const res = await axios.delete(
      `${API_URL}/api/technicians/${id}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(`Error al eliminar técnico con ID ${id}:`, error);
    throw error;
  }
};