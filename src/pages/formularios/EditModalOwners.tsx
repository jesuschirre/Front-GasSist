import { useState } from "react";
import Swal from "sweetalert2"; // <-- 1. Importar SweetAlert2
import { 
  X, User, Phone, Mail, Loader2, AlertCircle, PenSquare 
} from "lucide-react";
import { putDuenos, type UpdateOwnerDTO } from "../../store/CrudOwners";

interface editmo {
  onClose: () => void;
  onUpdated?: () => void;
  dueno: any;
}

export default function EditModalOwners({ onClose, onUpdated, dueno }: editmo) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  console.log(dueno)
  const [form, setForm] = useState<UpdateOwnerDTO>({
    name: dueno?.user?.name || dueno?.name || "",
    phone: dueno?.user?.phone || dueno?.phone || "",
    email: dueno?.user?.email || dueno?.email || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setErrorMsg(null);
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
      // Pasamos el ID del dueño y el formulario a la función PUT
      await putDuenos(dueno.id, form);
      
      // --- 2. Toast de Éxito ---
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
        title: 'Dueño actualizado exitosamente',
        customClass: {
          popup: 'rounded-xl shadow-lg border border-slate-100',
        }
      });

      if (onUpdated) {
        await onUpdated();
      }
      onClose();
    } catch (error: any) {
      console.error("Error al actualizar el dueño", error);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        
        {/* Header con indicador de Edición */}
        <div className="relative px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 text-violet-600 rounded-lg relative">
                <User size={20} />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm text-violet-600">
                   <PenSquare size={12} />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Editar Dueño</h2>
                <p className="text-xs text-slate-500 font-medium">Actualizando los datos de ID: {dueno?.id}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Alerta de Error */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Nombre Completo *</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej. Carlos Mendoza"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                required
                maxLength={255}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Teléfono / Celular</label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input
                type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Ej. 987654321"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                  maxLength={9}
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                  maxLength={255}
                />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-200 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Actualizando...
                </>
              ) : (
                "Actualizar Dueño"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}