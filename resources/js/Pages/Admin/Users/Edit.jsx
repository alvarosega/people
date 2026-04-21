import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserForm from './Partials/UserForm';
import { User, ArrowLeft } from 'lucide-react';

export default function Edit({ user, roles, regions }) {
    const { data, setData, errors, put, processing } = useForm({
        region: user.region || '',
        legajo: user.legajo || '',
        nombre: user.nombre || '',
        email: user.email || '',
        rol: user.rol || 'user',
        puesto: user.puesto || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-accent shadow-glow shrink-0">
                        <User className="h-6 w-6 text-abinbev-dark" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="font-bold text-xl md:text-2xl text-text-primary tracking-tight uppercase">Editar Usuario</h2>
                        <p className="text-text-secondary text-xs md:text-sm mt-0.5 tracking-wide">
                            Modificación de credenciales y accesos
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Editar | ${user.nombre}`} />

            <div className="py-4 md:py-8">
                <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="mb-6 flex items-center justify-between">
                        <Link
                            href={route('admin.users.index')}
                            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors text-sm font-bold tracking-wide uppercase"
                        >
                            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                            Volver al directorio
                        </Link>
                    </div>

                    <div className="bg-primary-secondary backdrop-blur-xl border-[0.5px] border-text-secondary/20 rounded-2xl shadow-float overflow-hidden">
                        <div className="p-6 sm:p-8 border-b-[0.5px] border-text-secondary/10">
                            <h3 className="text-lg font-black text-text-primary uppercase tracking-widest truncate">ACTUALIZANDO: {user.nombre}</h3>
                            <p className="text-xs text-text-secondary mt-1 font-medium tracking-wide">MODIFICA LOS PARÁMETROS DEL SISTEMA</p>
                        </div>

                        <UserForm 
                            onSubmit={handleSubmit}
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            roles={roles}
                            regions={regions}
                            cancelUrl={route('admin.users.index')}
                            submitText="ACTUALIZAR USUARIO"
                            isEdit={true}
                            userRole={user.rol}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}