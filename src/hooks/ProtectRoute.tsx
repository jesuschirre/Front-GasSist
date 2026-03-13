import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react"; // Opcional, para el ícono de carga

export default function ProtectRoute() {
  const { user, isLoading } = UserAuth();
  const location = useLocation();

  // 1. Esperar a que el contexto termine de verificar la sesión
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2 text-violet-600">
          <Loader2 className="animate-spin" size={32} />
          <span className="font-medium text-sm">Verificando sesión...</span>
        </div>
      </div>
    );
  }

  // 2. Si terminó de cargar y NO hay usuario, lo mandamos al login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Si SÍ hay usuario, lo dejamos pasar a las rutas hijas (tu MainLayout, por ejemplo)
  return <Outlet />;
}