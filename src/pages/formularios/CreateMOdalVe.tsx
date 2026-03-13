import { useState, useEffect } from "react";
import { X, CarFront, Hash, Gauge, Tag, Loader2, AlertCircle, Search, ChevronDown } from "lucide-react";
import { postVehicle } from "../../store/CrudVehiculos";
import { getDuenos } from "../../store/CrudOwners"; // <-- Importamos para llenar el select
import Swal from "sweetalert2";

interface interfaseVehiCr {
  onClose: () => void;
  onUpdated: () => void; // <-- Obligatorio para refrescar la tabla
}

export default function CreateModalVe({ onClose, onUpdated }: interfaseVehiCr) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [owners, setOwners] = useState<any[]>([]); // Estado para guardar los dueños
  // estados para el buscador
  const [searchOwner, setSearchOwner] = useState("");
  const [isOpenOwner, setIsOpenOwner] = useState(false);

  const filteredOwners = owners.filter((owner) =>
    (owner.user?.name || "").toLowerCase().includes(searchOwner.toLowerCase()) ||
    owner.id.toString().includes(searchOwner)
  );
  
  const [form, setForm] = useState({
    owner_id: "",
    plate_number: "",
    brand: "",
    model: "",
    current_mileage: "",
    status: "1", 
  });

  // Función al hacer clic en un dueño de la lista
  const handleSelectOwner = (owner: any) => {
    setForm({ ...form, owner_id: owner.id }); // Guardamos el ID en el form
    setSearchOwner(owner.user?.name || "Sin nombre"); // Mostramos el nombre en el input
    setIsOpenOwner(false); // Cerramos el menú
  };

  // Cargar los dueños al abrir el modal
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await getDuenos();
        setOwners(res.data || []);
      } catch (error) {
        console.error("Error al cargar los dueños", error);
      }
    };
    fetchOwners();
  }, []);

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
      await postVehicle({ ...form, company_id: 1 });
      
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
        title: 'Vehículo registrado exitosamente',
        customClass: {
          popup: 'rounded-xl shadow-lg border border-slate-100',
        }
      });

      await onUpdated(); // Refresca la tabla principal
      onClose();   // Cierra el modal
    } catch (error: any) {
      console.error("Error al crear vehículo", error);
      if (error.response && error.response.status === 422) {
        setErrorMsg(error.response.data.message || "Verifique los datos ingresados (Ej. La placa ya existe).");
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
        
        {/* Header */}
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

        {/* Alerta de Error */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Dueño del Vehículo Dinámico con Buscador */}
          <div className="space-y-1.5 relative z-50">
            <label className="text-sm font-semibold text-slate-700 ml-1">Dueño del Vehículo *</label>
            
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
              
              {/* Input Buscador */}
              <input 
                type="text" 
                value={searchOwner}
                onChange={(e) => {
                  setSearchOwner(e.target.value);
                  setIsOpenOwner(true); // Abrimos la lista al escribir
                  // Si borran el texto, limpiamos el ID seleccionado
                  if (form.owner_id) setForm({ ...form, owner_id: "" }); 
                }}
                onFocus={() => setIsOpenOwner(true)}
                placeholder="Buscar por nombre o ID..."
                required={!form.owner_id} // Es requerido si no hay un ID guardado
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all text-slate-700"
              />
              
              <ChevronDown
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform duration-200 ${isOpenOwner ? 'rotate-180' : ''}`} 
                size={18} 
              />
            </div>

            {/* Lista desplegable personalizada */}
            {isOpenOwner && (
              <>
                {/* Capa invisible para cerrar al hacer clic afuera */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsOpenOwner(false)}
                />
                
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                  {filteredOwners.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-slate-500 text-center">
                      No se encontraron dueños
                    </div>
                  ) : (
                    filteredOwners.map((owner) => (
                      <div 
                        key={owner.id}
                        onClick={() => handleSelectOwner(owner)}
                        className={`relative z-50 px-4 py-2.5 cursor-pointer hover:bg-violet-50 transition-colors text-sm flex items-center justify-between ${
                          form.owner_id === owner.id ? 'bg-violet-50 text-violet-700 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <span>{owner.user?.name || "Sin nombre"}</span>
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          ID: {owner.id}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Número de Placa */}
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
            {/* Marca */}
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

            {/* Modelo */}
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

          {/* Kilometraje Actual */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Kilometraje Actual</label>
            <div className="relative group">
              <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
              <input 
                type="number" 
                name="current_mileage"
                value={form.current_mileage}
                onChange={handleChange}
                min={0}
                className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700" 
                placeholder="0" 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">km</span>
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
              className="flex-1 px-4 py-2.5 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 border border-transparent"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Guardando...
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