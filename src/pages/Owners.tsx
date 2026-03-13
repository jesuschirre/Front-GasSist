import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getDuenos, deleteDuenos } from "../store/CrudOwners";
import { 
  Users, Plus, Pencil, Trash2, Mail, Phone, Loader2, UserCircle 
} from "lucide-react";
import CreateModalOwners from "./formularios/CreateModalOwners";
import EditModalOwners from "./formularios/EditModalOwners";

export default function Owners() {
  const [duenos, setDuenos] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [modalcreate, setModalCreate] = useState(false);
  const [modaledit, setModalEdit] = useState(false);
  const [selectdueno, setDuenoSelect] = useState<any>(null);
  const modalAbrir = () => setModalCreate(!modalcreate);
  const modalAbrirEdit = () => setModalEdit(!modaledit);
  const extraerDuenos = async () => {
    try {
      setLoading(true);
      const res = await getDuenos();
      setDuenos(res.data || []); 
    } catch (error) {
      console.error("Error al obtener los dueños:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: number, name: string) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás a punto de eliminar a ${name || 'este usuario'}. Esta acción lo marcará como eliminado.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#f43f5e",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#ffffff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Llamamos a tu función de la API
          await deleteDuenos(id);
          
          // Alerta de éxito
          Swal.fire({
            title: "¡Eliminado!",
            text: "El registro ha sido eliminado exitosamente.",
            icon: "success",
            confirmButtonColor: "#7c3aed",
          });

          // Refrescamos la tabla
          extraerDuenos();
        } catch (error) {
          // Alerta de error
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el registro. Inténtalo de nuevo.",
            icon: "error",
            confirmButtonColor: "#7c3aed",
          });
        }
      }
    });
  };

  useEffect(() => {
    extraerDuenos();
  }, []);

  return (
    <div className="p-6 max-w-400 mx-auto animate-in fade-in duration-500 relative">
      
      {/* Encabezado del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-violet-100 text-violet-600 rounded-xl">
              <Users size={24} />
            </div>
            Directorio de Dueños
          </h1>
          <p className="text-slate-500 text-sm mt-1 ml-14">
            Gestión de propietarios de vehículos
          </p>
        </div>
        
        <button 
          onClick={modalAbrir}
          className="flex items-center justify-center gap-2 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-violet-200 active:scale-95"
        >
          <Plus size={20} />
          Nuevo Dueño
        </button>
      </div>

      {/* Contenedor Principal de la Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        
        {/* Estado de Carga */}
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-violet-600">
              <Loader2 className="animate-spin" size={20} />
              <span className="font-medium text-sm">Cargando dueños...</span>
            </div>
          </div>
        )}

        {/* Tabla Responsive */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Propietario</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center sticky right-0 bg-slate-50">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading && duenos.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <UserCircle size={48} className="text-slate-300" />
                      <p className="text-base font-medium text-slate-600">No hay dueños registrados</p>
                      <p className="text-sm">Haz clic en "Nuevo Dueño" para comenzar.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                duenos.map((dueno: any) => (
                  <tr key={dueno.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-sm">
                          {dueno.user?.name ? dueno.user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{dueno.user?.name || "Sin Nombre"}</p>
                          <p className="text-xs text-slate-400">ID: {dueno.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone size={14} className="text-slate-400" />
                          {dueno.user?.phone || <span className="text-slate-400 italic">Sin teléfono</span>}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail size={14} className="text-slate-400" />
                          {dueno.user?.email || <span className="text-slate-400 italic">Sin email</span>}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 sticky right-0 bg-white group-hover:bg-slate-50/80 transition-colors border-l border-slate-50">
                      <div className="flex justify-center gap-2">
                        
                        {/* Botón Editar */}
                        <button 
                          onClick={() => {
                            setDuenoSelect(dueno); 
                            modalAbrirEdit();
                          }} 
                          className="p-2 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors" 
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        
                        {/* Botón Eliminar conectado a la función */}
                        <button 
                          onClick={() => handleDelete(dueno.id, dueno.user?.name)}
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

      {/* Renderizado del Modal de Crear */}
      {modalcreate && (
        <CreateModalOwners 
          onClose={() => setModalCreate(false)} 
          onUpdated={extraerDuenos} 
        />
      )}

      {/* Renderizado del Modal de Editar */}
      {modaledit && selectdueno && (
        <EditModalOwners
          onClose={() => setModalEdit(false)} 
          onUpdated={extraerDuenos} 
          dueno={selectdueno}
        />
      )}
      
    </div>
  );
}