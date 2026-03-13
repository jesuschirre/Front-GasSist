import { useState, type FormEvent } from "react";
import { UserAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { Mail, Lock, Loader2, Package, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { HandleLogin } = UserAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !pass) {
      Swal.fire({
        icon: "warning",
        title: "Campos vacíos",
        text: "Por favor completa todos los campos",
        confirmButtonColor: "#7c3aed",
        customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl' }
      });
      return;
    }

    setIsLoading(true); // ✅ Cambiado a true para que se muestre el botón de carga
    
    try {
      await HandleLogin(email, pass);
    } catch (error) {
      console.error("Error en login:", error);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-4">
      
      {/* Elementos decorativos de fondo (Estilo Moderno Premium) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-violet-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-in fade-in duration-1000"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-in fade-in duration-1000 delay-300"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-fuchsia-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-in fade-in duration-1000 delay-700"></div>

      {/* Tarjeta de Login */}
      <div className="w-full max-w-105 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-linear-to-tr from-violet-100 to-indigo-50 rounded-2xl mb-5 shadow-inner border border-white">
            <Package size={36} className="text-violet-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Bienvenido de nuevo</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Ingresa a tu panel de administración</p>
        </div>

        {/* Formulario */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Correo electrónico
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={20} />
              <input
                type="email"
                placeholder="ejemplo@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all text-slate-700 placeholder:text-slate-400 font-medium"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1 mb-1">
              <label className="text-sm font-semibold text-slate-700">Contraseña</label>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all text-slate-700 placeholder:text-slate-400 font-medium tracking-widest"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-200/50 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Iniciando sesión...
              </>
            ) : (
              <>
                Ingresar al Panel
                <ArrowRight size={20} />
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}