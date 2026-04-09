import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FileText, Calculator, Download, Info } from 'lucide-react';

export default function Index({ auth }) {
    // Estado del formulario manual (Funcionamiento intacto)
    const [data, setData] = useState({
        nombre: '',
        ci: '',
        cargo: '',
        fecha: new Date().toISOString().split('T')[0],
        quinquenio: 'Primer'
    });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const isFormValid = data.nombre.trim() !== '' && data.ci.trim() !== '' && data.cargo.trim() !== '';

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
                        Información <span className="text-text-secondary/50 font-light">Laboral</span>
                    </h2>
                </div>
            }
        >
            <Head title="Información" />

            {/* Reducción de espacio superior según correcciones previas */}
            <div className="max-w-6xl mx-auto pt-0 pb-12 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* COLUMNA IZQUIERDA: Bono de Antigüedad */}
                    <div className="glow-card-wrapper" style={{ '--card-gradient': 'linear-gradient(135deg, #fef08a 0%, #facc15 50%, #a16207 100%)' }}>
                        <div className="glow-card-content p-6 md:p-10 bg-primary/95 backdrop-blur-sm">
                            
                            <div className="flex items-center gap-4 mb-8">
                                <Calculator className="text-accent" size={24} strokeWidth={2.5} />
                                <h3 className="text-xl font-black text-text-primary uppercase tracking-widest">Bono de Antigüedad</h3>
                            </div>

                            <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                                Calculado sobre la base de <strong className="text-text-primary font-bold">3 Salarios Mínimos Nacionales (SMN)</strong> según escala vigente.
                            </p>

                            <div className="space-y-1 mb-10 overflow-hidden rounded-2xl border border-text-secondary/10">
                                <TableRow label="De 2 a 4 años" percent="5%" />
                                <TableRow label="De 5 a 7 años" percent="11%" />
                                <TableRow label="De 8 a 10 años" percent="18%" />
                                <TableRow label="De 11 a 14 años" percent="26%" />
                                <TableRow label="De 15 a 19 años" percent="34%" />
                                <TableRow label="De 20 a 24 años" percent="42%" />
                                <TableRow label="Más de 25 años" percent="50%" />
                            </div>

                            {/* Simulador de Cálculo Estilo Matriz Técnica */}
                            <div className="mt-auto pt-6">
                                <div className="bg-text-secondary/5 rounded-[22px] border border-text-secondary/10 p-6 relative overflow-hidden">
                                    
                                    {/* Grilla 2x3 */}
                                    <div className="grid grid-cols-2 gap-y-4 relative">
                                        
                                        {/* FILA 1: Base */}
                                        <div className="flex flex-col justify-center">
                                            <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Base Imponible</span>
                                            <span className="text-xs font-bold text-text-primary">3 SMN (Bs. 3,300 × 3)</span>
                                        </div>
                                        <div className="flex items-center justify-end">
                                            <span className="text-lg font-mono font-bold text-text-primary">Bs. 9,900.00</span>
                                        </div>

                                        {/* OPERADOR VISUAL: Multiplicación */}
                                        <div className="col-span-2 flex justify-center -my-2 z-10">
                                            <div className="bg-accent text-primary w-7 h-7 rounded-full flex items-center justify-center shadow-glow border-2 border-primary">
                                                <span className="text-sm font-black">×</span>
                                            </div>
                                        </div>

                                        {/* FILA 2: Factor */}
                                        {/* FILA 2: Factor - Corregido para legibilidad en tema claro */}
                                        <div className="flex flex-col justify-center">
                                            <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">
                                                Rango de Antigüedad
                                            </span>
                                            <span className="text-xs font-bold text-text-primary">
                                                Categoría (2 a 4 años)
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-end">
                                            {/* text-text-primary asegura que sea NEGRO en Light Mode y BLANCO en Dark Mode */}
                                            {/* dark:text-accent devuelve el amarillo solo en el tema oscuro para el "glow" */}
                                            <span className="text-lg font-mono font-black text-text-primary dark:text-accent transition-colors">
                                                5%
                                            </span>
                                        </div>

                                        {/* SEPARADOR FINAL (Línea de resultado) */}
                                        <div className="col-span-2 border-t-2 border-text-secondary/20 my-2 shadow-[0_1px_0_rgba(255,255,255,0.1)]"></div>

                                        {/* FILA 3: Resultado */}
                                        <div className="flex flex-col justify-center">
                                            <span className="text-[11px] font-black text-text-primary uppercase tracking-[0.15em]">Monto del Bono</span>
                                            <span className="text-[9px] text-text-secondary italic leading-none">Cálculo mensual estimado</span>
                                        </div>
                                        <div className="flex items-baseline justify-end gap-1">
                                            <span className="text-sm font-bold text-text-primary">Bs.</span>
                                            <span className="text-3xl font-black text-text-primary tracking-tighter">495.00</span>
                                        </div>

                                    </div>

                                    {/* Decoración de fondo Apple-style */}
                                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: Generador de Solicitud */}
                    <div className="glow-card-wrapper" style={{ '--card-gradient': 'linear-gradient(135deg, #fef08a 0%, #facc15 50%, #a16207 100%)' }}>
                        <div className="glow-card-content p-6 md:p-10 bg-primary/95 backdrop-blur-sm">
                            
                            <div className="flex items-center gap-4 mb-8">
                                <FileText className="text-accent" size={24} strokeWidth={2.5} />
                                <h3 className="text-xl font-black text-text-primary uppercase tracking-widest">Solicitud de Quinquenio</h3>
                            </div>

                            <p className="text-sm text-text-secondary mb-10 leading-relaxed">
                                Complete los campos para generar su solicitud formal. El documento se descargará listo para impresión.
                            </p>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">Nombre Completo</label>
                                    <input 
                                        type="text" name="nombre" value={data.nombre} onChange={handleChange}
                                        placeholder="Ingrese nombre según C.I."
                                        className="w-full bg-text-secondary/5 border border-text-secondary/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:border-accent focus:ring-0 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">C.I. y Expedición</label>
                                        <input 
                                            type="text" name="ci" value={data.ci} onChange={handleChange}
                                            placeholder="1234567 LP"
                                            className="w-full bg-text-secondary/5 border border-text-secondary/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:border-accent focus:ring-0 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">Cargo Actual</label>
                                        <input 
                                            type="text" name="cargo" value={data.cargo} onChange={handleChange}
                                            placeholder="Cargo que desempeña"
                                            className="w-full bg-text-secondary/5 border border-text-secondary/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:border-accent focus:ring-0 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">Fecha de Solicitud</label>
                                        <input 
                                            type="date" name="fecha" value={data.fecha} onChange={handleChange}
                                            className="w-full bg-text-secondary/5 border border-text-secondary/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:border-accent focus:ring-0 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">Quinquenio</label>
                                        <select 
                                            name="quinquenio" value={data.quinquenio} onChange={handleChange}
                                            className="w-full bg-text-secondary/5 border border-text-secondary/10 rounded-2xl px-5 py-4 text-sm text-text-primary focus:border-accent focus:ring-0 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="Primer">Primer Quinquenio</option>
                                            <option value="Segundo">Segundo Quinquenio</option>
                                            <option value="Tercer">Tercer Quinquenio</option>
                                            <option value="Cuarto">Cuarto Quinquenio</option>
                                            <option value="Quinto">Quinto Quinquenio</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <button
                                        onClick={handleDownload}
                                        disabled={!isFormValid}
                                        className="w-full flex items-center justify-center gap-3 bg-accent text-primary font-black py-5 px-8 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale transition-all uppercase tracking-widest text-xs"
                                    >
                                        <Download size={20} strokeWidth={3} />
                                        Generar Documento PDF
                                    </button>
                                </div>
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
        <div className="flex justify-between items-center py-4 px-6 bg-bg-primary/50 hover:bg-accent/5 transition-colors border-b border-text-secondary/5 last:border-0 group">
            <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary transition-colors">{label}</span>
            <span className="text-base font-black text-text-primary font-mono">{percent}</span>
        </div>
    );
}