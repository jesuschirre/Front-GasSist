import { useEffect, useState } from 'react';
import { 
  Plus, Pencil, Trash2, Mail, Phone, ShieldCheck, Loader2, UserCog, Fingerprint,
  Shield
} from 'lucide-react';
import { getAdmins, deleteAdmin } from '../store/CrudAdmins';
import Swal from 'sweetalert2';

import CreateModalAdmin from './formularios/CreateModalAdmin';
import EditModalAdmin from './formularios/EditModalAdmin';
import AssignRoleModal from './formularios/AssignRoleModal';

export default function Admins() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [userForRole, setUserForRole] = useState<any>(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await getAdmins();
      setAdmins(res.data || []);
    } catch (error) {
      console.error("Error al cargar administradores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  
  const openEditModal = (admin: any) => {
    setSelectedAdmin(admin);
    setIsModalEditOpen(true);
  };
  
  const openRoleModal = (admin: any) => {
  // Pasamos el admin.user porque tu backend pide el user_id de la tabla general, no de la tabla admins
  setUserForRole(admin.user); 
  setIsRoleModalOpen(true);
  };
  
  const closeEditModal = () => {
    setSelectedAdmin(null);
    setIsModalEditOpen(false);
  };

  const handleDelete = async (id: number, nombre: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás a punto de revocar el acceso y eliminar a ${nombre}.`,
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
      await deleteAdmin(id);
      
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: 'success',
        title: 'Administrador eliminado exitosamente',
        customClass: { popup: 'rounded-xl shadow-lg border border-slate-100' }
      });

      fetchAdmins();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar al administrador.",
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
              <UserCog size={24} />
            </div>
            Gestión de Administradores
          </h1>
          <p className="text-slate-500 text-sm mt-1 ml-14">
            Administra los usuarios con acceso privilegiado al sistema
          </p>
        </div>
        
        <button 
          onClick={toggleModal}
          className="flex items-center justify-center gap-2 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-violet-200 active:scale-95"
        >
          <Plus size={20} />
          Nuevo Admin
        </button>
      </div>

      {/* Tabla de Administradores */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        
        {/* Estado de Carga */}
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-violet-600">
              <Loader2 className="animate-spin" size={20} />
              <span className="font-medium text-sm">Cargando administradores...</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID / UID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center sticky right-0 bg-slate-50">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading && admins.length === 0 ? (
                 <tr>
                 <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                   <div className="flex flex-col items-center gap-3">
                     <UserCog size={48} className="text-slate-300" />
                     <div className="text-center">
                       <p className="text-base font-medium text-slate-600">No hay administradores registrados</p>
                       <p className="text-sm">El sistema requiere al menos un administrador activo.</p>
                     </div>
                   </div>
                 </td>
               </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50/80 transition-colors group">
                    
                    {/* UID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <Fingerprint size={16} className="text-indigo-400" />
                        {admin.uid || `ADM-${admin.id}`}
                      </div>
                    </td>
                    
                    {/* Usuario (Nombre y Email) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{admin.user?.name || 'Desconocido'}</span>
                        {admin.user?.email && (
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                            <Mail size={12} /> {admin.user.email}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Contacto (Teléfono) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={14} className="text-slate-400" />
                        {admin.user?.phone || <span className="italic text-slate-400">Sin teléfono</span>}
                      </div>
                    </td>
                    
                    {/* Estado */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        admin.user?.status === 1 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        <ShieldCheck size={14} />
                        {admin.user?.status === 1 ? 'Activo' : 'Inactivo'}
                      </div>
                    </td>
                    
                    {/* Acciones */}
                    <td className="px-6 py-4 sticky right-0 bg-white group-hover:bg-slate-50/80 transition-colors border-l border-slate-50">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(admin)} 
                          className="p-2 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors" 
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                            onClick={() => openRoleModal(admin)} 
                            className="p-2 text-amber-500 hover:bg-amber-100 hover:text-amber-600 rounded-lg transition-colors" 
                            title="Asignar Rol"
                            >
                            <Shield size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(admin.id, admin.user?.name || 'este administrador')}
                          className="p-2 text-rose-500 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition-colors" 
                          title="Desactivar / Eliminar"
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

      {/* MODALES (Descomentar cuando los creemos) */}
       {isModalOpen && (
        <CreateModalAdmin 
          onClose={toggleModal} 
          onUpdated={fetchAdmins} 
        /> 
      )}
      
      {isModalEditOpen && selectedAdmin && (
        <EditModalAdmin 
          admin={selectedAdmin}
          onClose={closeEditModal} 
          onUpdated={fetchAdmins} 
        /> 
      )} 
      {isRoleModalOpen && userForRole && (
        <AssignRoleModal
            user={userForRole}
            onClose={() => setIsRoleModalOpen(false)}
            onUpdated={fetchAdmins}
        />
        )}
      
    </div>
  );
}