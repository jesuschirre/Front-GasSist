import axios from "axios";
import API_URL from "../services/Api";

// --- INTERFACES ---
export interface Role {
  id: number;
  name: string;
  guard_name: string;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

export interface CreateRoleDTO {
  name: string;
  guard_name: string;
}

export interface AssignPermissionsDTO {
  role_name: string;
  guard_name: string;
  permissions: string[]; // Array de nombres de permisos
}

export interface AssignRoleToUserDTO {
  user_id: number | string;
  role_name: string;
  guard_name: string;
}

// --- FUNCIONES CRUD ---


/**
 * Obtiene la lista de roles (filtrados por guard 'rubro' según tu backend)
 */
export const getRoles = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/roles`,
      { withCredentials: true }
    );
    // Tu backend devuelve: { guard: 'rubro', roles: [...] }
    return res.data.roles; 
  } catch (error) {
    console.error("Error al obtener roles:", error);
    throw error;
  }
};

/**
 * Obtiene la lista de permisos (filtrados por guard 'rubro' según tu backend)
 */
export const getPermissions = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/permissions`,
      { withCredentials: true }
    );
    // Tu backend devuelve: { guard: 'rubro', permissions: [...] }
    return res.data.permissions; 
  } catch (error) {
    console.error("Error al obtener permisos:", error);
    throw error;
  }
};

/**
 * Crea un nuevo rol
 */
export const postRole = async (data: CreateRoleDTO) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/roles/create`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error al crear el rol:", error);
    throw error;
  }
};

/**
 * Asigna múltiples permisos a un rol específico
 */
export const assignPermissionsToRole = async (data: AssignPermissionsDTO) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/roles/assign-permissions`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error al asignar permisos al rol:", error);
    throw error;
  }
};

/**
 * Asigna un rol específico a un usuario
 */
export const assignRoleToUser = async (data: AssignRoleToUserDTO) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/roles/assign-user`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Error al asignar rol al usuario:", error);
    throw error;
  }
};

/**
 * Obtiene los permisos asignados a un rol específico por su ID
 */
export const getPermissionsByRole = async (id: number | string) => {
  try {
    const res = await axios.get(
      `${API_URL}/api/roles/${id}/permissions`,
      { withCredentials: true }
    );
    return res.data; 
  } catch (error) {
    console.error(`Error al obtener los permisos del rol ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene los roles asignados a un usuario específico por su ID
 */
export const getRolesByUser = async (userId: number | string) => {
  try {
    // Asegúrate de que el prefijo /api/ coincida con tus rutas de Laravel
    const res = await axios.get(
      `${API_URL}/api/roles/user/${userId}/roles`,
      { withCredentials: true }
    );
    
    // Tu backend devuelve: { ok: true, data: ["RoleName1", "RoleName2"] }
    // Así que retornamos directamente el arreglo "data"
    return res.data.data; 
  } catch (error) {
    console.error(`Error al obtener los roles del usuario ${userId}:`, error);
    throw error;
  }
};