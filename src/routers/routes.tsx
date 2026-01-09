import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Home from "../pages/Home"
import Usuarios from "../pages/Usuarios"
import MainLayout from "../pages/MainLayout"
import Vehiculos from "../pages/Vehiculos"

export default function routes() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="usuarios" element={<Usuarios />} />
                <Route path="vehiculos" element={<Vehiculos />} />
            </Route>
        </Routes>
    </BrowserRouter>
  )
}
