import { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import type { Client, CreateClientDTO } from "../../store/CrudClientes";
import { editClients } from "../../store/CrudClientes";

interface EditModalClientsProps {
  client: Client;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditModalClients({
  client,
  onClose,
  onUpdated,
}: EditModalClientsProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<CreateClientDTO>({
    name: client.user.name,
    phone: client.user.phone ?? "",
    email: client.user.email ?? "",
    address: client.address ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await editClients( form, client.id);

      Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "Cliente actualizado correctamente",
        timer: 1500,
        showConfirmButton: false,
      });

      onUpdated(); // refresca tabla
      onClose();   // cierra modal
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el cliente", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Editar Cliente</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Celular"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Dirección"
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border py-2 rounded"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 rounded"
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}