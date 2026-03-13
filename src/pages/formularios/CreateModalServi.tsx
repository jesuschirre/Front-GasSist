import { useState, useEffect } from "react";
import { 
  X, Gauge, Tag, CarFront, User, Calendar, FileText, AlertCircle, ShieldCheck, Wrench, Loader2, ChevronDown, HardHat
} from 'lucide-react';
import { postService } from "../../store/CrudServices";
import { getVehiculos } from "../../store/CrudVehiculos";
import { getClients } from "../../store/CrudClientes";
import { getServiceTypes } from "../../store/CrudServicio";
// 👇 Asegúrate de que esta importación coincida con el nombre de tu archivo/función real
import { getTechnicians } from "../../store/CrudTecnicos";
import Swal from "sweetalert2";

interface CreateSer {
  onClose: () => void;
  onUpdated: () => void; // Para refrescar la tabla
}

export default function CreateModalServi({ onClose, onUpdated }: CreateSer) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados de los datos que vienen de la BD
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [tiposServicio, setTiposServicio] = useState<any[]>([]);
  const [tecnicos, setTecnicos] = useState<any[]>([]); // Nuevo estado para técnicos

  const [form, setForm] = useState({
    vehicle_id: "",
    client_id: "",
    service_type_id: "",
    technician_id: "", // Nuevo campo en el formulario
    service_date: "",
    mileage_at_service: "",
    status: "1", 
    observations: "", 
    recommendation: "", 
  });

  // ==========================================
  // ESTADOS Y LÓGICA PARA LOS BUSCADORES (COMBOBOX)
  // ==========================================
  
  // 1. Buscador de Vehículos
  const [searchVehicle, setSearchVehicle] = useState("");
  const [isOpenVehicle, setIsOpenVehicle] = useState(false);
  const filteredVehiculos = vehiculos.filter(v =>
    (v.plate_number || "").toLowerCase().includes(searchVehicle.toLowerCase()) ||
    (v.brand || "").toLowerCase().includes(searchVehicle.toLowerCase())
  );
  const handleSelectVehicle = (v: any) => {
    setForm({ ...form, vehicle_id: v.id });
    setSearchVehicle(`${v.plate_number} - ${v.brand}`);
    setIsOpenVehicle(false);
  };

  // 2. Buscador de Clientes
  const [searchClient, setSearchClient] = useState("");
  const [isOpenClient, setIsOpenClient] = useState(false);
  const filteredClientes = clientes.filter(c =>
    (c.user?.name || "").toLowerCase().includes(searchClient.toLowerCase())
  );
  const handleSelectClient = (c: any) => {
    setForm({ ...form, client_id: c.id });
    setSearchClient(c.user?.name || "Sin nombre");
    setIsOpenClient(false);
  };

  // 3. Buscador de Tipos de Servicio
  const [searchServiceType, setSearchServiceType] = useState("");
  const [isOpenServiceType, setIsOpenServiceType] = useState(false);
  const filteredTiposServicio = tiposServicio.filter(ts =>
    (ts.name || "").toLowerCase().includes(searchServiceType.toLowerCase())
  );
  const handleSelectServiceType = (ts: any) => {
    setForm({ ...form, service_type_id: ts.id });
    setSearchServiceType(ts.name);
    setIsOpenServiceType(false);
  };

  // 4. Buscador de Técnicos
  const [searchTechnician, setSearchTechnician] = useState("");
  const [isOpenTechnician, setIsOpenTechnician] = useState(false);
  const filteredTecnicos = tecnicos.filter(t =>
    (t.user?.name || "").toLowerCase().includes(searchTechnician.toLowerCase())
  );
  const handleSelectTechnician = (t: any) => {
    setForm({ ...form, technician_id: t.id });
    setSearchTechnician(t.user?.name || "Sin nombre");
    setIsOpenTechnician(false);
  };

  // ==========================================

  // Cargar datos al montar el modal
  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const [resVehiculos, resClientes, resTipos, resTecnicos] = await Promise.all([
          getVehiculos(),
          getClients(),
          getServiceTypes(),
          getTechnicians() // Llamada a la API de técnicos
        ]);

        setVehiculos(resVehiculos.data || []);
        setClientes(resClientes.data || []); 
        setTiposServicio(resTipos.data || []);
        setTecnicos(resTecnicos.data || []); // Guardamos los técnicos
        
      } catch (error) {
        console.error("Error al cargar datos para los selects", error);
      }
    };
    fetchSelectData();
  }, []);

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
    
    // Payload con la estructura exacta que espera tu ServiceController
    const payload = {
      vehicle_id: form.vehicle_id,
      client_id: form.client_id,
      service_type_id: form.service_type_id,
      technician_id: form.technician_id, // Agregado al payload
      service_date: form.service_date,
      mileage_at_service: Number(form.mileage_at_service),
      status: form.status,
      details: {
        observations: form.observations,
        recommendation: form.recommendation
      }
    };

    try {
      await postService(payload);
      
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: 'success',
        title: 'Servicio registrado exitosamente',
        customClass: { popup: 'rounded-xl shadow-lg border border-slate-100' }
      });

      onUpdated();
      onClose();
    } catch (error: any) {
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
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header del Modal */}
        <div className="relative px-6 py-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
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

        {/* Alerta de Error */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl flex items-start gap-2 shrink-0">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Formulario con scroll en Y */}
        <div className="overflow-y-auto custom-scrollbar p-6">
          <form onSubmit={handleSubmit} className="space-y-4 pb-2">
            
            {/* GRUPO 1: Vehículo y Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Buscador de Vehículo */}
              <div className="space-y-1.5 relative z-60">
                <label className="text-sm font-semibold text-slate-700 ml-1">Vehículo *</label>
                <div className="relative group">
                  <CarFront className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={searchVehicle}
                    onChange={(e) => {
                      setSearchVehicle(e.target.value);
                      setIsOpenVehicle(true);
                      if(form.vehicle_id) setForm({...form, vehicle_id: ""});
                    }}
                    onFocus={() => setIsOpenVehicle(true)}
                    placeholder="Buscar placa o marca..."
                    required={!form.vehicle_id}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                  />
                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${isOpenVehicle ? 'rotate-180' : ''}`} size={18} />
                </div>

                {isOpenVehicle && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpenVehicle(false)} />
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                      {filteredVehiculos.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-slate-500 text-center">No encontrado</div>
                      ) : (
                        filteredVehiculos.map((v) => (
                          <div 
                            key={v.id} onClick={() => handleSelectVehicle(v)}
                            className={`px-4 py-2.5 cursor-pointer hover:bg-violet-50 text-sm ${form.vehicle_id === v.id ? 'bg-violet-50 font-bold text-violet-700' : 'text-slate-700'}`}
                          >
                            {v.plate_number} - {v.brand}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Buscador de Cliente */}
              <div className="space-y-1.5 relative z-50">
                <label className="text-sm font-semibold text-slate-700 ml-1">Cliente *</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={searchClient}
                    onChange={(e) => {
                      setSearchClient(e.target.value);
                      setIsOpenClient(true);
                      if(form.client_id) setForm({...form, client_id: ""});
                    }}
                    onFocus={() => setIsOpenClient(true)}
                    placeholder="Buscar cliente..."
                    required={!form.client_id}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                  />
                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${isOpenClient ? 'rotate-180' : ''}`} size={18} />
                </div>

                {isOpenClient && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpenClient(false)} />
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                      {filteredClientes.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-slate-500 text-center">No encontrado</div>
                      ) : (
                        filteredClientes.map((c) => (
                          <div 
                            key={c.id} onClick={() => handleSelectClient(c)}
                            className={`px-4 py-2.5 cursor-pointer hover:bg-violet-50 text-sm ${form.client_id === c.id ? 'bg-violet-50 font-bold text-violet-700' : 'text-slate-700'}`}
                          >
                            {c.user?.name || "Sin nombre"}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* GRUPO 2: Tipo de Servicio y Técnico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Buscador de Tipo de Servicio */}
              <div className="space-y-1.5 relative z-40">
                <label className="text-sm font-semibold text-slate-700 ml-1">Tipo de Servicio *</label>
                <div className="relative group">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={searchServiceType}
                    onChange={(e) => {
                      setSearchServiceType(e.target.value);
                      setIsOpenServiceType(true);
                      if(form.service_type_id) setForm({...form, service_type_id: ""});
                    }}
                    onFocus={() => setIsOpenServiceType(true)}
                    placeholder="Buscar servicio..."
                    required={!form.service_type_id}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                  />
                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${isOpenServiceType ? 'rotate-180' : ''}`} size={18} />
                </div>

                {isOpenServiceType && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpenServiceType(false)} />
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                      {filteredTiposServicio.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-slate-500 text-center">No encontrado</div>
                      ) : (
                        filteredTiposServicio.map((ts) => (
                          <div 
                            key={ts.id} onClick={() => handleSelectServiceType(ts)}
                            className={`px-4 py-2.5 cursor-pointer hover:bg-violet-50 text-sm ${form.service_type_id === ts.id ? 'bg-violet-50 font-bold text-violet-700' : 'text-slate-700'}`}
                          >
                            {ts.name}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Buscador de Técnico */}
              <div className="space-y-1.5 relative z-35">
                <label className="text-sm font-semibold text-slate-700 ml-1">Técnico Asignado *</label>
                <div className="relative group">
                  <HardHat className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={searchTechnician}
                    onChange={(e) => {
                      setSearchTechnician(e.target.value);
                      setIsOpenTechnician(true);
                      if(form.technician_id) setForm({...form, technician_id: ""});
                    }}
                    onFocus={() => setIsOpenTechnician(true)}
                    placeholder="Buscar técnico..."
                    required={!form.technician_id}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                  />
                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${isOpenTechnician ? 'rotate-180' : ''}`} size={18} />
                </div>

                {isOpenTechnician && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpenTechnician(false)} />
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                      {filteredTecnicos.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-slate-500 text-center">No encontrado</div>
                      ) : (
                        filteredTecnicos.map((t) => (
                          <div 
                            key={t.id} onClick={() => handleSelectTechnician(t)}
                            className={`px-4 py-2.5 cursor-pointer hover:bg-violet-50 text-sm ${form.technician_id === t.id ? 'bg-violet-50 font-bold text-violet-700' : 'text-slate-700'}`}
                          >
                            {t.user?.name || "Sin nombre"}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* GRUPO 3: Fecha y Kilometraje */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-30">
              {/* Fecha */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 ml-1">Fecha de Ingreso *</label>
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

              {/* Kilometraje Actual */}
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
            </div>

            {/* GRUPO 4: Estado y Textareas */}
            <div className="space-y-4 relative z-20">
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
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-6 border-t border-slate-100 mt-6 relative z-10">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                // Deshabilita si falta algún id requerido
                disabled={loading || !form.vehicle_id || !form.client_id || !form.service_type_id || !form.technician_id}
                className="flex-1 px-4 py-2.5 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-200 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="animate-spin" size={18} /> Guardando...</> : "Guardar Servicio"}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}