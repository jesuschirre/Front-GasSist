import { useState } from "react";
import { 
  X, CarFront, Hash, Gauge, User, Tag, ShieldCheck, Loader2, PenSquare, AlertCircle 
} from "lucide-react";
import { putVehicle, type UpdateVehicleDTO } from "../../store/CrudVehiculos"; // <-- Importamos función
import Swal from "sweetalert2";

interface VehicleData {
  id: number;
  owner_id: string | number;
  plate_number: string;
  brand: string;
  model: string;
  current_mileage: string | number;
  status: string | number;
  owner?: any; // Para mostrar el nombre del dueño
}

interface EditVe {
  onClose: () => void;
  vehicle: VehicleData; 
  onUpdated: () => void; 
}

export default function EditModalVehi({ onClose, vehicle, onUpdated }: EditVe) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // El backend no recibe owner_id al actualizar, así que lo omitimos en el payload de envío
  const [form, setForm] = useState<UpdateVehicleDTO>({
    plate_number: vehicle?.plate_number || "",
    brand: vehicle?.brand || "",
    model: vehicle?.model || "",
    current_mileage: vehicle?.current_mileage || 0,
    status: vehicle?.status !== undefined ? vehicle.status : "1",
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
      await putVehicle(vehicle.id, form);

      // Toast de Éxito
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
        title: 'Vehículo actualizado exitosamente',
        customClass: {
          popup: 'rounded-xl shadow-lg border border-slate-100',
        }
      });

      onUpdated();
      onClose();
    } catch (error: any) {
      console.error("Error al actualizar vehículo", error);
      if (error.response && error.response.status === 422) {
        setErrorMsg(error.response.data.message || "Verifique los datos (Ej. La placa ya existe).");
      } else {
        setErrorMsg("Ocurrió un error inesperado al conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        
        {/* Header con gradiente sutil y un icono que indique edición */}
        <div className="relative px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 text-violet-600 rounded-lg relative">
                <CarFront size={20} />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm text-violet-600">
                   <PenSquare size={12} />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800 tracking-tight">Editar Vehículo</h2>
                <p className="text-xs text-slate-500 font-medium">Actualiza la información del registro</p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Dueño del Vehículo (Solo Lectura) */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Dueño del Vehículo (No editable)</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                value={vehicle.owner?.user?.name || `Propietario ID: ${vehicle.owner_id}`}
                disabled
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Número de Placa *</label>
            <div className="relative group">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
              <input 
                type="text" 
                name="plate_number"
                value={form.plate_number}
                onChange={handleChange}
                required
                maxLength={15}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all uppercase placeholder:text-slate-400 text-slate-700" 
                placeholder="Ej. ABC-123" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Marca *</label>
              <div className="relative group">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  required
                  maxLength={80}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700" 
                  placeholder="Ej. Toyota" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Modelo *</label>
              <div className="relative group">
                <CarFront className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  required
                  maxLength={80}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700" 
                  placeholder="Ej. Hilux" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Kilometraje</label>
              <div className="relative group">
                <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                <input 
                  type="number" 
                  name="current_mileage"
                  value={form.current_mileage}
                  onChange={handleChange}
                  min={0}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700" 
                  placeholder="0" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">km</span>
              </div>
            </div>

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
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}