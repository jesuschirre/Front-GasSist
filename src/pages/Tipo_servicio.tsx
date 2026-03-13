import { useEffect, useState } from 'react';
import { 
  Plus, Pencil, Trash2, Tags, Tag, Loader2, ShieldCheck, FileText
} from 'lucide-react';
import { getServiceTypes, deleteServiceType } from '../store/CrudServicio';
import Swal from 'sweetalert2';
import CreateModalTipo from './formularios/CreateModalTipo';
import EditModalTipo from './formularios/EditModalTipo';

export default function Tipo_servicio() {
  const [tipos, setTipos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<any>(null);

  const fetchTipos = async () => {
    try {
      setLoading(true);
      const res = await getServiceTypes();
      setTipos(res.data || []);
    } catch (error) {
      console.error("Error al cargar tipos de servicio:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  
  const openEditModal = (tipo: any) => {
    setSelectedTipo(tipo);
    setIsModalEditOpen(true);
  };

  const closeEditModal = () => {
    setSelectedTipo(null);
    setIsModalEditOpen(false);
  };

  const handleDelete = async (id: number, name: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás a punto de desactivar el tipo de servicio "${name}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#f43f5e",
      confirmButtonText: "Sí, desactivar",
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
      await deleteServiceType(id);
      
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: 'success',
        title: 'Tipo de servicio desactivado',
        customClass: { popup: 'rounded-xl shadow-lg border border-slate-100' }
      });

      fetchTipos();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo desactivar el tipo de servicio. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
        customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl' }
      });
    }
  };

  return (
    <div className="p-6 max-w-400 mx-auto animate-in fade-in duration-500 relative">
      
      {/* Encabezado del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-violet-100 text-violet-600 rounded-xl">
              <Tags size={24} />
            </div>
            Tipos de Servicio
          </h1>
          <p className="text-slate-500 text-sm mt-1 ml-14">
            Administra las categorías y tipos de mantenimiento
          </p>
        </div>
        
        <button 
          onClick={toggleModal}
          className="flex items-center justify-center gap-2 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-violet-200 active:scale-95"
        >
          <Plus size={20} />
          Nuevo Tipo
        </button>
      </div>

      {/* Tabla de Tipos de Servicio */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        
        {/* Estado de Carga */}
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-violet-600">
              <Loader2 className="animate-spin" size={20} />
              <span className="font-medium text-sm">Cargando categorías...</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre del Servicio</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>    
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center sticky right-0 bg-slate-50">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading && tipos.length === 0 ? (
                 <tr>
                 <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                   <div className="flex flex-col items-center gap-3">
                     <Tags size={48} className="text-slate-300" />
                     <div className="text-center">
                       <p className="text-base font-medium text-slate-600">No hay tipos de servicio registrados</p>
                       <p className="text-sm">Haz clic en "Nuevo Tipo" para crear uno.</p>
                     </div>
                   </div>
                 </td>
               </tr>
              ) : (
                tipos.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                    
                    {/* Nombre */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-100">
                          <Tag size={16} />
                        </div>
                        <span className="font-semibold text-slate-800">{t.name}</span>
                      </div>
                    </td>
                    
                    {/* Categoría */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {t.category || 'General'}
                      </span>
                    </td>
                    
                    {/* Descripción */}
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-75 truncate" title={t.description}>
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-slate-400 shrink-0" />
                        {t.description || <span className="italic text-slate-400">Sin descripción</span>}
                      </div>
                    </td>
                    
                    {/* Estado */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        t.status === 1 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <ShieldCheck size={14} />
                        {t.status === 1 ? 'Activo' : 'Inactivo'}
                      </div>
                    </td>
                    
                    {/* Acciones */}
                    <td className="px-6 py-4 sticky right-0 bg-white group-hover:bg-slate-50/80 transition-colors border-l border-slate-50">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(t)} 
                          className="p-2 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors" 
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(t.id, t.name)}
                          className="p-2 text-rose-500 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition-colors" 
                          title="Desactivar"
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

      {isModalOpen && (
        <CreateModalTipo 
          onClose={toggleModal} 
          onUpdated={fetchTipos} 
        /> 
      )}
      
      {isModalEditOpen && selectedTipo && (
        <EditModalTipo 
          tipo={selectedTipo}
          onClose={closeEditModal} 
          onUpdated={fetchTipos} 
        /> 
      )}

      
    </div>
  );
}