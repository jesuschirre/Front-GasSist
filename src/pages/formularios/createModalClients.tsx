import { useState } from "react";
import Swal from "sweetalert2"; // <-- Importamos SweetAlert2
import type { CreateClientDTO } from "../../store/CrudClientes";
import { postClients } from "../../store/CrudClientes";
import { 
  X, User, Phone, Mail, MapPin, UserPlus, Loader2, AlertCircle 
} from "lucide-react"; // <-- Agregamos AlertCircle

interface CreateModalClientsProps {
  onClose: () => void;
  onUpdated: () => void;
}

export default function CreateModalClients({ onClose, onUpdated }: CreateModalClientsProps) {
  const [form, setForm] = useState<CreateClientDTO>({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // <-- Estado para errores

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null); // Limpiamos el error al empezar a escribir
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      await postClients(form);
      
      // --- Toast de Éxito con SweetAlert2 ---
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      });

      Toast.fire({
        icon: 'success',
        title: 'Cliente registrado exitosamente',
        customClass: {
          popup: 'rounded-xl shadow-lg border border-slate-100',
        }
      });

      await onUpdated(); // Refresca tabla
      setForm({ name: "", phone: "", email: "", address: "" });
      onClose();
    } catch (error: any) {
      console.error("Error al crear cliente", error);
      // Capturamos posibles errores 422 de validación de Laravel
      if (error.response && error.response.status === 422) {
        setErrorMsg(error.response.data.message || "Verifique los datos ingresados.");
      } else {
        setErrorMsg("Ocurrió un error inesperado al conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        
        {/* Header con gradiente sutil en el icono */}
        <div className="relative px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
                <UserPlus size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Nuevo Cliente</h2>
                <p className="text-xs text-slate-500 font-medium">Completa la información del perfil</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Alerta de Error (Se muestra solo si backend falla) */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="space-y-4">
            {/* Campo Nombre */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Nombre Completo *</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                  required
                />
              </div>
            </div>

            {/* Campo Celular */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Teléfono</label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input
                  type="tel"        // <-- Tecla numérica en celulares
                  maxLength={9}     // <-- Límite exacto de 9 caracteres
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="900100200"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all text-slate-700"
                />
              </div>
            </div>

            {/* Campo Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="usuario@correo.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all text-slate-700"
                />
              </div>
            </div>

            {/* Campo Dirección */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Dirección</label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Calle, Ciudad, País"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              Cancelar
            </button>

            {/* Botón principal con gradiente Premium */}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 border border-transparent"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Guardando...</span>
                </>
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}