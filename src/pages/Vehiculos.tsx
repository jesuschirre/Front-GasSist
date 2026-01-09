import React, { useState } from 'react';
import { Car, Plus, Pencil, Trash2, X, Gauge } from 'lucide-react';

export default function Vehiculos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Datos de ejemplo
  const [vehiculos, setVehiculos] = useState([
    { id: 1, placa: 'ABC-123', marca: 'Toyota', modelo: 'Hilux', kilometraje: '45,000' },
    { id: 2, placa: 'XYZ-789', marca: 'Hyundai', modelo: 'Tucson', kilometraje: '12,500' },
  ]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Encabezado del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Car className="text-indigo-600" size={28} />
            Gestión de Vehículos
          </h1>
          <p className="text-gray-500 text-sm">Control de flota, marcas y kilometraje</p>
        </div>
        
        <button 
          onClick={toggleModal}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md active:scale-95"
        >
          <Plus size={20} />
          Nuevo Vehículo
        </button>
      </div>

      {/* Tabla de Vehículos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Nro. Placa</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Marca</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Modelo</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Kilometraje</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehiculos.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded font-mono font-bold border border-gray-300">
                      {v.placa}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">{v.marca}</td>
                  <td className="px-6 py-4 text-gray-600">{v.modelo}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Gauge size={16} className="text-gray-400" />
                      {v.kilometraje} km
                    </div>
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

      {/* MODAL PARA NUEVO VEHÍCULO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Registrar Vehículo</h2>
              <button onClick={toggleModal} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            {/* Formulario */}
            <form className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Número de Placa</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all uppercase" 
                  placeholder="Ej. ABC-123" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Marca</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    placeholder="Ej. Toyota" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Modelo</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    placeholder="Ej. Hilux" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Kilometraje actual</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    placeholder="0" 
                  />
                  <span className="absolute right-4 top-2 text-gray-400 font-medium">km</span>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-6">
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
                  Guardar Vehículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}