import { useState } from "react";
import { 
  X, Gauge, Tag, CarFront, User, Calendar, FileText, AlertCircle, ShieldCheck, Wrench, Loader2
} from 'lucide-react';

interface CreateSer {
  onClose: () => void;
}

export default function CreateModalServi({ onClose }: CreateSer) {
  const [loading, setLoading] = useState(false);
  
  // Estado inicial basado en las validaciones de Laravel
  const [form, setForm] = useState({
    vehicle_id: "",
    client_id: "",
    service_type_id: "",
    service_date: "",
    mileage_at_service: "",
    status: "1", // Por defecto
    observations: "", // Pertenece a details.observations en backend
    recommendation: "", // Pertenece a details.recommendation en backend
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Aquí preparas el payload para que coincida con la estructura esperada por Laravel
    const payload = {
      vehicle_id: form.vehicle_id,
      client_id: form.client_id,
      service_type_id: form.service_type_id,
      service_date: form.service_date,
      mileage_at_service: Number(form.mileage_at_service),
      status: form.status,
      details: {
        observations: form.observations,
        recommendation: form.recommendation
      }
    };

    setTimeout(() => {
      console.log("Datos a enviar a Laravel:", payload);
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Aumenté max-w-md a max-w-lg porque este formulario tiene muchos campos y se ve mejor un poco más ancho */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        
        {/* Header del Modal */}
        <div className="relative px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
                <Wrench size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Registrar Servicio</h2>
                <p className="text-xs text-slate-500 font-medium">Ingresa los datos del nuevo mantenimiento</p>
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

        {/* Formulario con scroll en Y si es necesario en pantallas pequeñas */}
        <div className="max-h-[80vh] overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              {/* Vehículo (vehicle_id - required) */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Vehículo *</label>
                <div className="relative group">
                  <CarFront className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                  <select 
                    name="vehicle_id" 
                    value={form.vehicle_id}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all uppercase placeholder:text-slate-400 text-slate-700 appearance-none" 
                  >
                    <option value="" disabled className="normal-case">Seleccione vehículo</option>
                    <option value="1">ABC-123 (ID: 1)</option>
                    <option value="2">XYZ-789 (ID: 2)</option>
                  </select>
                </div>
              </div>

              {/* Cliente (client_id - required) */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Cliente *</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                  <select 
                    name="client_id" 
                    value={form.client_id}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700 appearance-none" 
                  >
                    <option value="" disabled>Seleccione un cliente</option>
                    <option value="1">Juan Pérez</option>
                    <option value="2">María Gómez</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Tipo de Servicio (service_type_id - required) */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Tipo de Servicio *</label>
                <div className="relative group">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                  <select 
                    name="service_type_id" 
                    value={form.service_type_id}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700 appearance-none" 
                  >
                    <option value="" disabled>Seleccione servicio</option>
                    <option value="1">Mantenimiento Preventivo</option>
                    <option value="2">Reparación de Motor</option>
                  </select>
                </div>
              </div>

              {/* Fecha (service_date - required, date) */}
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Kilometraje en Servicio (mileage_at_service - required, integer, min:0) */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Kilometraje Actual *</label>
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
                    placeholder="0" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">km</span>
                </div>
              </div>

              {/* Estado (status - in:0,1,2,3,4) */}
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
                    <option value="0">Pendiente (0)</option>
                    <option value="1">En Proceso (1)</option>
                    <option value="2">Esperando Repuestos (2)</option>
                    <option value="3">Completado (3)</option>
                    <option value="4">Cancelado (4)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Observaciones (details.observations - nullable) */}
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
                  placeholder="Detalles sobre el estado en el que llegó el vehículo..." 
                />
              </div>
            </div>

            {/* Recomendaciones (details.recommendation - nullable) */}
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
                    Guardando...
                  </>
                ) : (
                  "Guardar Servicio"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}