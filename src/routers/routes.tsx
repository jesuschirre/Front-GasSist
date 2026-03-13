import { Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Home from "../pages/Home"
import Usuarios from "../pages/Usuarios"
import MainLayout from "../pages/MainLayout"
import Vehiculos from "../pages/Vehiculos"
import Services from "../pages/Services"
import Owners from "../pages/Owners"
import Configuraciones from "../pages/Configuraciones"
import Tecnicos from "../pages/Tecnicos"
import Admins from "../pages/Admins"
import Tipo_servicio from "../pages/Tipo_servicio"

// Importa tu componente de protección (ajusta la ruta según dónde lo hayas guardado)
import ProtectRoute from "../hooks/ProtectRoute"

export default function AppRoutes() { // Es buena práctica que los componentes empiecen con mayúscula
  return (
    <Routes>
      {/* 🔓 RUTAS PÚBLICAS */}
      <Route path="/login" element={<Login/>}/>

      {/* 🔒 RUTAS PRIVADAS (Protegidas por ProtectRoute) */}
      <Route element={<ProtectRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="duenos" element={<Owners />} />
          <Route path="vehiculos" element={<Vehiculos />} />
          <Route path="services" element={<Services />} />
          <Route path="tecnicos" element={<Tecnicos />} />
          <Route path="admins" element={<Admins />} />
          <Route path="configuraciones" element={<Configuraciones />} />
          <Route path="tipo-servicio" element={<Tipo_servicio />} />
        </Route>
      </Route>
      
    </Routes>
  )
}