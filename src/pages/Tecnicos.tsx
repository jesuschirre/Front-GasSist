import { useEffect, useState } from 'react';
import { 
  Plus, Pencil, Trash2, Users, Mail, Phone, Wrench, Award, BadgeIcon, Loader2 
} from 'lucide-react';
import CreateModalTecni from './formularios/CreateModalTecni';
import EditModalTecnicos from './formularios/EditModalTecnicos';
import { getTechnicians, deleteTechnician } from '../store/CrudTecnicos';
import Swal from 'sweetalert2';

export default function Tecnicos() {
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [selectedTecnico, setSelectedTecnico] = useState<any>(null);

  const fetchTecnicos = async () => {
    try {
      setLoading(true);
      const res = await getTechnicians();
      setTecnicos(res.data || []);
    } catch (error) {
      console.error("Error al cargar técnicos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTecnicos();
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  
  const openEditModal = (tecnico: any) => {
    setSelectedTecnico(tecnico);
    setIsModalEditOpen(true);
  };

  const closeEditModal = () => {
    setSelectedTecnico(null);
    setIsModalEditOpen(false);
  };

  const handleDelete = async (id: number, nombre: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás a punto de eliminar al técnico ${nombre}.`,
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
      await deleteTechnician(id);
      
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: 'success',
        title: 'Técnico eliminado exitosamente',
        customClass: { popup: 'rounded-xl shadow-lg border border-slate-100' }
      });

      fetchTecnicos();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar al técnico.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
        customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl' }
      });
    }
  };

  return (
    <div className="p-6 max-w-400 mx-auto animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-violet-100 text-violet-600 rounded-xl">
              <Users size={24} />
            </div>
            Gestión de Técnicos
          </h1>
          <p className="text-slate-500 text-sm mt-1 ml-14">
            Administra el personal técnico, especialidades y licencias
          </p>
        </div>
        
        <button 
          onClick={toggleModal}
          className="flex items-center justify-center gap-2 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-violet-200 active:scale-95"
        >
          <Plus size={20} />
          Nuevo Técnico
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-violet-600">
              <Loader2 className="animate-spin" size={20} />
              <span className="font-medium text-sm">Cargando técnicos...</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-250">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Técnico</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Especialidad</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Licencia</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Experiencia</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center sticky right-0 bg-slate-50">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading && tecnicos.length === 0 ? (
                 <tr>
                 <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                   <div className="flex flex-col items-center gap-3">
                     <Users size={48} className="text-slate-300" />
                     <p className="text-base font-medium text-slate-600">No hay técnicos registrados</p>
                   </div>
                 </td>
               </tr>
              ) : (
                tecnicos.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{t.user?.name}</span>
                        {t.user?.email && (
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                            <Mail size={12} /> {t.user.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={14} className="text-slate-400" />
                        {t.user?.phone || <span className="italic text-slate-400">Sin teléfono</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                        <Wrench size={16} className="text-indigo-400" />
                        {t.specialty || 'General'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <BadgeIcon size={16} className="text-slate-400" />
                        {t.license_number || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Award size={16} className="text-amber-500" />
                        {t.experience_years ? `${t.experience_years} años` : 'No especificado'}
                      </div>
                    </td>
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
                          onClick={() => handleDelete(t.id, t.user?.name || 'este técnico')}
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

      {isModalOpen && <CreateModalTecni onClose={toggleModal} onUpdated={fetchTecnicos} />}
      {isModalEditOpen && selectedTecnico && (
        <EditModalTecnicos 
          tecnico={selectedTecnico} 
          onClose={closeEditModal} 
          onUpdated={fetchTecnicos} 
        />
      )}
    </div>
  );
}