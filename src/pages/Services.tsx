import { useState } from 'react';
import { 
  Plus, Pencil, Trash2, Gauge, Wrench, 
} from 'lucide-react';
import CreateModalServi from './formularios/CreateModalServi';
import EditMOdalServi from './formularios/EditMOdalServi';

export default function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  // Datos de ejemplo ampliados para que coincidan con las columnas de tu tabla
  const [ servicios, setVehiculos] = useState([
    { 
      id: 1, 
      placa: 'ABC-123', 
      marca: 'Toyota', 
      modelo: 'Hilux', 
      cliente: 'Juan Pérez',
      servicio: 'Mantenimiento General',
      fecha: '12 Feb 2026',
      kilometraje: '45,000',
      estado: 'Completado',
      observaciones: 'Cambio de aceite y filtros',
      recomendaciones: 'Revisar pastillas en 5,000 km'
    },
    { 
      id: 2, 
      placa: 'XYZ-789', 
      marca: 'Hyundai', 
      modelo: 'Tucson', 
      cliente: 'María Gómez',
      servicio: 'Reparación de Frenos',
      fecha: '14 Feb 2026',
      kilometraje: '12,500',
      estado: 'En Progreso',
      observaciones: 'Discos desgastados',
      recomendaciones: 'Evitar frenadas bruscas'
    },
  ]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleModalEdit = () => setIsModalEditOpen(!isModalEditOpen);
  return (
    <div className="p-6 max-w-400 mx-auto animate-in fade-in duration-500">
      
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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Vehículo</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Cliente</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Servicio</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Fecha</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Kilometraje</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Estado</th>    
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Observaciones</th>    
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Recomendaciones</th>    
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center sticky right-0 bg-slate-50">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {servicios.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono font-bold text-sm inline-block w-max border border-slate-200 mb-1">
                        {v.placa}
                      </span>
                      <span className="text-xs text-slate-500">{v.marca} {v.modelo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium whitespace-nowrap">{v.cliente}</td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{v.servicio}</td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{v.fecha}</td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Gauge size={16} className="text-violet-500" />
                      {v.kilometraje} <span className="text-slate-400">km</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center w-max gap-1.5 ${
                      v.estado === 'Completado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${v.estado === 'Completado' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                      {v.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm max-w-50 truncate" title={v.observaciones}>
                    {v.observaciones}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm max-w-50 truncate" title={v.recomendaciones}>
                    {v.recomendaciones}
                  </td>
                  <td className="px-6 py-4 sticky right-0 bg-white group-hover:bg-slate-50/80 transition-colors">
                    <div className="flex justify-center gap-2">
                      <button onClick={toggleModalEdit} className="p-2 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors" title="Editar">
                        <Pencil size={18} />
                      </button>
                      <button className="p-2 text-rose-500 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PARA NUEVO SERVICIO / VEHÍCULO */}
      {isModalOpen && <CreateModalServi onClose ={ ()=> setIsModalOpen(false)}/> }
      {isModalEditOpen && <EditMOdalServi onClose ={ ()=> setIsModalEditOpen(false)}/> }       
    </div>
  );
}