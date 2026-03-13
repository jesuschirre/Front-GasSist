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
            setIsLoading(true)
            const response = await axios.post(
                `${API_URL}/api/login`,
                { email, password },
                { withCredentials: true }
            );

            await fetchUsuario();
            
            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: response.data.message,
                timer: 2000,
                showConfirmButton: false
            });
            
            navigate("/");
            
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message;
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
            });
        }finally{
          setIsLoading(false)
        }
    };

    // Función de logout agregada
    const HandleLogout = async () => {
        try {
            setIsLoading(true);
            await axios.post(
                `${API_URL}/api/logout`,
                {},
                { withCredentials: true }
            );
            setUser(null);
            navigate("/login");
        } catch (error: any) {
            console.error("Error al cerrar sesión:", error);
        }finally{
            setIsLoading(false);
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