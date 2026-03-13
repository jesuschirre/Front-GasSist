import { useEffect, useState } from 'react';
import { 
  Plus, Pencil, Trash2, Gauge, Wrench, Loader2
} from 'lucide-react';
import CreateModalServi from './formularios/CreateModalServi';
import EditMOdalServi from './formularios/EditMOdalServi';
import { getServices, deleteService } from '../store/CrudServices';
import Swal from 'sweetalert2';

export default function Services() {
  const [servicios, setServicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  
  // 👇 Función auxiliar segura para formatear la fecha
  const formatearFecha = (fechaISO: string) => {
    if (!fechaISO) return "Sin fecha";
    // Si la fecha ya viene cortada (ej: "2026-03-10") o trae la T, esto extrae solo la parte de la fecha.
    return fechaISO.split('T')[0]; 
  };

  const fetchServicios = async () => {
    try {
      setLoading(true);
      const res = await getServices();
      setServicios(res.data || []);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  
  const openEditModal = (servicio: any) => {
    setSelectedService(servicio);
    setIsModalEditOpen(true);
  };

  const closeEditModal = () => {
    setSelectedService(null);
    setIsModalEditOpen(false);
  };

  const handleDelete = async (id: number, placa: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás a punto de eliminar el servicio del vehículo ${placa}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#f43f5e",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#ffffff",
      customClass: {
        popup: 'rounded-2xl shadow-2xl border border-slate-100', 
        confirmButton: 'rounded-xl',
        cancelButton: 'rounded-xl'
      }
    });

    if (!result.isConfirmed) return;

    try {
      await deleteService(id);
      
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: 'success',
        title: 'Servicio eliminado exitosamente',
        customClass: { popup: 'rounded-xl shadow-lg border border-slate-100' }
      });

      fetchServicios();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el servicio. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
        customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl' }
      });
    }
  };

  // Helper para renderizar los badges de estado
  const getStatusBadge = (status: number) => {
    const statusConfig: Record<number, { text: string, classes: string, dot: string }> = {
      0: { text: 'Cancelado', classes: 'bg-rose-100 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
      1: { text: 'Pendiente', classes: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-500' },
      2: { text: 'En Progreso', classes: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
      3: { text: 'Completado', classes: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
      4: { text: 'Entregado', classes: 'bg-indigo-100 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' }
    };

    const config = statusConfig[status] || statusConfig[1];

    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center w-max gap-1.5 border ${config.classes}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></div>
        {config.text}
      </span>
    );
  };

  return (
    // 👇 Tailwind fix: max-w-[1600px]
    <div className="p-6 max-w-400 mx-auto animate-in fade-in duration-500 relative">
      
      {/* Encabezado del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-violet-100 text-violet-600 rounded-xl">
              <Wrench size={24} />
            </div>
            Gestión de Servicios
          </h1>
          <p className="text-slate-500 text-sm mt-1 ml-14">Control detallado de servicios brindados a clientes</p>
        </div>
        
        <button 
          onClick={toggleModal}
          className="flex items-center justify-center gap-2 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-violet-200 active:scale-95"
        >
          <Plus size={20} />
          Nuevo Servicio
        </button>
      </div>

      {/* Tabla de Servicios */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        
        {/* Estado de Carga */}
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-violet-600">
              <Loader2 className="animate-spin" size={20} />
              <span className="font-medium text-sm">Cargando servicios...</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto custom-scrollbar">
          {/* 👇 Tailwind fix: min-w-[1000px] */}
          <table className="w-full text-left border-collapse min-w-250">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Vehículo</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Cliente</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Servicio</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Fecha</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Kilometraje</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Estado</th>    
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Observaciones</th>    
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center sticky right-0 bg-slate-50">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading && servicios.length === 0 ? (
                 <tr>
                 <td colSpan={8} className="px-6 py-16 text-center text-slate-500">
                   <div className="flex flex-col items-center gap-3">
                     <Wrench size={48} className="text-slate-300" />
                     <div className="text-center">
                       <p className="text-base font-medium text-slate-600">No hay servicios registrados</p>
                       <p className="text-sm">Haz clic en "Nuevo Servicio" para comenzar.</p>
                     </div>
                   </div>
                 </td>
               </tr>
              ) : (
                servicios.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono font-bold text-sm inline-block w-max border border-slate-200 mb-1">
                          {v.vehicle?.plate_number || 'N/A'}
                        </span>
                        <span className="text-xs text-slate-500">{v.vehicle?.brand} {v.vehicle?.model}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium whitespace-nowrap">
                      {v.client?.user?.name || 'Cliente Desconocido'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {v.serviceType?.name || 'Mantenimiento'} 
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {/* 👇 AQUÍ APLICAMOS LA FUNCIÓN */}
                      {formatearFecha(v.service_date)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Gauge size={16} className="text-violet-500" />
                        {Number(v.mileage_at_service).toLocaleString()} <span className="text-slate-400">km</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(v.status)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm max-w-50 truncate" title={v.details?.observations || 'Sin observaciones'}>
                      {v.details?.observations || <span className="text-slate-400 italic">N/A</span>}
                    </td>
                    
                    {/* Acciones */}
                    <td className="px-6 py-4 sticky right-0 bg-white group-hover:bg-slate-50/80 transition-colors border-l border-slate-50">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(v)} 
                          className="p-2 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors" 
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(v.id, v.vehicle?.plate_number || 'desconocido')}
                          className="p-2 text-rose-500 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition-colors" 
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALES */}
      {isModalOpen && (
        <CreateModalServi 
          onClose={toggleModal} 
          onUpdated={fetchServicios} 
        /> 
      )}
      
      {isModalEditOpen && selectedService && (
        <EditMOdalServi 
          servicio={selectedService}
          onClose={closeEditModal} 
          onUpdated={fetchServicios} 
        /> 
      )}      
    </div>
  );
}