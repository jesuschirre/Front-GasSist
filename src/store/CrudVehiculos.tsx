import axios from "axios";
import API_URL from "../services/Api";

// --- INTERFACES ---

export interface Vehicle {
  id: number;
  owner_id: number;
  plate_number: string;
  brand: string;
  model: string;
  current_mileage: number;
  status: number;
  owner?: any; // Aquí vendrá la relación con el dueño desde Laravel
}

// Interfaz para Crear (coincide con el método store)
export interface CreateVehicleDTO {
  owner_id: number | string;
  plate_number: string;
  brand: string;
  model: string;
  current_mileage?: number | string;
  status?: number | string;
  company_id: number;
}

// Interfaz para Editar (coincide con el método update)
// Nota: Tu controlador update no recibe owner_id, así que no lo incluimos aquí.
export interface UpdateVehicleDTO {
  plate_number?: string;
  brand?: string;
  model?: string;
  current_mileage?: number | string;
  status?: number | string;
}

// --- FUNCIONES CRUD ---

export const getVehiculos = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/vehicles`,
      { withCredentials: true }
    );
    // Laravel retorna paginación dentro de 'data', por lo que accedemos a res.data.data
    return res.data.data;
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
    throw error;
  }
};

export const postVehicle = async (data: CreateVehicleDTO) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/vehicles`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error al crear vehículo:", error);
    throw error; // Importante para capturar el error 422 (placa duplicada) en el modal
  }
};

export const putVehicle = async (id: number | string, data: UpdateVehicleDTO) => {
  try {
    const res = await axios.patch(
      `${API_URL}/api/vehicles/${id}`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(`Error al actualizar vehículo con ID ${id}:`, error);
    throw error;
  }
};

export const deleteVehicle = async (id: number | string) => {
  try {
    const res = await axios.delete(
      `${API_URL}/api/vehicles/${id}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(`Error al eliminar vehículo con ID ${id}:`, error);
    throw error;
  }
};