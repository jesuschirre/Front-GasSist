import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Settings, LogOut, Package, 
  ShoppingCart, Car, Menu, X, HardHat, HandPlatter
} from 'lucide-react';
import { UserAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { user, HandleLogout } = UserAuth()
  const location = useLocation();
  // Estado para controlar si el panel está abierto en móviles/tablets
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const primeraLetra2 = user?.name[0];
  // Función para cerrar el panel (útil al hacer clic en un enlace)
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    // CAMBIO 1: Cambiamos 'min-h-screen' por 'h-screen overflow-hidden'
    // Esto congela el tamaño de toda la pantalla y evita el scroll general del navegador
    <div className="flex h-screen overflow-hidden bg-slate-50 relative">
      
      {/* OVERLAY (Fondo oscuro) - Solo visible en móvil cuando el menú está abierto */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={closeSidebar} // Si hacen clic afuera, se cierra
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col h-screen transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-indigo-400 flex items-center gap-2">
            <Package size={28} className="text-violet-400" />
            MantWeb
          </h2>
          {/* Botón de cerrar solo visible en móvil/tablet */}
          <button 
            onClick={closeSidebar} 
            className="lg:hidden p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar"> 
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" active={location.pathname === "/"} onClick={closeSidebar} />
          <NavItem to="/usuarios" icon={<Users size={20} />} label="Clientes" active={location.pathname === "/usuarios"} onClick={closeSidebar} />
          <NavItem to="/duenos" icon={<Users size={20} />} label="Dueños" active={location.pathname === "/duenos"} onClick={closeSidebar} />
          <NavItem to="/admins" icon={<Users size={20} />} label="Usuarios" active={location.pathname === "/admins"} onClick={closeSidebar} />
          <NavItem to="/tecnicos" icon={<HardHat size={20} />} label="tecnicos" active={location.pathname === '/tecnicos'} onClick={closeSidebar} />
          <NavItem to="/vehiculos" icon={<Car size={20} />} label="Vehículos" active={location.pathname === "/vehiculos"} onClick={closeSidebar} />
          <NavItem to="/services" icon={<HandPlatter size={20} />} label="Servicios" active={location.pathname === '/services'} onClick={closeSidebar} />
          <NavItem to="/tipo-servicio" icon={<ShoppingCart size={20} />} label="Tipo de Servicio" active={location.pathname === '/tipo-servicio'} onClick={closeSidebar} />
          <NavItem to="/configuraciones" icon={<Settings size={20} />} label="Configuración" active={location.pathname === '/configuraciones'} onClick={closeSidebar} />

        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={HandleLogout} className="flex items-center gap-3 text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 transition-colors w-full px-4 py-2.5 rounded-lg">
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO DERECHO */}
      {/* CAMBIO 2: Añadimos 'overflow-y-auto' a este contenedor */}
      {/* Esto hace que SOLO esta sección tenga scroll, dejando el panel izquierdo fijo */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar"> 
        
        <header className="bg-white/80 backdrop-blur-md shadow-sm h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 border-b border-slate-100">
          
          <div className="flex items-center gap-3">
            {/* Botón Hamburguesa - Solo visible en móvil/tablet (< 1024px) */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg lg:hidden transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-slate-800 tracking-tight hidden sm:block">
              BIENVENIDO {user?.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-full relative transition-colors">
              {/*<Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>*/}
            </button>
            <div className="uppercase h-9 w-9 bg-linear-to-tr from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:scale-105 transition-transform">
              {primeraLetra2}
            </div>
          </div>
        </header>

        {/* CAMBIO 3: Quitamos el 'overflow-x-hidden' del main ya que el scroll ahora lo maneja el padre */}
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, active, onClick }: { to: string, icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/20 font-semibold' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}