import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function EditRegistro({ auth, registro }) {
  const { data, setData, put, processing, errors } = useForm({
    variable_100: registro.variable_100 || "",
    devol_alimen: registro.devol_alimen || "",
    dev_territorio: registro.dev_territorio || "",
    dev_casa: registro.dev_casa || "",
    comentario: registro.comentario || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("admin.base-llegada.update", registro.id), {
      onSuccess: () => {
        // redirigir manualmente si es necesario
        window.location.href = route("admin");
      },
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Editar Registro</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Variable 100</label>
            <input type="number" value={data.variable_100}
              onChange={(e) => setData("variable_100", e.target.value)}
              className="w-full border rounded px-3 py-2" />
            {errors.variable_100 && <p className="text-red-500 text-sm">{errors.variable_100}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Devolución Alimentación</label>
            <input type="number" value={data.devol_alimen}
              onChange={(e) => setData("devol_alimen", e.target.value)}
              className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium">Devolución Territorio</label>
            <input type="number" value={data.dev_territorio}
              onChange={(e) => setData("dev_territorio", e.target.value)}
              className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium">Devolución Casa</label>
            <input type="number" value={data.dev_casa}
              onChange={(e) => setData("dev_casa", e.target.value)}
              className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium">Comentario</label>
            <textarea value={data.comentario}
              onChange={(e) => setData("comentario", e.target.value)}
              className="w-full border rounded px-3 py-2" />
          </div>

          <button type="submit" disabled={processing}
            className="bg-brand-gold text-white px-4 py-2 rounded">
            Guardar cambios
          </button>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
