import { useEffect, useState } from "react";
import { 
  UserPlus, Pencil, Trash2, Users, Phone, MapPin, UserCircle, Loader2 
} from "lucide-react";
import { getClients, deleteClients } from "../store/CrudClientes";
import type { Client } from "../store/CrudClientes";
import Swal from "sweetalert2";
import EditModalClients from "./formularios/editModalClients";
import CreateModalClients from "./formularios/createModalClients";

export default function Usuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<Client[]>([]);
  const [ModalEdit, setModalEdit] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar clientes
  const fetchClients = async () => {
    try {
      setLoading(true);
      const clients = await getClients();
      setUsers(clients.data || []);
    } catch (error) {
      console.error("Error al cargar clientes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  /* =======================
      Handlers
  ======================= */
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const EliminarCliente = async (id: number, name: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás a punto de eliminar al cliente ${name}. Esta acción no se puede deshacer.`,
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
      await deleteClients(id);
      
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: 'success',
        title: 'Cliente eliminado exitosamente',
        customClass: { popup: 'rounded-xl shadow-lg border border-slate-100' }
      });

      await fetchClients();
    } catch (error) {
      console.error("Error al eliminar cliente", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el cliente. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
        customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl' }
      });
    }
  };

  return (
    <div className="p-6 max-w-400 mx-auto animate-in fade-in duration-500 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-violet-100 text-violet-600 rounded-xl">
              <Users size={24} />
            </div>
            Gestión de Clientes
          </h1>
          <p className="text-slate-500 text-sm mt-1 ml-14">
            Administra los clientes y usuarios del sistema
          </p>
        </div>

        <button
          onClick={toggleModal}
          className="flex items-center justify-center gap-2 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-violet-200 active:scale-95"
        >
          <UserPlus size={20} />
          Nuevo Cliente
        </button>
      </div>
      
      {/* Contenedor Principal de la Tabla Nativa */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        
        {/* Estado de Carga (Overlay transparente) */}
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-violet-600">
              <Loader2 className="animate-spin" size={20} />
              <span className="font-medium text-sm">Cargando clientes...</span>
            </div>
          </div>
        )}

        {/* Tabla Responsive */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Celular</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dirección</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center sticky right-0 bg-slate-50">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* Renderizado Condicional: Estado Vacío */}
              {!loading && users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <UserCircle size={48} className="text-slate-300" />
                      <div className="text-center">
                        <p className="text-base font-medium text-slate-600">No hay clientes registrados</p>
                        <p className="text-sm">Haz clic en "Nuevo Cliente" para comenzar.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                /* Iteración de Datos */
                users.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                    
                    {/* Columna Cliente */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-sm shrink-0">
                          {row.user?.name ? row.user.name.charAt(0).toUpperCase() : "C"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{row.user?.name || "Sin Nombre"}</p>
                          <p className="text-xs text-slate-400">ID: {row.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Columna Celular */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone size={14} className="text-slate-400 shrink-0" />
                        {row.user?.phone || <span className="text-slate-400 italic">No registrado</span>}
                      </div>
                    </td>

                    {/* Columna Dirección */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 text-sm text-slate-600">
                        <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                        <span className="truncate max-w-62.5" title={row.address}>
                          {row.address || <span className="text-slate-400 italic">No especificada</span>}
                        </span>
                      </div>
                    </td>

                    {/* Columna Acciones (Pinned a la derecha) */}
                    <td className="px-6 py-4 sticky right-0 bg-white group-hover:bg-slate-50/80 transition-colors border-l border-slate-50">
                      <div className="flex justify-center gap-2">
                        <button  
                          onClick={() => {
                            setSelectedClient(row);
                            setModalEdit(true);
                          }}  
                          className="p-2 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => EliminarCliente(row.id, row.user?.name || "este cliente")} 
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

      {/* Renderizado de Modales */}
      {isModalOpen && (
        <CreateModalClients 
          onClose={() => setIsModalOpen(false)} 
          onUpdated={fetchClients} 
        />
      )}
      
      {ModalEdit && selectedClient && (
        <EditModalClients
          client={selectedClient}
          onClose={() => setModalEdit(false)}
          onUpdated={fetchClients}
        />
      )}

    </div>
  );
}