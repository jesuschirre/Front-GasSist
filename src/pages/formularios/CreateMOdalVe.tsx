import { useState } from "react";
import { X, CarFront, Hash, Gauge, User, Tag, Loader2 } from "lucide-react";

interface interfaseVehiCr {
  onClose: () => void;
  // onUpdated?: () => void; // Sugerido si tienes una tabla que refrescar
}

export default function CreateModalVe({ onClose }: interfaseVehiCr) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    owner_id: "",
    plate_number: "",
    brand: "",
    model: "",
    current_mileage: "",
    status: "1", // Por defecto activo (1) según tu validación in:0,1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Aquí iría tu llamada a la API (ej. postVehicle(form))
    setTimeout(() => {
      console.log("Datos a enviar:", form);
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        
        {/* Header con gradiente sutil */}
        <div className="relative px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
                <CarFront size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Registrar Vehículo</h2>
                <p className="text-xs text-slate-500 font-medium">Ingresa los datos del nuevo vehículo</p>
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Dueño del Vehículo (required) */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Dueño del Vehículo *</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
              <select 
                name="owner_id" 
                value={form.owner_id}
                onChange={handleChange}
                required // Validación requerida
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all text-slate-700 appearance-none"
              >
                <option value="" disabled>Seleccione un dueño</option>
                <option value="1">Juan Pérez (ID: 1)</option>
                <option value="2">María Gómez (ID: 2)</option>
              </select>
            </div>
          </div>

          {/* Número de Placa (required, max:15) */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Número de Placa *</label>
            <div className="relative group">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
              <input 
                type="text" 
                name="plate_number"
                value={form.plate_number}
                onChange={handleChange}
                required // Validación requerida
                maxLength={15} // max:15
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all uppercase placeholder:text-slate-400 text-slate-700" 
                placeholder="Ej. ABC-123" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Marca (required, max:80) */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Marca *</label>
              <div className="relative group">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  required // Validación requerida
                  maxLength={80} // max:80
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700" 
                  placeholder="Ej. Toyota" 
                />
              </div>
            </div>

            {/* Modelo (required, max:80) */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Modelo *</label>
              <div className="relative group">
                <CarFront className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  required // Validación requerida
                  maxLength={80} // max:80
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700" 
                  placeholder="Ej. Hilux" 
                />
              </div>
            </div>
          </div>

            {/* Kilometraje Actual (nullable, min:0) */}
           <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Kilometraje</label>
              <div className="relative group">
                <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  type="number" 
                  name="current_mileage"
                  value={form.current_mileage}
                  onChange={handleChange}
                  min={0} // min:0
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700" 
                  placeholder="0" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">km</span>
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
                "Guardar Vehículo"
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}