import React, { useState } from 'react';
import { UserPlus, Pencil, Trash2, X, Search } from 'lucide-react';

export default function Usuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, nombres: 'Juan', apellidos: 'Pérez', dni: '12345678', celular: '987654321', direccion: 'Av. Siempre Viva 123' },
    { id: 2, nombres: 'Maria', apellidos: 'García', dni: '87654321', celular: '912345678', direccion: '' },
  ]);

  // Función para abrir/cerrar modal
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Encabezado de Sección */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-gray-500 text-sm">Administra los clientes y usuarios de tu sistema</p>
        </div>
        
        <button 
          onClick={toggleModal}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95"
        >
          <UserPlus size={20} />
          Nuevo Usuario
        </button>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Nombre Completo</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">DNI</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Celular</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Dirección</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {user.nombres} {user.apellidos}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.dni}</td>
                  <td className="px-6 py-4 text-gray-600">{user.celular}</td>
                  <td className="px-6 py-4 text-gray-500 italic text-sm">
                    {user.direccion || 'No especificada'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                        <Pencil size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
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

      {/* MODAL PARA NUEVO USUARIO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Registrar Nuevo Usuario</h2>
              <button onClick={toggleModal} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            {/* Formulario */}
            <form className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nombres</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Ej. Juan" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Apellidos</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Ej. Pérez" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">DNI</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="8 dígitos" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nro de Celular</label>
                  <input type="tel" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="999 999 999" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Dirección <span className="text-gray-400 font-normal">(Opcional)</span></label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Av. Principal #123" />
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={toggleModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md transition-colors"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}