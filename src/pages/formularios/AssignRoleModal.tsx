import { useState, useEffect } from "react";
import { X, Shield, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
// 👇 Asegúrate de importar getRolesByUser aquí
import { getRoles, assignRoleToUser, getRolesByUser } from "../../store/CrudRoles";
import Swal from "sweetalert2";

interface AssignRoleProps {
  onClose: () => void;
  onUpdated: () => void;
  user: {
    id: number;
    name: string;
  }; 
}

export default function AssignRoleModal({ onClose, onUpdated, user }: AssignRoleProps) {
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nose, setNose] = useState()
  console.log("Datos que llegan del backend (userRoles):", nose);
  // 👇 CARGAMOS LOS ROLES Y EL ROL ACTUAL DEL USUARIO
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        // Hacemos ambas peticiones al mismo tiempo para que sea más rápido
        const [allRoles, userRoles] = await Promise.all([
          getRoles(),
          getRolesByUser(user.id) // Llamamos a la función que creaste
        ]);
        setNose(userRoles);
        setRoles(allRoles || []);

        // Si el backend nos devolvió que el usuario ya tiene roles asignados,
        // pre-seleccionamos el primero de la lista.
        if (userRoles && userRoles.length > 0) {
          setSelectedRole(userRoles[0]);
        }

      } catch (error) {
        setErrorMsg("Error al cargar la información del usuario.");
        console.error(error);
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, [user.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setSaving(true);
    setErrorMsg(null);

    const roleData = roles.find(r => r.name === selectedRole);

    try {
      await assignRoleToUser({
        user_id: user.id,
        role_name: roleData.name,
        guard_name: roleData.guard_name 
      });

      Swal.fire({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
        icon: 'success', title: 'Rol asignado correctamente',
        customClass: { popup: 'rounded-xl shadow-lg border border-slate-100' }
      });

      onUpdated();
      onClose();
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || "Ocurrió un error al asignar el rol.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        
        <div className="relative px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Asignar Rol</h2>
              <p className="text-xs text-slate-500 truncate max-w-[200px]">Usuario: {user.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200/50 rounded-full">
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 text-rose-600 rounded-xl flex gap-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          {loadingData ? (
            <div className="flex flex-col items-center justify-center py-8 text-violet-500">
              <Loader2 className="animate-spin mb-2" size={32} />
              <span className="text-sm font-medium">Cargando información...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700">Selecciona un Rol de Sistema *</label>
              
              <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                {roles.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No hay roles creados en Configuraciones.</p>
                ) : (
                  roles.map((role) => (
                    <div 
                      key={role.id}
                      onClick={() => setSelectedRole(role.name)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedRole === role.name 
                          ? 'bg-violet-50 border-violet-500 shadow-sm' 
                          : 'bg-white border-slate-200 hover:border-violet-500 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className={`font-semibold text-sm ${selectedRole === role.name ? 'text-violet-900' : 'text-slate-700'}`}>
                          {role.name}
                        </span>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                          Guard: {role.guard_name}
                        </div>
                      </div>
                      <div className={selectedRole === role.name ? 'text-violet-600' : 'text-slate-200'}>
                        <CheckCircle size={20} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={saving || !selectedRole || loadingData} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-200 disabled:opacity-70 flex items-center justify-center gap-2">
              {saving ? <><Loader2 className="animate-spin" size={18} /> Asignando...</> : "Guardar Rol"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}