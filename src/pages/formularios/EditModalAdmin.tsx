import { useState } from "react";
import { 
  X, User, Mail, Phone, Key, AlertCircle, Loader2, UserCog, PenSquare 
} from 'lucide-react';
import { putAdmin } from "../../store/CrudAdmins";
import Swal from "sweetalert2";

interface EditProps {
  onClose: () => void;
  onUpdated: () => void;
  admin: any;
}

export default function EditModalAdmin({ onClose, onUpdated, admin }: EditProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: admin?.user?.name || "",
    email: admin?.user?.email || "",
    password: "", // Siempre en blanco al iniciar la edición
    phone: admin?.user?.phone || "",
    uid: admin?.uid || "",
  });
  console.log(admin)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Solo enviamos el password si el usuario escribió algo
    const payload: any = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      uid: form.uid,
    };

    if (form.password.trim() !== "") {
      payload.password = form.password;
    }

    try {
      await putAdmin(admin.id, payload);
      
      Swal.fire({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
        icon: 'success', title: 'Administrador actualizado correctamente',
        customClass: { popup: 'rounded-xl shadow-lg border border-slate-100' }
      });
      
      onUpdated();
      onClose();
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrorMsg(error.response.data.message || "Verifique los datos (Ej. El correo ya está en uso).");
      } else {
        setErrorMsg("Ocurrió un error inesperado al conectar con el servidor.");
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
            <div className="p-2 bg-violet-100 text-violet-600 rounded-lg relative">
              <UserCog size={20} />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm text-violet-600">
                 <PenSquare size={12} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Editar Administrador</h2>
              <p className="text-xs text-slate-500 truncate max-w-50">Editando a: {admin?.user?.name}</p>
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

        <div className="max-h-[75vh] overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Nombre Completo *</label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500" />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Correo Electrónico *</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Contraseña (Opcional)</label>
                <div className="relative group">
                  <Key className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input type="password" name="password" value={form.password} onChange={handleChange} minLength={8} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500" placeholder="Dejar en blanco para mantener" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Teléfono</label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input placeholder="Ej. 900122300" type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500" maxLength={9} />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-linear-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-200 disabled:opacity-70 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="animate-spin" size={18} /> Actualizando...</> : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}