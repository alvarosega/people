import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Calculator } from 'lucide-react';

export default function SeniorityBonus({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="pt-2 pb-1">
                    <h2 className="font-bold text-3xl md:text-4xl text-text-primary tracking-tight">
                        Bono de <span className="text-text-secondary/50 font-light">Antigüedad</span>
                    </h2>
                </div>
            }
        >
            <Head title="Bono de Antigüedad" />

            <div className="max-w-3xl mx-auto pt-0 pb-12 px-4">
                <div className="glow-card-wrapper" style={{ '--card-gradient': 'linear-gradient(135deg, #fef08a 0%, #facc15 50%, #a16207 100%)' }}>
                    <div className="glow-card-content p-6 md:p-10 bg-primary/95 backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <Calculator className="text-accent" size={24} strokeWidth={2.5} />
                            <h3 className="text-xl font-black text-text-primary uppercase tracking-widest">Escala Salarial</h3>
                        </div>

                        <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                            Calculado sobre la base de <strong className="text-text-primary font-bold">3 Salarios Mínimos Nacionales (SMN)</strong> según la normativa vigente.
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

                        <div className="bg-text-secondary/5 rounded-[22px] border border-text-secondary/10 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0">
                            <div className="bg-accent/10 border-b border-l border-accent/20 px-3 py-1 rounded-bl-xl">
                                <span className="text-[9px] font-black text-accent uppercase tracking-[0.2em]">
                                    Ejemplo
                                </span>
                            </div>
                        </div>
                            <div className="grid grid-cols-2 gap-y-4 relative">
                                <div className="flex flex-col justify-center">
                                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Base Imponible</span>
                                    <span className="text-xs font-bold text-text-primary">3 SMN (Bs. 3,300 × 3)</span>
                                </div>
                                <div className="flex items-center justify-end font-mono font-bold text-text-primary">Bs. 9,900.00</div>

                                <div className="col-span-2 flex justify-center -my-2 z-10">
                                    <div className="bg-accent text-primary w-7 h-7 rounded-full flex items-center justify-center shadow-glow border-2 border-primary">
                                        <span className="text-sm font-black">×</span>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center">
                                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Porcentaje</span>
                                    <span className="text-xs font-bold text-text-primary">Cat. 2 a 4 años</span>
                                </div>
                                <div className="flex items-center justify-end font-mono font-black text-text-primary dark:text-accent">5%</div>

                                <div className="col-span-2 border-t-2 border-text-secondary/20 my-2"></div>

                                <div className="flex flex-col justify-center">
                                    <span className="text-[11px] font-black text-text-primary uppercase tracking-[0.15em]">Monto Mensual</span>
                                </div>
                                <div className="flex items-baseline justify-end gap-1 text-text-primary">
                                    <span className="text-sm font-bold">Bs.</span>
                                    <span className="text-3xl font-black tracking-tighter">495.00</span>
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
            <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary">{label}</span>
            <span className="text-base font-black text-text-primary font-mono">{percent}</span>
        </div>
    );
}