import { useState } from "react";
import { 
  X, Tag, LayoutGrid, FileText, AlertCircle, ShieldCheck, Loader2, PenSquare
} from 'lucide-react';
import { putServiceType } from "../../store/CrudServicio";
import Swal from "sweetalert2";

interface EditTipoProps {
  onClose: () => void;
  onUpdated: () => void;
  tipo: any; // Recibimos el objeto completo que viene de la tabla
}

export default function EditModalTipo({ onClose, onUpdated, tipo }: EditTipoProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Inicializamos el formulario con los datos de la categoría seleccionada
  const [form, setForm] = useState({
    name: tipo?.name || "",
    category: tipo?.category || "",
    description: tipo?.description || "",
    status: tipo?.status?.toString() || "1", 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      await putServiceType(tipo.id, form);
      
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
        title: 'Tipo de servicio actualizado exitosamente',
        customClass: {
          popup: 'rounded-xl shadow-lg border border-slate-100',
        }
      });

      onUpdated();
      onClose();
    } catch (error: any) {
      console.error("Error al actualizar tipo de servicio", error);
      if (error.response && error.response.status === 422) {
        setErrorMsg(error.response.data.message || "Verifique los datos ingresados (Ej. El nombre ya existe).");
      } else {
        setErrorMsg("Ocurrió un error inesperado al conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        
        {/* Header del Modal */}
        <div className="relative px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 text-violet-600 rounded-lg relative">
                <Tag size={20} />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm text-violet-600">
                   <PenSquare size={12} />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Editar Tipo</h2>
                <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                  Actualizando: {tipo?.name}
                </p>
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
        <div className="max-h-[75vh] overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Nombre */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Nombre del Servicio *</label>
              <div className="relative group">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  maxLength={120}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700" 
                  placeholder="Ej. Cambio de Aceite" 
                />
              </div>
            </div>

            {/* Categoría */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Categoría (Opcional)</label>
              <div className="relative group">
                <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  maxLength={60}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700" 
                  placeholder="Ej. Mantenimiento Preventivo" 
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Descripción (Opcional)</label>
              <div className="relative group">
                <FileText className="absolute left-3 top-3 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <textarea 
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700 resize-none" 
                  placeholder="Detalla qué incluye este tipo de servicio..." 
                />
              </div>
            </div>

            {/* Estado */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Estado</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <select 
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all text-slate-700 appearance-none"
                >
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>
            </div>

            {/* Botones */}
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
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-200 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}