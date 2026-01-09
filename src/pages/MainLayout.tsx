import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Package, BarChart3, Bell } from 'lucide-react';
import { Car } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-indigo-400 flex items-center gap-2">
            <Package size={28} />
            MiPanel
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-2"> 
          <NavItem 
            to="/" 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={location.pathname === "/"} 
          />
          <NavItem 
            to="/usuarios" 
            icon={<Users size={20} />} 
            label="Usuarios" 
            active={location.pathname === "/usuarios"} 
          />
          <NavItem 
            to="/vehiculos" 
            icon={<Car size={20} />} 
            label="Vehículos" 
            active={location.pathname === "/vehiculos"} 
            />
          <NavItem to="#" icon={<Settings size={20} />} label="Configuración" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full px-4 py-2">
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO DERECHO */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-800 uppercase tracking-tight">Panel Administrativo</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">U</div>
          </div>
        </header>

        <main className="p-8">
          {/* Aquí se renderizará Home o Usuarios según la ruta */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}