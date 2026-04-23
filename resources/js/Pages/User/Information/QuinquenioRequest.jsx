import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FileText, Download, ChevronDown} from 'lucide-react';

export default function QuinquenioRequest({ auth, user_data }) {
    const [data, setData] = useState({
        ci: '',
        fecha: new Date().toISOString().split('T')[0],
        quinquenio: 'Primer'
    });

    const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });
    const isFormValid = data.ci.trim() !== '';

    const handleDownload = () => {
        if (!isFormValid) return;
        const query = new URLSearchParams(data).toString();
        window.open(`${route('user.information.pdf')}?${query}`, '_blank');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="pt-2 pb-1">
                    <h2 className="font-bold text-3xl md:text-4xl text-text-primary tracking-tight">
                        Solicitud <span className="text-text-secondary/50 font-light">Quinquenio</span>
                    </h2>
                </div>
            }
        >
            <Head title="Solicitud de Quinquenio" />

            <div className="max-w-3xl mx-auto pt-0 pb-12 px-4">
                <div className="glow-card-wrapper" style={{ '--card-gradient': 'linear-gradient(135deg, #fef08a 0%, #facc15 50%, #a16207 100%)' }}>
                    <div className="glow-card-content p-6 md:p-10 bg-primary/95 backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <FileText className="text-accent" size={24} strokeWidth={2.5} />
                            <h3 className="text-xl font-black text-text-primary uppercase tracking-widest">Datos del Documento</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">Funcionario</label>
                                    <div className="px-5 py-4 text-sm font-bold text-text-primary bg-text-secondary/5 rounded-2xl border border-text-secondary/10">
                                        {user_data.nombre}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">Cargo Actual</label>
                                    <div className="px-5 py-4 text-sm font-bold text-text-primary bg-text-secondary/5 rounded-2xl border border-text-secondary/10">
                                        {user_data.puesto || 'No asignado'}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">Número de C.I. y Expedición</label>
                                <input 
                                    type="text" name="ci" value={data.ci} onChange={handleChange}
                                    placeholder="Ej: 1234567 LP"
                                    className="w-full bg-text-secondary/5 border border-text-secondary/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:border-accent focus:ring-0 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">Fecha de Emisión</label>
                                    <input type="date" name="fecha" value={data.fecha} onChange={handleChange} className="w-full bg-text-secondary/5 border border-text-secondary/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:border-accent" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-2 opacity-70">
                                        Periodo de Quinquenio
                                    </label>
                                    
                                    <div className="relative group">
                                        <select 
                                            name="quinquenio" 
                                            value={data.quinquenio} 
                                            onChange={handleChange} 
                                            className="w-full bg-text-secondary/5 border border-text-secondary/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all duration-300 appearance-none cursor-pointer hover:bg-text-secondary/[0.08]"
                                        >
                                            <option value="Primer" className="bg-primary text-text-primary">Primer Quinquenio</option>
                                            <option value="Segundo" className="bg-primary text-text-primary">Segundo Quinquenio</option>
                                            <option value="Tercer" className="bg-primary text-text-primary">Tercer Quinquenio</option>
                                            <option value="Cuarto" className="bg-primary text-text-primary">Cuarto Quinquenio</option>
                                            <option value="Quinto" className="bg-primary text-text-primary">Quinto Quinquenio</option>
                                            <option value="Sexto" className="bg-primary text-text-primary">Sexto Quinquenio</option>
                                            <option value="Septimo" className="bg-primary text-text-primary">Septimo Quinquenio</option>
                                        </select>

                                        {/* Flecha personalizada para romper la cuadratura nativa */}
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-text-secondary group-focus-within:text-accent transition-colors">
                                            <ChevronDown size={18} strokeWidth={2.5} />
                                        </div>
                                        
                                        {/* Efecto de brillo sutil en el borde superior para dar volumen */}
                                        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleDownload} disabled={!isFormValid} className="w-full mt-6 flex items-center justify-center gap-3 bg-accent text-primary font-black py-5 px-8 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 transition-all uppercase tracking-widest text-xs">
                                <Download size={20} strokeWidth={3} /> Generar Solicitud PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}