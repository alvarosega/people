import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User, Mail, Shield, MapPin, Briefcase, Save, ArrowLeft } from 'lucide-react';

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
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                        <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-gray-900 dark:text-white">Crear Usuario</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Registra un nuevo perfil en el directorio
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Crear Usuario" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header de la tarjeta */}
                    <div className="mb-6 flex items-center justify-between">
                        <Link
                            href={route('admin.users.index')}
                            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-sm font-medium"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al directorio
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Información del Perfil</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Completa los campos requeridos marcados con asterisco (*)</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* Legajo */}
                                <div>
                                    <label htmlFor="legajo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Legajo <span className="text-blue-600 dark:text-blue-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            id="legajo"
                                            type="text"
                                            value={data.legajo}
                                            onChange={(e) => setData('legajo', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2 border ${errors.legajo ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                                            placeholder="Ej: L-00123"
                                            required
                                        />
                                    </div>
                                    {errors.legajo && <p className="text-red-600 dark:text-red-400 text-xs mt-1.5">{errors.legajo}</p>}
                                </div>

                                {/* Nombre */}
                                <div>
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Nombre Completo <span className="text-blue-600 dark:text-blue-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            id="nombre"
                                            type="text"
                                            value={data.nombre}
                                            onChange={(e) => setData('nombre', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2 border ${errors.nombre ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                                            placeholder="Nombre del empleado"
                                            required
                                        />
                                    </div>
                                    {errors.nombre && <p className="text-red-600 dark:text-red-400 text-xs mt-1.5">{errors.nombre}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Correo Electrónico <span className="text-blue-600 dark:text-blue-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                                            placeholder="correo@empresa.com"
                                            required
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-600 dark:text-red-400 text-xs mt-1.5">{errors.email}</p>}
                                </div>

                                {/* Rol */}
                                <div>
                                    <label htmlFor="rol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Rol del Sistema <span className="text-blue-600 dark:text-blue-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Shield className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <select
                                            id="rol"
                                            value={data.rol}
                                            onChange={(e) => setData('rol', e.target.value)}
                                            className={`w-full pl-10 pr-8 py-2 border ${errors.rol ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white appearance-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                                            required
                                        >
                                            {roles.map(role => (
                                                <option key={role} value={role} className="capitalize">{role}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <ChevronDown className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                    {errors.rol && <p className="text-red-600 dark:text-red-400 text-xs mt-1.5">{errors.rol}</p>}
                                </div>

                                {/* Región */}
                                <div>
                                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Región <span className="text-blue-600 dark:text-blue-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <select
                                            id="region"
                                            value={data.region}
                                            onChange={(e) => setData('region', e.target.value)}
                                            className={`w-full pl-10 pr-8 py-2 border ${errors.region ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white appearance-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                                            required
                                        >
                                            <option value="">Seleccionar región</option>
                                            {regions.map(region => (
                                                <option key={region} value={region}>{region}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <ChevronDown className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                    {errors.region && <p className="text-red-600 dark:text-red-400 text-xs mt-1.5">{errors.region}</p>}
                                </div>

                                {/* Territorio */}
                                <div>
                                    <label htmlFor="territorio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Territorio
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            id="territorio"
                                            type="text"
                                            value={data.territorio}
                                            onChange={(e) => setData('territorio', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2 border ${errors.territorio ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                                            placeholder="Opcional"
                                        />
                                    </div>
                                    {errors.territorio && <p className="text-red-600 dark:text-red-400 text-xs mt-1.5">{errors.territorio}</p>}
                                </div>

                                {/* Puesto */}
                                <div>
                                    <label htmlFor="puesto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Puesto <span className="text-blue-600 dark:text-blue-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Briefcase className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            id="puesto"
                                            type="text"
                                            value={data.puesto}
                                            onChange={(e) => setData('puesto', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2 border ${errors.puesto ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
                                            placeholder="Cargo que desempeña"
                                            required
                                        />
                                    </div>
                                    {errors.puesto && <p className="text-red-600 dark:text-red-400 text-xs mt-1.5">{errors.puesto}</p>}
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
                                <Link
                                    href={route('admin.users.index')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            <span>Guardando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            <span>Guardar Usuario</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Necesitamos importar ChevronDown para los selects
import { ChevronDown } from 'lucide-react';