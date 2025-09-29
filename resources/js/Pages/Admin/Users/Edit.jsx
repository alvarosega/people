// resources/js/Pages/Admin/Users/Edit.jsx
import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ user, roles, regions }) {
    const { data, setData, errors, put, processing } = useForm({
        region: user.region,
        legajo: user.legajo,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        territorio: user.territorio || '',
        puesto: user.puesto || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar Usuario</h2>}
        >
            <Head title="Editar Usuario" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Usuario: {user.nombre}</h1>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Legajo *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.legajo}
                                            onChange={(e) => setData('legajo', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            required
                                        />
                                        {errors.legajo && <div className="text-red-600 text-sm">{errors.legajo}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nombre}
                                            onChange={(e) => setData('nombre', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            required
                                        />
                                        {errors.nombre && <div className="text-red-600 text-sm">{errors.nombre}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Rol *
                                        </label>
                                        <select
                                            value={data.rol}
                                            onChange={(e) => setData('rol', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            required
                                            disabled={user.rol === 'admin'}
                                        >
                                            {roles.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                        {errors.rol && <div className="text-red-600 text-sm">{errors.rol}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Región *
                                        </label>
                                        <select
                                            value={data.region}
                                            onChange={(e) => setData('region', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            required
                                        >
                                            <option value="">Seleccionar región</option>
                                            {regions.map(region => (
                                                <option key={region} value={region}>{region}</option>
                                            ))}
                                        </select>
                                        {errors.region && <div className="text-red-600 text-sm">{errors.region}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            required
                                        />
                                        {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Territorio
                                        </label>
                                        <input
                                            type="text"
                                            value={data.territorio}
                                            onChange={(e) => setData('territorio', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                        {errors.territorio && <div className="text-red-600 text-sm">{errors.territorio}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Puesto
                                        </label>
                                        <input
                                            type="text"
                                            value={data.puesto}
                                            onChange={(e) => setData('puesto', e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                        {errors.puesto && <div className="text-red-600 text-sm">{errors.puesto}</div>}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <a
                                        href={route('admin.users.index')}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Cancelar
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {processing ? 'Actualizando...' : 'Actualizar Usuario'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}