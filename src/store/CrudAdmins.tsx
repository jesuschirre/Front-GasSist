import axios from "axios";
import API_URL from "../services/Api";

// --- INTERFACES ---

export interface Admin {
  id: number;
  user_id: number;
  uid: string;
  // Relación con el usuario (devuelta por el with('user') en Laravel)
  user?: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    status: number;
    supabase_user_id: string;
  };
}

// Interfaz para Crear (coincide con el método store)
// Nota: 'password' y 'email' son estrictamente requeridos aquí para Supabase
export interface CreateAdminDTO {
  name: string;
  email: string;
  password: string; 
  phone?: string | null;
  uid?: string | null; // Es opcional, tu backend genera uno (ej. ADM-000001) si no se envía
}

// Interfaz para Editar (coincide con el método update)
// Nota: Aquí el 'password' es opcional. Solo se envía si el admin quiere cambiarla.
export interface UpdateAdminDTO {
  name?: string;
  email?: string;
  phone?: string | null;
  password?: string | null; 
  uid?: string;
}

// --- FUNCIONES CRUD ---

export const getAdmins = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/admins`,
      { withCredentials: true }
    );
    // Laravel retorna la colección paginada dentro de 'data'
    return res.data.data; 
  } catch (error) {
    console.error("Error al obtener administradores:", error);
    throw error;
  }
};

export const postAdmin = async (data: CreateAdminDTO) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/admins`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error al crear administrador:", error);
    throw error; // Lanzamos para capturar errores 422 o 500 (ej. error de Supabase) en el modal
  }
};

export const putAdmin = async (id: number | string, data: UpdateAdminDTO) => {
  try {
    const res = await axios.put(
      `${API_URL}/api/admins/${id}`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(`Error al actualizar administrador con ID ${id}:`, error);
    throw error;
  }
};

export const deleteAdmin = async (id: number | string) => {
  try {
    const res = await axios.delete(
      `${API_URL}/api/admins/${id}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error(`Error al eliminar administrador con ID ${id}:`, error);
    throw error;
  }
};

export interface AssignRoleToUserDTO {
  user_id: number | string;
  role_name: string;
  guard_name: string;
}

export const assignRoleToUser = async (data: AssignRoleToUserDTO) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/users/assign-role`, // Ajusta la URL si es diferente en tu api.php
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error al asignar rol al usuario:", error);
    throw error;
  }
};