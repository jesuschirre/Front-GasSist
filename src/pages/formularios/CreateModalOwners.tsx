import { useState } from "react";
import Swal from "sweetalert2"; // <-- Importamos SweetAlert2
import { 
  X, User, Phone, Mail, UserPlus, Loader2, CreditCard, Hash, AlertCircle 
} from "lucide-react";
import { postDuenos } from "../../store/CrudOwners"; 

interface owModal {
  onClose: () => void;
  onUpdated?: () => void;
}

export default function CreateModalOwners({ onClose, onUpdated }: owModal) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    identification_type: "", 
    number: "",
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
      await postDuenos(form);
      
      // --- NUEVO: Toast de Éxito con SweetAlert2 ---
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
        title: 'Dueño registrado exitosamente',
        customClass: {
          popup: 'rounded-xl shadow-lg border border-slate-100',
        }
      });

      if (onUpdated) {
        await onUpdated();
      }
      onClose();
    } catch (error: any) {
      console.error("Error al crear el dueño", error);
      if (error.response && error.response.status === 422) {
        setErrorMsg(error.response.data.message || "Verifique los datos ingresados.");
      } else {
        setErrorMsg("Ocurrió un error inesperado al conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getDocumentLimit = (type: string) => {
    switch (type) {
      case 'DNI': return 8;
      case 'CE': return 9;
      case 'RUC': return 11;
      case 'PASSPORT': return 9;
      default: return 15;
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        
        {/* Header con gradiente sutil */}
        <div className="relative px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
                <UserPlus size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Nuevo Dueño</h2>
                <p className="text-xs text-slate-500 font-medium">Registra un propietario y su identificación</p>
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

        {/* Alerta de Error (Se muestra solo si backend devuelve 422 u otro error) */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Campo Nombre Completo */}
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
            {/* Tipo de Documento */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Tipo de Documento *</label>
              <div className="relative group">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <select
                  name="identification_type"
                  value={form.identification_type}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all text-slate-700 appearance-none"
                >
                  <option value="" disabled>Seleccione...</option>
                  <option value="DNI">DNI</option>
                  <option value="CE">Carné de Extranjería</option>
                  <option value="RUC">RUC</option>
                  <option value="PASSPORT">Pasaporte</option>
                </select>
              </div>
            </div>
            {/* Número de Documento */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">N° Documento *</label>
              <div className="relative group">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input
                  name="number"
                  value={form.number}
                  onChange={handleChange}
                  placeholder="Ej. 70000000"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                  required
                  // AQUÍ ESTÁ LA MAGIA: Llamamos a la función con el tipo actual
                  maxLength={getDocumentLimit(form.identification_type)} 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Campo Teléfono */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Teléfono / Celular</label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input
                  type="tel"
                  maxLength={9}
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Ej. 987654321"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
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
                  Guardando...
                </>
              ) : (
                "Guardar Dueño"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}