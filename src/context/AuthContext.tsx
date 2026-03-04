import axios from "axios";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Swal from "sweetalert2";
import API_URL from "../services/Api";
import { useNavigate } from "react-router-dom";

interface Usuario {
  name: string;
  email: string;
  avatar: string;
  phone: string;
}

interface AuthContextType {
    user: Usuario | null;
    isLoading: boolean; // Agregado para mejor UX
    HandleLogin: (email: string, password: string) => Promise<void>;
    HandleLogout: () => Promise<void>; // Agregado
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<Usuario | null>(null); // Tipado correcto
    const [isLoading, setIsLoading] = useState(true); // Estado de carga
    const navigate = useNavigate();

    const fetchUsuario = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${API_URL}/api/me`,
                { withCredentials: true }
            );
            setUser(response.data.user);
        } catch (error: any) {
            setUser(null);
        } finally {
            setIsLoading(false); // Siempre termina la carga
        }
    };

    useEffect(() => {
        fetchUsuario();
    }, []);
    
    const HandleLogin = async (email: string, password: string) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/login`,
                { email, password },
                { withCredentials: true }
            );
            
            // IMPORTANTE: Actualizar el usuario después del login
            await fetchUsuario();
            
            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: response.data.message,
                timer: 2000,
                showConfirmButton: false
            });
            
            navigate("/"); // Ruta fija o desde config
            
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || "Error al iniciar sesión";
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
            });
        }
    };

    // Función de logout agregada
    const HandleLogout = async () => {
        try {
            await axios.post(
                `${API_URL}/api/logout`,
                {},
                { withCredentials: true }
            );
            setUser(null);
            navigate("/login");
        } catch (error: any) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, isLoading, HandleLogin, HandleLogout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Hook corregido
export const UserAuth = () => {
    const context = useContext(AuthContext);

    if (context === null) { // Validación correcta
        throw new Error("UserAuth must be used within an AuthContextProvider");
    }

    return context;
};