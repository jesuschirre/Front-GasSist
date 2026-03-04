import axios from "axios";
import API_URL from "../services/Api";

/* =======================
   Interfaces
======================= */

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  email_verified_at: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Client {
  id: number;
  user_id: number;
  ubigeo_id: number;
  address: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  user: User;
}

/* =======================
   DTO para crear cliente
======================= */
export interface CreateClientDTO {
  name: string;
  phone: string;
  email:string
  address: string;
}

/* =======================
   API calls
======================= */

export const getClients = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/clients`,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    throw error;
  }
};

export const postClients = async (
  payload: CreateClientDTO
): Promise<Client> => {
  try {
    const response = await axios.post<Client>(
      `${API_URL}/api/clients`,
      payload,
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error("Error al crear cliente:", error);
    throw error;
  }
};

export const deleteClients = async (
    id:number
) => {
    try {
        const response = await axios.delete(
            `${API_URL}/api/clients/${id}`,
            { withCredentials: true }
        )
        return response
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        throw error;
    }
}

export const editClients = async (
    request : CreateClientDTO,
    id : number
) => {
    try {
        console.log(request)
        const response = await axios.patch(
            `${API_URL}/api/clients/${id}`,
            request,
            { withCredentials: true }
        )
        return response;
    } catch (error) {
        console.error("Error al editar al cliente:", error);
        throw error;
    }
}