import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FileText, Calculator, Download, Info } from 'lucide-react';

export default function Index({ auth }) {
    // Estado del formulario manual
    const [data, setData] = useState({
        nombre: '',
        ci: '',
        cargo: '',
        fecha: new Date().toISOString().split('T')[0], // Fecha actual por defecto
        quinquenio: 'Primer'
    });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const isFormValid = data.nombre.trim() !== '' && data.ci.trim() !== '' && data.cargo.trim() !== '';

    // Manejador para abrir la ruta de descarga del PDF con los parámetros
    const handleDownload = () => {
        if (!isFormValid) return;
        const query = new URLSearchParams(data).toString();
        window.open(`${route('user.information.pdf')}?${query}`, '_blank');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-accent shadow-glow">
                        <Info className="h-6 w-6 text-abinbev-dark" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-text-primary tracking-tight">Información Laboral</h2>
                        <p className="text-text-secondary text-sm mt-0.5">Bonos de antigüedad y generación de documentos</p>
                    </div>
                </div>
            }
        >
            <Head title="Información" />

            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* COLUMNA IZQUIERDA: Bono de Antigüedad */}
                    <div className="bg-primary-secondary rounded-3xl p-6 md:p-8 border border-text-secondary/10 shadow-float dark:shadow-dark-float overflow-hidden relative">
                        {/* Decoración de fondo */}
                        <div className="absolute -left-10 -top-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl opacity-60 pointer-events-none" />

                        <div className="flex items-center gap-3 mb-6 relative">
                            <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                                <Calculator className="text-accent" size={20} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary uppercase tracking-widest">Bono de Antigüedad</h3>
                        </div>

                        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                            Calculado en base a <strong className="text-text-primary font-bold">3 Salarios Mínimos Nacionales (SMN)</strong>.
                        </p>

                        <div className="space-y-2.5 mb-8">
                            <TableRow label="De 2 a 4 años" percent="5%" />
                            <TableRow label="De 5 a 7 años" percent="11%" />
                            <TableRow label="De 8 a 10 años" percent="18%" />
                            <TableRow label="De 11 a 14 años" percent="26%" />
                            <TableRow label="De 15 a 19 años" percent="34%" />
                            <TableRow label="De 20 a 24 años" percent="42%" />
                            <TableRow label="Más de 25 años" percent="50%" />
                        </div>

                        <div className="bg-primary p-5 rounded-2xl border border-text-secondary/10 shadow-sm relative overflow-hidden">
                            {/* Brillo sutil en la caja de ejemplo */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                            
                            <p className="text-[11px] font-black uppercase text-text-secondary mb-3 tracking-widest">Ejemplo de Cálculo</p>
                            <div className="flex flex-col gap-2 text-sm font-mono">
                                <div className="flex justify-between border-b border-text-secondary/10 pb-2">
                                    <span className="text-text-secondary">SMN Base (3300 * 3)</span>
                                    <span className="text-text-primary font-medium">Bs. 9,900</span>
                                </div>
                                <div className="flex justify-between pt-1 items-end">
                                    <span className="text-text-secondary">Bono (2 a 4 años - 5%)</span>
                                    <span className="font-bold text-lg text-abinbev-gold tracking-tight">Bs. 495</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: Generador de Solicitud */}
                    <div className="bg-primary-secondary rounded-3xl p-6 md:p-8 border border-text-secondary/10 shadow-float dark:shadow-dark-float relative">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                                <FileText className="text-accent" size={20} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary uppercase tracking-widest">Solicitud de Quinquenio</h3>
                        </div>

                        <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                            Ingrese los datos requeridos para generar automáticamente el documento en formato PDF, listo para impresión y firma.
                        </p>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">
                                    Nombre Completo
                                </label>
                                <input 
                                    type="text" name="nombre" value={data.nombre} onChange={handleChange}
                                    placeholder="Ej: Juan Pérez Gómez"
                                    className="w-full bg-primary border border-text-secondary/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/40 focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-inner"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">
                                        C.I. y Expedición
                                    </label>
                                    <input 
                                        type="text" name="ci" value={data.ci} onChange={handleChange}
                                        placeholder="Ej: 1234567 LP"
                                        className="w-full bg-primary border border-text-secondary/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/40 focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-inner"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">
                                        Cargo
                                    </label>
                                    <input 
                                        type="text" name="cargo" value={data.cargo} onChange={handleChange}
                                        placeholder="Ej: Técnico Instalador"
                                        className="w-full bg-primary border border-text-secondary/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/40 focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-inner"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">
                                        Fecha de Solicitud
                                    </label>
                                    <input 
                                        type="date" name="fecha" value={data.fecha} onChange={handleChange}
                                        className="w-full bg-primary border border-text-secondary/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-inner"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">
                                        Quinquenio a Solicitar
                                    </label>
                                    <div className="relative">
                                        <select 
                                            name="quinquenio" value={data.quinquenio} onChange={handleChange}
                                            className="w-full bg-primary border border-text-secondary/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-inner appearance-none cursor-pointer"
                                        >
                                            <option value="Primer">Primer Quinquenio</option>
                                            <option value="Segundo">Segundo Quinquenio</option>
                                            <option value="Tercer">Tercer Quinquenio</option>
                                            <option value="Cuarto">Cuarto Quinquenio</option>
                                            <option value="Quinto">Quinto Quinquenio</option>
                                        </select>
                                        {/* Icono personalizado para el select */}
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-text-secondary">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 mt-2 border-t border-text-secondary/10">
                                <button
                                    onClick={handleDownload}
                                    disabled={!isFormValid}
                                    className="w-full flex items-center justify-center gap-2 bg-accent text-abinbev-dark font-black py-4 px-6 rounded-xl shadow-glow hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all uppercase tracking-wide text-sm"
                                >
                                    <Download size={18} strokeWidth={2.5} />
                                    Generar y Descargar PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function TableRow({ label, percent }) {
    return (
        <div className="flex justify-between items-center py-3 px-5 bg-primary rounded-xl border border-text-secondary/10 transition-colors hover:border-accent/30 group">
            <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">{label}</span>
            <span className="text-sm font-black text-text-primary font-mono">{percent}</span>
        </div>
    );
}