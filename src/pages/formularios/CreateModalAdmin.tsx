import { useState, useEffect } from "react";
import { 
  X, User, Mail, Phone, Key, AlertCircle, Loader2, UserCog, Shield, ChevronDown 
} from 'lucide-react';
import { postAdmin } from "../../store/CrudAdmins";
import Swal from "sweetalert2";
import { getRoles } from "../../store/CrudRoles";

interface CreateProps {
  onClose: () => void;
  onUpdated: () => void;
}

export default function CreateModalAdmin({ onClose, onUpdated }: CreateProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados para los roles
  const [roles, setRoles] = useState<any[]>([]);
  const [searchRole, setSearchRole] = useState("");
  const [isOpenRole, setIsOpenRole] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role_name: "" // Aquí guardaremos el nombre del rol seleccionado
  });

  // Cargar roles al abrir el modal
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data || []);
      } catch (error) {
        console.error("Error al cargar roles:", error);
      }
    };
    fetchRoles();
  }, []);

  // Lógica de filtrado para el buscador
  const filteredRoles = roles.filter(r =>
    (r.name || "").toLowerCase().includes(searchRole.toLowerCase())
  );

  const handleSelectRole = (r: any) => {
    setForm({ ...form, role_name: r.name });
    setSearchRole(r.name);
    setIsOpenRole(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const payload = { ...form };

    try {
      await postAdmin(payload);
      
      Swal.fire({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
        icon: 'success', title: 'Administrador creado en el sistema y Supabase',
        customClass: { popup: 'rounded-xl shadow-lg border border-slate-100' }
      });
      
      onUpdated();
      onClose();
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrorMsg(error.response.data.message || "Verifique los datos (Ej. El correo ya está en uso).");
      } else if (error.response?.status === 403 || error.response?.status === 401) {
        setErrorMsg("Problema de autenticación con Supabase o no tienes permisos.");
      } else {
        setErrorMsg("Error del servidor. Revisa que las credenciales de Supabase sean correctas.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        
        <div className="relative px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
              <UserCog size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Nuevo Administrador</h2>
              <p className="text-xs text-slate-500">Crear usuario con privilegios de sistema</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200/50 rounded-full">
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 text-rose-600 rounded-xl flex gap-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* El wrapper que permite el scroll de todo el formulario */}
        <div className="max-h-[75vh] overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-6 space-y-5 pb-2">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Nombre Completo *</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 transition-all" placeholder="Ej. Ana Lilia" />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Correo Electrónico *</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 transition-all" placeholder="admin@empresa.com" />
                </div>
              </div>

              {/* BUSCADOR DE ROL AÑADIDO (Ocupa 2 columnas para verse bien alineado) */}
              <div className="space-y-1.5 md:col-span-2 relative z-50">
                <label className="text-sm font-semibold text-slate-700">Rol del Sistema *</label>
                <div className="relative group">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    value={searchRole}
                    onChange={(e) => {
                      setSearchRole(e.target.value);
                      setIsOpenRole(true);
                      if(form.role_name) setForm({...form, role_name: ""});
                    }}
                    onFocus={() => setIsOpenRole(true)}
                    placeholder="Buscar rol (Ej. Administrador)..."
                    required={!form.role_name}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all placeholder:text-slate-400 text-slate-700"
                  />
                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform ${isOpenRole ? 'rotate-180' : ''}`} size={18} />
                </div>

                {isOpenRole && (
                  <>
                    {/* Capa invisible para cerrar al hacer clic afuera */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpenRole(false)} />
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar">
                      {filteredRoles.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-slate-500 text-center">No se encontraron roles</div>
                      ) : (
                        filteredRoles.map((r) => (
                          <div 
                            key={r.id} onClick={() => handleSelectRole(r)}
                            className={`px-4 py-2.5 cursor-pointer hover:bg-violet-50 text-sm ${form.role_name === r.name ? 'bg-violet-50 font-bold text-violet-700' : 'text-slate-700'}`}
                          >
                            {r.name}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* La Contraseña y el Teléfono quedan divididos a 1 columna c/u */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Contraseña *</label>
                <div className="relative group">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 transition-all" placeholder="Mínimo 8 caracteres" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Teléfono (Opcional)</label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500 transition-all" placeholder="Ej. 987654321" maxLength={9} />
                </div>
              </div>

            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-100 mt-6 relative z-10">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all">
                Cancelar
              </button>
              {/* Botón deshabilitado si falta el rol */}
              <button type="submit" disabled={loading || !form.role_name} className="flex-1 px-4 py-2.5 bg-linear-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-200 disabled:opacity-70 flex items-center justify-center gap-2 transition-all">
                {loading ? <><Loader2 className="animate-spin" size={18} /> Creando administrador...</> : "Guardar Administrador"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}