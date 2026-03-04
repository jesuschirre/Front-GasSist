import { Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Home from "../pages/Home"
import Usuarios from "../pages/Usuarios"
import MainLayout from "../pages/MainLayout"
import Vehiculos from "../pages/Vehiculos"
import Services from "../pages/Services"
import Configuraciones from "../pages/Configuraciones"

export default function routes() {
  return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="usuarios" element={<Usuarios />} />
                <Route path="vehiculos" element={<Vehiculos />} />
                <Route path="services" element={<Services />} />
                <Route path="configuraciones" element={<Configuraciones />} />
            </Route>
        </Routes>
  )
}
