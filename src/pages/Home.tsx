export default function Home() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Ventas Totales" value="$12,450" change="+12%" />
        <StatCard title="Nuevos Clientes" value="48" change="+5%" />
        <StatCard title="Proyectos Activos" value="13" change="0%" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Actividad Reciente</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 bg-opacity-10 rounded-full flex items-center justify-center font-bold">
                  {i}
                </div>
                <div>
                  <p className="font-medium text-gray-700">Actualización de sistema #{i}</p>
                  <p className="text-sm text-gray-500">Hace 2 horas</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Completado</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{title}</p>
      <div className="flex items-end justify-between mt-2">
        <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
        <span className="text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded">{change}</span>
      </div>
    </div>
  );
}