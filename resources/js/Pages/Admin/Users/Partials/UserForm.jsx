import React from 'react';
import { Link } from '@inertiajs/react';
import { User, Mail, Shield, MapPin, Briefcase, Save, ChevronDown } from 'lucide-react';

export default function UserForm({ 
    onSubmit, 
    data, 
    setData, 
    errors, 
    processing, 
    roles, 
    regions, 
    cancelUrl, 
    submitText,
    isEdit = false,
    userRole = null
}) {
    return (
        <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Legajo */}
                <div>
                    <label htmlFor="legajo" className="block text-sm font-medium text-text-secondary mb-1.5 uppercase tracking-widest text-[10px]">
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
                            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.legajo ? 'border-functional-red' : 'border-white/10'} rounded-xl text-text-primary placeholder-text-secondary/60 focus:border-accent focus:ring-1 focus:ring-accent transition-all font-mono text-sm`}
                            placeholder="Ej: L-00123"
                            required
                        />
                    </div>
                    {errors.legajo && <p className="text-functional-red text-xs mt-1.5 font-bold tracking-wide">{errors.legajo}</p>}
                </div>

                {/* Nombre */}
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-text-secondary mb-1.5 uppercase tracking-widest text-[10px]">
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
                            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.nombre ? 'border-functional-red' : 'border-white/10'} rounded-xl text-text-primary placeholder-text-secondary/60 focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm`}
                            placeholder="Nombre del empleado"
                            required
                        />
                    </div>
                    {errors.nombre && <p className="text-functional-red text-xs mt-1.5 font-bold tracking-wide">{errors.nombre}</p>}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5 uppercase tracking-widest text-[10px]">
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
                            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.email ? 'border-functional-red' : 'border-white/10'} rounded-xl text-text-primary placeholder-text-secondary/60 focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm`}
                            placeholder="correo@empresa.com"
                            required
                        />
                    </div>
                    {errors.email && <p className="text-functional-red text-xs mt-1.5 font-bold tracking-wide">{errors.email}</p>}
                </div>

                {/* Rol */}
                <div>
                    <label htmlFor="rol" className="block text-sm font-medium text-text-secondary mb-1.5 uppercase tracking-widest text-[10px]">
                        Rol del Sistema <span className="text-accent">*</span>
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <Shield className="h-4 w-4 text-text-secondary group-focus-within:text-accent transition-colors" />
                        </div>
                        <select
                            id="rol"
                            value={data.rol}
                            onChange={(e) => setData('rol', e.target.value)}
                            className={`w-full pl-10 pr-10 py-2.5 bg-white/5 border ${errors.rol ? 'border-functional-red' : 'border-white/10'} rounded-xl text-text-primary appearance-none focus:border-accent focus:ring-1 focus:ring-accent transition-all [&>option]:bg-primary [&>option]:text-white capitalize disabled:opacity-50 disabled:cursor-not-allowed text-sm relative`}
                            required
                            disabled={isEdit && userRole === 'admin'}
                        >
                            {roles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown className="h-4 w-4 text-text-secondary" />
                        </div>
                    </div>
                    {errors.rol && <p className="text-functional-red text-xs mt-1.5 font-bold tracking-wide">{errors.rol}</p>}
                </div>

                {/* Región */}
                <div>
                    <label htmlFor="region" className="block text-sm font-medium text-text-secondary mb-1.5 uppercase tracking-widest text-[10px]">
                        Región <span className="text-accent">*</span>
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <MapPin className="h-4 w-4 text-text-secondary group-focus-within:text-accent transition-colors" />
                        </div>
                        <select
                            id="region"
                            value={data.region}
                            onChange={(e) => setData('region', e.target.value)}
                            className={`w-full pl-10 pr-10 py-2.5 bg-white/5 border ${errors.region ? 'border-functional-red' : 'border-white/10'} rounded-xl text-text-primary appearance-none focus:border-accent focus:ring-1 focus:ring-accent transition-all [&>option]:bg-primary [&>option]:text-white text-sm relative`}
                            required
                        >
                            <option value="">Seleccionar región</option>
                            {regions.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown className="h-4 w-4 text-text-secondary" />
                        </div>
                    </div>
                    {errors.region && <p className="text-functional-red text-xs mt-1.5 font-bold tracking-wide">{errors.region}</p>}
                </div>

                {/* Puesto */}
                <div>
                    <label htmlFor="puesto" className="block text-sm font-medium text-text-secondary mb-1.5 uppercase tracking-widest text-[10px]">
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
                            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border ${errors.puesto ? 'border-functional-red' : 'border-white/10'} rounded-xl text-text-primary placeholder-text-secondary/60 focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm`}
                            placeholder="Cargo que desempeña"
                            required
                        />
                    </div>
                    {errors.puesto && <p className="text-functional-red text-xs mt-1.5 font-bold tracking-wide">{errors.puesto}</p>}
                </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-white/5">
                <Link
                    href={cancelUrl}
                    className="px-5 py-2.5 text-sm font-bold tracking-wide text-text-secondary hover:text-white transition-colors"
                >
                    CANCELAR
                </Link>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-accent-gold text-abinbev-dark font-black tracking-wide py-2.5 px-6 rounded-xl shadow-[0_0_15px_rgba(255,196,0,0.3)] hover:shadow-[0_0_25px_rgba(255,196,0,0.5)] hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm uppercase"
                >
                    {processing ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-abinbev-dark border-t-transparent"></div>
                            <span>PROCESANDO...</span>
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" strokeWidth={2.5} />
                            <span>{submitText}</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}