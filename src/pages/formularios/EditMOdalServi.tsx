import { useState } from "react";
import { 
  X, Gauge, Tag, CarFront, User, Calendar, FileText, AlertCircle, ShieldCheck, Wrench, Loader2, PenSquare
} from 'lucide-react';
import { putService } from "../../store/CrudServices";
import Swal from "sweetalert2";

interface Editservi {
  onClose: () => void;
  onUpdated: () => void;
  servicio: any; // Recibimos el objeto completo del servicio que pasaste desde la tabla
}

export default function EditMOdalServi({ onClose, onUpdated, servicio }: Editservi) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Solo inicializamos los campos que Laravel permite actualizar
  const [form, setForm] = useState({
    service_date: servicio?.service_date || "",
    mileage_at_service: servicio?.mileage_at_service || "",
    status: servicio?.status?.toString() || "1",
    observations: servicio?.details?.observations || "",
    recommendation: servicio?.details?.recommendation || "",
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
    
    // Preparamos el payload exacto para la actualización
    const payload = {
      service_date: form.service_date,
      mileage_at_service: Number(form.mileage_at_service),
      status: form.status,
      details: {
        observations: form.observations,
        recommendation: form.recommendation
      }
    };

    try {
      await putService(servicio.id, payload);
      
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
        title: 'Servicio actualizado exitosamente',
        customClass: {
          popup: 'rounded-xl shadow-lg border border-slate-100',
        }
      });

      onUpdated();
      onClose();
    } catch (error: any) {
      console.error("Error al actualizar servicio", error);
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
        
        {/* Header del Modal */}
        <div className="relative px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 text-violet-600 rounded-lg relative">
                <Wrench size={20} />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm text-violet-600">
                   <PenSquare size={12} />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Editar Servicio</h2>
                <p className="text-xs text-slate-500 font-medium">Actualizando registro #{servicio?.id}</p>
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
            
            <div className="grid grid-cols-2 gap-4">
              {/* Vehículo - Solo Lectura */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Vehículo (No editable)</label>
                <div className="relative group">
                  <CarFront className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text"
                    value={servicio?.vehicle?.plate_number || "Desconocido"}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-mono"
                  />
                </div>
              </div>

              {/* Cliente - Solo Lectura */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Cliente (No editable)</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text"
                    value={servicio?.client?.user?.name || "Desconocido"}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed truncate"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Tipo de Servicio - Solo Lectura */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Servicio (No editable)</label>
                <div className="relative group">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text"
                    value={servicio?.serviceType?.name || "Desconocido"}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed truncate"
                  />
                </div>
              </div>

              {/* Fecha - Editable */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Fecha *</label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                  <input 
                    type="date" 
                    name="service_date"
                    value={form.service_date}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all text-slate-700" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Kilometraje - Editable */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Kilometraje *</label>
                <div className="relative group">
                  <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                  <input 
                    type="number" 
                    name="mileage_at_service"
                    value={form.mileage_at_service}
                    onChange={handleChange}
                    required
                    min={0}
                    className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">km</span>
                </div>
              </div>

              {/* Estado - Editable */}
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
                    <option value="0">Cancelado (0)</option>
                    <option value="1">Pendiente (1)</option>
                    <option value="2">En Proceso (2)</option>
                    <option value="3">Completado (3)</option>
                    <option value="4">Entregado (4)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Observaciones - Editable */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Observaciones</label>
              <div className="relative group">
                <FileText className="absolute left-3 top-3 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <textarea 
                  name="observations"
                  value={form.observations}
                  onChange={handleChange}
                  rows={2}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700 resize-none" 
                  placeholder="Detalles del mantenimiento..." 
                />
              </div>
            </div>

            {/* Recomendaciones - Editable */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Recomendaciones futuras</label>
              <div className="relative group">
                <AlertCircle className="absolute left-3 top-3 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <textarea 
                  name="recommendation"
                  value={form.recommendation}
                  onChange={handleChange}
                  rows={2}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700 resize-none" 
                  placeholder="Ej. Revisar pastillas de freno en 5,000 km..." 
                />
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
                className="flex-1 px-4 py-2.5 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-200 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Servicio"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}