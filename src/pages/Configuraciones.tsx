import { useEffect, useState } from 'react';
import { 
  Shield, Key, Plus, Save, Loader2, CheckSquare, Square, Settings, AlertCircle
} from 'lucide-react';
import { 
  getRoles, 
  getPermissions, 
  postRole, 
  assignPermissionsToRole, 
  getPermissionsByRole 
} from '../store/CrudRoles';
import Swal from 'sweetalert2';

export default function Configuraciones() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para la gestión de la vista
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

  // Estado para el modal de "Nuevo Rol"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesData, permsData] = await Promise.all([
        getRoles(),
        getPermissions()
      ]);
      setRoles(rolesData || []);
      setPermissions(permsData || []);
    } catch (error) {
      console.error("Error al cargar roles y permisos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Seleccionar un rol de la lista y buscar sus permisos
  const handleSelectRole = async (role: any) => {
    setSelectedRole(role);
    setSelectedPermissions([]); // Limpiamos los checks mientras carga
    setIsLoadingPermissions(true);
    
    try {
      // Llamamos a tu nuevo endpoint pasándole el ID del rol
      const permisosDelRol = await getPermissionsByRole(role.id);
      
      // Extraemos solo los nombres de los permisos para marcar los checkboxes
      const rolePerms = permisosDelRol.map((p: any) => p.name);
      setSelectedPermissions(rolePerms);
      
    } catch (error) {
      console.error("No se pudieron cargar los permisos de este rol", error);
      Swal.fire({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
        icon: 'error', title: 'Error al cargar permisos del rol'
      });
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  // Activar/Desactivar un checkbox de permiso
  const togglePermission = (permName: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permName)
        ? prev.filter(p => p !== permName)
        : [...prev, permName]
    );
  };

  // Guardar los permisos asignados al rol seleccionado
  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    setIsSaving(true);
    
    try {
      await assignPermissionsToRole({
        role_name: selectedRole.name,
        guard_name: selectedRole.guard_name,
        permissions: selectedPermissions
      });

      const Toast = Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true,
      });
      Toast.fire({ icon: 'success', title: 'Permisos actualizados correctamente' });
      
      fetchData(); // Refrescamos por si cambió algo
    } catch (error) {
      Swal.fire({
        title: "Error", text: "Hubo un problema al asignar los permisos.", icon: "error",
        confirmButtonColor: "#7c3aed", customClass: { popup: 'rounded-2xl' }
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Crear un nuevo rol
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    
    try {
      await postRole({ name: newRoleName, guard_name: 'web' }); // 'web' según tu configuración actual
      setIsModalOpen(false);
      setNewRoleName("");
      fetchData();
      
      Swal.fire({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
        icon: 'success', title: 'Rol creado exitosamente'
      });
    } catch (error) {
      Swal.fire({
        title: "Error", text: "No se pudo crear el rol. Verifica que no exista ya.", icon: "error",
        confirmButtonColor: "#7c3aed"
      });
    }
  };

  return (
    <div className="p-6 max-w-400 mx-auto animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-violet-100 text-violet-600 rounded-xl">
              <Settings size={24} />
            </div>
            Configuraciones
          </h1>
          <p className="text-slate-500 text-sm mt-1 ml-14">
            Gestión de seguridad, roles y accesos del sistema
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-violet-600">
          <Loader2 className="animate-spin" size={40} />
          <p className="mt-4 font-medium">Cargando configuraciones...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* PANEL IZQUIERDO: Lista de Roles */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <Shield size={20} className="text-violet-500" />
                  <h3>Roles del Sistema</h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 bg-violet-50 text-violet-600 hover:bg-violet-100 rounded-lg transition-colors"
                  title="Crear nuevo rol"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1 max-h-150">
                {roles.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">No hay roles registrados.</p>
                ) : (
                  roles.map(role => (
                    <button
                      key={role.id}
                      onClick={() => handleSelectRole(role)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                        selectedRole?.id === role.id 
                          ? 'bg-violet-50 border-violet-200 text-violet-800 shadow-sm' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-violet-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-semibold text-sm">{role.name}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-500">
                        {role.guard_name}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* PANEL DERECHO: Permisos del Rol Seleccionado */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full min-h-125 flex flex-col">
              
              {!selectedRole ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
                  <Key size={64} className="mb-4 opacity-20" />
                  <h3 className="text-lg font-semibold text-slate-600">Selecciona un Rol</h3>
                  <p className="text-sm text-center max-w-sm mt-2">
                    Haz clic en un rol del panel izquierdo para ver y modificar sus permisos de acceso.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Key size={20} className="text-amber-500" />
                        Permisos para: <span className="text-violet-600">{selectedRole.name}</span>
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">Selecciona qué acciones puede realizar este rol en el sistema.</p>
                    </div>
                    
                    <button 
                      onClick={handleSavePermissions}
                      disabled={isSaving || isLoadingPermissions}
                      className="flex items-center justify-center gap-2 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md disabled:opacity-70"
                    >
                      {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                      Guardar Permisos
                    </button>
                  </div>

                  {isLoadingPermissions ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="animate-spin text-violet-500" size={32} />
                    </div>
                  ) : permissions.length === 0 ? (
                    <div className="p-4 bg-amber-50 text-amber-700 rounded-xl flex items-start gap-3">
                      <AlertCircle size={20} className="shrink-0 mt-0.5" />
                      <p className="text-sm font-medium">No hay permisos registrados en la base de datos para mostrar.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 overflow-y-auto custom-scrollbar pr-2 pb-4">
                      {permissions.map(perm => {
                        const isChecked = selectedPermissions.includes(perm.name);
                        return (
                          <div 
                            key={perm.id}
                            onClick={() => togglePermission(perm.name)}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                              isChecked 
                                ? 'bg-indigo-50/50 border-indigo-200' 
                                : 'bg-white border-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <div className={`shrink-0 transition-colors ${isChecked ? 'text-indigo-600' : 'text-slate-300'}`}>
                              {isChecked ? <CheckSquare size={20} /> : <Square size={20} />}
                            </div>
                            <span className={`text-sm font-medium select-none ${isChecked ? 'text-indigo-900' : 'text-slate-600'}`}>
                              {perm.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL INLINE: CREAR ROL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 transform transition-all animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Nuevo Rol</h3>
            <p className="text-sm text-slate-500 mb-5">Ingresa el nombre del nuevo rol.</p>
            
            <form onSubmit={handleCreateRole}>
              <input 
                type="text" 
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                autoFocus
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 mb-6"
                placeholder="Ej. Supervisor, Cajero..."
              />
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Crear Rol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}