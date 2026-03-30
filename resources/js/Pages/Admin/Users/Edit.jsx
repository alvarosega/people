// resources/js/Pages/Admin/Users/Edit.jsx
import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User, Mail, Shield, MapPin, Briefcase, Save, ArrowLeft } from 'lucide-react';

export default function Edit({ user, roles, regions }) {
    const { data, setData, errors, put, processing } = useForm({
        region: user.region || '',
        legajo: user.legajo || '',
        nombre: user.nombre || '',
        email: user.email || '',
        rol: user.rol || 'user',
        territorio: user.territorio || '',
        puesto: user.puesto || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-accent to-accent-gold shadow-lg shadow-yellow-500/20">
                        <User className="h-6 w-6 text-black" />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-text-primary">Editar Usuario</h2>
                        <p className="text-text-secondary text-sm">
                            Modifica los datos del perfil seleccionado
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Editar ${user.nombre}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header de la tarjeta */}
                    <div className="mb-6 flex items-center justify-between">
                        <Link
                            href={route('admin.users.index')}
                            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors text-sm font-medium"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al directorio
                        </Link>
                    </div>

                    <div className="bg-primary/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-white/5">
                            <h3 className="text-lg font-bold text-text-primary">Actualizar Información: {user.nombre}</h3>
                            <p className="text-sm text-text-secondary mt-1">Completa los campos requeridos marcados con asterisco (*)</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* Legajo */}
                                <div>
                                    <label htmlFor="legajo" className="block text-sm font-medium text-text-secondary mb-1.5">
                                        Legajo <span className="text-accent">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-text-secondary group-focus-within:text-accent transition-colors" />
                                        </div>
                                        <input
                                            id="legajo"
                                            type="text"
                                            value={data.legajo}
                                            onChange={(e) => setData('legajo', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.legajo ? 'border-red-500' : 'border-white/10'} rounded-xl text-text-primary placeholder-text-secondary/60 focus:border-accent focus:ring-1 focus:ring-accent transition-all`}
                                            required
                                        />
                                    </div>
                                    {errors.legajo && <p className="text-red-400 text-xs mt-1.5">{errors.legajo}</p>}
                                </div>

                                {/* Nombre */}
                                <div>
                                    <label htmlFor="nombre" className="block text-sm font-medium text-text-secondary mb-1.5">
                                        Nombre Completo <span className="text-accent">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-text-secondary group-focus-within:text-accent transition-colors" />
                                        </div>
                                        <input
                                            id="nombre"
                                            type="text"
                                            value={data.nombre}
                                            onChange={(e) => setData('nombre', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.nombre ? 'border-red-500' : 'border-white/10'} rounded-xl text-text-primary placeholder-text-secondary/60 focus:border-accent focus:ring-1 focus:ring-accent transition-all`}
                                            required
                                        />
                                    </div>
                                    {errors.nombre && <p className="text-red-400 text-xs mt-1.5">{errors.nombre}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
                                        Correo Electrónico <span className="text-accent">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-text-secondary group-focus-within:text-accent transition-colors" />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl text-text-primary placeholder-text-secondary/60 focus:border-accent focus:ring-1 focus:ring-accent transition-all`}
                                            required
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                                </div>

                                {/* Rol */}
                                <div>
                                    <label htmlFor="rol" className="block text-sm font-medium text-text-secondary mb-1.5">
                                        Rol del Sistema <span className="text-accent">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Shield className="h-4 w-4 text-text-secondary group-focus-within:text-accent transition-colors" />
                                        </div>
                                        <select
                                            id="rol"
                                            value={data.rol}
                                            onChange={(e) => setData('rol', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.rol ? 'border-red-500' : 'border-white/10'} rounded-xl text-text-primary appearance-none focus:border-accent focus:ring-1 focus:ring-accent transition-all [&>option]:bg-primary [&>option]:text-white capitalize disabled:opacity-50 disabled:cursor-not-allowed`}
                                            required
                                            disabled={user.rol === 'admin'}
                                        >
                                            {roles.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.rol && <p className="text-red-400 text-xs mt-1.5">{errors.rol}</p>}
                                </div>

                                {/* Región */}
                                <div>
                                    <label htmlFor="region" className="block text-sm font-medium text-text-secondary mb-1.5">
                                        Región <span className="text-accent">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-4 w-4 text-text-secondary group-focus-within:text-accent transition-colors" />
                                        </div>
                                        <select
                                            id="region"
                                            value={data.region}
                                            onChange={(e) => setData('region', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.region ? 'border-red-500' : 'border-white/10'} rounded-xl text-text-primary appearance-none focus:border-accent focus:ring-1 focus:ring-accent transition-all [&>option]:bg-primary [&>option]:text-white`}
                                            required
                                        >
                                            <option value="">Seleccionar región</option>
                                            {regions.map(region => (
                                                <option key={region} value={region}>{region}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.region && <p className="text-red-400 text-xs mt-1.5">{errors.region}</p>}
                                </div>

                                {/* Territorio */}
                                <div>
                                    <label htmlFor="territorio" className="block text-sm font-medium text-text-secondary mb-1.5">
                                        Territorio
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-4 w-4 text-text-secondary group-focus-within:text-accent transition-colors" />
                                        </div>
                                        <input
                                            id="territorio"
                                            type="text"
                                            value={data.territorio}
                                            onChange={(e) => setData('territorio', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.territorio ? 'border-red-500' : 'border-white/10'} rounded-xl text-text-primary placeholder-text-secondary/60 focus:border-accent focus:ring-1 focus:ring-accent transition-all`}
                                        />
                                    </div>
                                    {errors.territorio && <p className="text-red-400 text-xs mt-1.5">{errors.territorio}</p>}
                                </div>

                                {/* Puesto (Corregido a Obligatorio) */}
                                <div>
                                    <label htmlFor="puesto" className="block text-sm font-medium text-text-secondary mb-1.5">
                                        Puesto <span className="text-accent">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Briefcase className="h-4 w-4 text-text-secondary group-focus-within:text-accent transition-colors" />
                                        </div>
                                        <input
                                            id="puesto"
                                            type="text"
                                            value={data.puesto}
                                            onChange={(e) => setData('puesto', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.puesto ? 'border-red-500' : 'border-white/10'} rounded-xl text-text-primary placeholder-text-secondary/60 focus:border-accent focus:ring-1 focus:ring-accent transition-all`}
                                            required
                                        />
                                    </div>
                                    {errors.puesto && <p className="text-red-400 text-xs mt-1.5">{errors.puesto}</p>}
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-white/5">
                                <Link
                                    href={route('admin.users.index')}
                                    className="px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-white transition-colors"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-accent-gold text-black font-semibold py-2.5 px-6 rounded-xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                                >
                                    {processing ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                                            <span>Actualizando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            <span>Actualizar Usuario</span>
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