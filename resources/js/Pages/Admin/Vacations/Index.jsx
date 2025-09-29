import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, vacations }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Vacaciones</h2>}
        >
            <Head title="Vacaciones" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Listado de Vacaciones</h3>
                            <Link
                                href={route('admin.vacations.create')}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Añadir
                            </Link>
                            <Link
                                href={route('admin.vacations.import.show')}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Importar CSV
                            </Link>

                            <Link
                                href={route('admin.vacations.export')}
                                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                            >
                                Exportar CSV
                            </Link>

                            <a
                                href={route('admin.vacations.template')}
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                                Descargar Plantilla
                            </a>

                        </div>

                        <table className="w-full border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 border">Usuario</th>
                                    <th className="p-2 border">Legajo</th>
                                    <th className="p-2 border">Inicio</th>
                                    <th className="p-2 border">Fin</th>
                                    <th className="p-2 border">Días</th>
                                    <th className="p-2 border">Estado</th>
                                    <th className="p-2 border">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vacations.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">
                                            No hay registros
                                        </td>
                                    </tr>
                                )}
                                {vacations.map((v) => (
                                    <tr key={v.id}>
                                        <td className="p-2 border">{v.user?.nombre}</td>
                                        <td className="p-2 border">{v.legajo}</td>
                                        <td className="p-2 border">{v.fecha_inicio}</td>
                                        <td className="p-2 border">{v.fecha_fin}</td>
                                        <td className="p-2 border">{v.dias}</td>
                                        <td className="p-2 border">{v.estado}</td>
                                        <td className="p-2 border flex gap-2">
                                            <Link
                                                href={route('admin.vacations.edit', v.id)}
                                                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    confirm('¿Seguro que deseas eliminar este registro?') &&
                                                    router.delete(route('admin.vacations.destroy', v.id))
                                                }
                                                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
