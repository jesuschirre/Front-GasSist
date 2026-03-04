import { useEffect, useState } from "react";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { getClients, deleteClients } from "../store/CrudClientes";
import type { Client } from "../store/CrudClientes";
import DataTable, { type TableColumn } from "react-data-table-component";
import Swal from "sweetalert2";
import EditModalClients from "./formularios/editModalClients";
import CreateModalClients from "./formularios/createModalClients";

export default function Usuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<Client[]>([]);
  const [ModalEdit, setModalEdit] = useState (false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Cargar clientes
  const fetchClients = async () => {
    try {
      const clients = await getClients();
      setUsers(clients.data);
    } catch (error) {
      console.error("Error al cargar clientes", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  /* =======================
     Handlers
  ======================= */
  const toggleModal = () => setIsModalOpen(!isModalOpen);


  const EliminarCliente = async ( id : number ) => {
    const result = await Swal.fire({
      title: "¿Eliminar cliente?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;
    try {
      await deleteClients(id)
      await fetchClients();
    } catch (error) {
      console.error("Error al crear cliente", error);
    }
  }

  const columns: TableColumn<Client>[] = [
    {
      name: "Nombre",
      selector: row => row.user.name,
      sortable: true,
    },
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Celular",
      selector: row => row.user.phone ?? "null",
    },
    {
      name: "Dirección",
      selector: row => row.address ?? "No especificada",

    },
    {
      name: "Acciones",
      cell: row => (
        <div className="flex gap-2">
          <button  onClick={() => {
            setSelectedClient(row);
            setModalEdit(true);
          }}  className="p-2 text-blue-600 hover:bg-blue-50 rounded">
            <Pencil size={18} />
          </button>
          <button onClick={() => {EliminarCliente(row.id)}} className="p-2 text-red-600 hover:bg-red-50 rounded">
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="p-8 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-500 text-sm">
            Administra los clientes y usuarios del sistema
          </p>
        </div>

        <button
          onClick={toggleModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold"
        >
          <UserPlus size={20} />
          Nuevo Usuario
        </button>
        
      </div>
      
      <div className="bg-white rounded-xl shadow ">
        <DataTable
          columns={columns}
          data={users}
          pagination
          highlightOnHover
          striped
          noDataComponent={
            <div className="py-6 text-gray-400">
              No hay clientes registrados
            </div>
          }
          paginationComponentOptions={{
            rowsPerPageText: "Filas por página",
            rangeSeparatorText: "de",
          }}
        />
      </div>
      {isModalOpen && <CreateModalClients 
                        onClose={() => setIsModalOpen(false)} 
                        onUpdated={fetchClients} />}
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