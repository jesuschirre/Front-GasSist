import { useState } from "react";
import { 
  X, User, Phone, Mail, Wrench, BadgeIcon, Award, AlertCircle, Loader2, PenSquare 
} from 'lucide-react';
import { putTechnician } from "../../store/CrudTecnicos";
import Swal from "sweetalert2";

interface EditProps {
  onClose: () => void;
  onUpdated: () => void;
  tecnico: any; // El objeto completo de la tabla
}

export default function EditModalTecnicos({ onClose, onUpdated, tecnico }: EditProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Inicializamos solo con los campos permitidos por tu método update en Laravel
  const [form, setForm] = useState({
    name: tecnico?.user?.name || "",
    phone: tecnico?.user?.phone || "",
    email: tecnico?.user?.email || "",
    specialty: tecnico?.specialty || "",
    license_number: tecnico?.license_number || "",
    experience_years: tecnico?.experience_years || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    const payload = {
      ...form,
      experience_years: form.experience_years ? Number(form.experience_years) : null
    };

    try {
      await putTechnician(tecnico.id, payload);
      Swal.fire({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 3000,
        icon: 'success', title: 'Técnico actualizado exitosamente',
        customClass: { popup: 'rounded-xl shadow-lg border border-slate-100' }
      });
      onUpdated();
      onClose();
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrorMsg(error.response.data.message || "Verifique los datos (Ej. Email ya en uso).");
      } else {
        setErrorMsg("Ocurrió un error inesperado al conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        
        <div className="relative px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 text-violet-600 rounded-lg relative">
              <User size={20} />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm text-violet-600">
                 <PenSquare size={12} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Editar Técnico</h2>
              <p className="text-xs text-slate-500 truncate max-w-50">Actualizando: {tecnico?.user?.name}</p>
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
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* SECCIÓN: Datos Personales */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">1. Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Nombre Completo *</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Teléfono</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500" maxLength={9} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Correo Electrónico</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN: Profesional */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">2. Perfil Profesional</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Especialidad</label>
                  <div className="relative group">
                    <Wrench className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input type="text" name="specialty" value={form.specialty} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Años de Exp.</label>
                  <div className="relative group">
                    <Award className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input type="number" name="experience_years" min="0" value={form.experience_years} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500" />
                  </div>
                </div>
                <div className="space-y-1.5 md:col-span-3">
                  <label className="text-sm font-semibold text-slate-700">Nro. de Licencia (Opcional)</label>
                  <div className="relative group">
                    <BadgeIcon className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input type="text" name="license_number" value={form.license_number} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Botones */}
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