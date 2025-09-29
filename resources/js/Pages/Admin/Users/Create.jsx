// resources/js/Pages/Admin/Users/Create.jsx
import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ roles, regions }) {
    const { data, setData, errors, post, processing } = useForm({
        region: '',
        legajo: '',
        nombre: '',
        email: '',
        rol: 'user',
        territorio: '',
        puesto: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-text leading-tight">Crear Usuario</h2>}
        >
            <Head title="Crear Usuario" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-primary shadow-soft rounded-soft p-6">
                        <h1 className="text-2xl font-bold text-text mb-6">Crear Nuevo Usuario</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Legajo */}
                                <div>
                                    <label
                                        htmlFor="legajo"
                                        className="block text-sm font-medium text-text"
                                    >
                                        Legajo *
                                    </label>
                                    <input
                                        id="legajo"
                                        type="text"
                                        value={data.legajo}
                                        onChange={(e) => setData('legajo', e.target.value)}
                                        className="mt-1 block w-full rounded-soft border-gray-300 shadow-sm p-2"
                                        required
                                    />
                                    {errors.legajo && (
                                        <div className="text-red-600 text-sm mt-1">{errors.legajo}</div>
                                    )}
                                </div>

                                {/* Nombre */}
                                <div>
                                    <label
                                        htmlFor="nombre"
                                        className="block text-sm font-medium text-text"
                                    >
                                        Nombre *
                                    </label>
                                    <input
                                        id="nombre"
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        className="mt-1 block w-full rounded-soft border-gray-300 shadow-sm p-2"
                                        required
                                    />
                                    {errors.nombre && (
                                        <div className="text-red-600 text-sm mt-1">{errors.nombre}</div>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-text"
                                    >
                                        Email *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-soft border-gray-300 shadow-sm p-2"
                                        required
                                    />
                                    {errors.email && (
                                        <div className="text-red-600 text-sm mt-1">{errors.email}</div>
                                    )}
                                </div>
                                {/* Rol */}
                                <div>
                                    <label
                                        htmlFor="rol"
                                        className="block text-sm font-medium text-text"
                                    >
                                        Rol *
                                    </label>
                                    <select
                                        id="rol"
                                        value={data.rol}
                                        onChange={(e) => setData('rol', e.target.value)}
                                        className="mt-1 block w-full rounded-soft border-gray-300 shadow-sm p-2"
                                        required
                                    >
                                        {roles.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                    {errors.rol && (
                                        <div className="text-red-600 text-sm mt-1">{errors.rol}</div>
                                    )}
                                </div>

                                {/* Región */}
                                <div>
                                    <label
                                        htmlFor="region"
                                        className="block text-sm font-medium text-text"
                                    >
                                        Región *
                                    </label>
                                    <select
                                        id="region"
                                        value={data.region}
                                        onChange={(e) => setData('region', e.target.value)}
                                        className="mt-1 block w-full rounded-soft border-gray-300 shadow-sm p-2"
                                        required
                                    >
                                        <option value="">Seleccionar región</option>
                                        {regions.map(region => (
                                            <option key={region} value={region}>{region}</option>
                                        ))}
                                    </select>
                                    {errors.region && (
                                        <div className="text-red-600 text-sm mt-1">{errors.region}</div>
                                    )}
                                </div>

                                {/* Territorio */}
                                <div>
                                    <label
                                        htmlFor="territorio"
                                        className="block text-sm font-medium text-text"
                                    >
                                        Territorio
                                    </label>
                                    <input
                                        id="territorio"
                                        type="text"
                                        value={data.territorio}
                                        onChange={(e) => setData('territorio', e.target.value)}
                                        className="mt-1 block w-full rounded-soft border-gray-300 shadow-sm p-2"
                                    />
                                    {errors.territorio && (
                                        <div className="text-red-600 text-sm mt-1">{errors.territorio}</div>
                                    )}
                                </div>

                                {/* Puesto */}
                                <div>
                                    <label
                                        htmlFor="puesto"
                                        className="block text-sm font-medium text-text"
                                    >
                                        Puesto
                                    </label>
                                    <input
                                        id="puesto"
                                        type="text"
                                        value={data.puesto}
                                        onChange={(e) => setData('puesto', e.target.value)}
                                        className="mt-1 block w-full rounded-soft border-gray-300 shadow-sm p-2"
                                    />
                                    {errors.puesto && (
                                        <div className="text-red-600 text-sm mt-1">{errors.puesto}</div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-4 pt-4">
                                <Link
                                    href={route('admin.users.index')}
                                    className="bg-accent.silver hover:bg-gray-400 text-text font-semibold py-2 px-4 rounded-soft transition"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-accent.gold hover:bg-accent.yellow text-white font-semibold py-2 px-4 rounded-soft shadow-soft transition disabled:opacity-50"
                                >
                                    {processing ? 'Creando...' : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
