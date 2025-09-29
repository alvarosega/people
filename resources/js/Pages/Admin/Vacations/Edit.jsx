import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, vacation, usuarios }) {
    const { data, setData, put, processing, errors } = useForm({
        legajo: vacation.legajo || '',
        fecha_inicio: vacation.fecha_inicio || '',
        fecha_fin: vacation.fecha_fin || '',
        dias: vacation.dias || '',
        estado: vacation.estado || 'pendiente',
        comentario: vacation.comentario || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.vacations.update', vacation.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar Vacaciones</h2>}
        >
            <Head title="Editar Vacaciones" />

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block font-medium">Usuario</label>
                                <select
                                    value={data.legajo}
                                    onChange={(e) => setData('legajo', e.target.value)}
                                    className="w-full border rounded p-2"
                                >
                                    <option value="">Seleccione</option>
                                    {usuarios.map((u) => (
                                        <option key={u.legajo} value={u.legajo}>
                                            {u.nombre} ({u.legajo})
                                        </option>
                                    ))}
                                </select>
                                {errors.legajo && <div className="text-red-600">{errors.legajo}</div>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium">Fecha Inicio</label>
                                    <input
                                        type="date"
                                        value={data.fecha_inicio}
                                        onChange={(e) => setData('fecha_inicio', e.target.value)}
                                        className="w-full border rounded p-2"
                                    />
                                    {errors.fecha_inicio && <div className="text-red-600">{errors.fecha_inicio}</div>}
                                </div>
                                <div>
                                    <label className="block font-medium">Fecha Fin</label>
                                    <input
                                        type="date"
                                        value={data.fecha_fin}
                                        onChange={(e) => setData('fecha_fin', e.target.value)}
                                        className="w-full border rounded p-2"
                                    />
                                    {errors.fecha_fin && <div className="text-red-600">{errors.fecha_fin}</div>}
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium">Días</label>
                                <input
                                    type="number"
                                    value={data.dias}
                                    onChange={(e) => setData('dias', e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                                {errors.dias && <div className="text-red-600">{errors.dias}</div>}
                            </div>

                            <div>
                                <label className="block font-medium">Estado</label>
                                <select
                                    value={data.estado}
                                    onChange={(e) => setData('estado', e.target.value)}
                                    className="w-full border rounded p-2"
                                >
                                    <option value="pendiente">Pendiente</option>
                                    <option value="aprobada">Aprobada</option>
                                    <option value="rechazada">Rechazada</option>
                                </select>
                                {errors.estado && <div className="text-red-600">{errors.estado}</div>}
                            </div>

                            <div>
                                <label className="block font-medium">Comentario</label>
                                <textarea
                                    value={data.comentario}
                                    onChange={(e) => setData('comentario', e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                                {errors.comentario && <div className="text-red-600">{errors.comentario}</div>}
                            </div>

                            <div className="flex justify-between">
                                <Link
                                    href={route('admin.vacations.index')}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Actualizar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
