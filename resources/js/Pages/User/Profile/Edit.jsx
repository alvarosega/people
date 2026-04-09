import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit({ auth, userData }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="pt-2 pb-1">
                    <h2 className="font-bold text-3xl md:text-4xl text-text-primary tracking-tight">
                        Mi <span className="text-text-secondary/50 font-light">Perfil</span>
                    </h2>
                </div>
            }
        >
            <Head title="Perfil" />

            <div className="max-w-2xl mx-auto pt-4 pb-12 px-4">
                {/* CARD DE IDENTIDAD DIGITAL */}
                <div 
                    className="glow-card-wrapper" 
                    style={{ '--card-gradient': 'linear-gradient(135deg, #fef08a 0%, #facc15 50%, #a16207 100%)' }}
                >
                    <div className="glow-card-content p-8 md:p-12 bg-primary/95 backdrop-blur-sm">
                        
                        {/* Cabecera del Perfil */}
                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-accent to-accent/60 flex items-center justify-center mb-6 shadow-xl">
                                <span className="text-4xl font-black text-primary">
                                    {userData.nombre?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <h3 className="text-2xl font-black text-text-primary tracking-tight">
                                {userData.nombre}
                            </h3>
                            <p className="text-sm font-bold text-text-secondary uppercase tracking-[0.2em] mt-1">
                                {userData.puesto}
                            </p>
                        </div>

                        {/* Cuerpo: Datos del Legajo */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ProfileItem label="Nro. de Legajo" value={userData.legajo} />
                                <ProfileItem label="Región" value={userData.region} />
                            </div>
                            
                            <div className="border-t border-text-secondary/10 pt-6">
                                <ProfileItem label="Correo Electrónico" value={userData.email} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const ProfileItem = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-text-secondary mb-1.5">
            {label}
        </span>
        <span className="text-lg font-bold text-text-primary">
            {value || "No asignado"}
        </span>
    </div>
);