import React, { useMemo } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Index({ auth, events = {}, currentMonth, currentYear }) {
    
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();

    const eventsMap = useMemo(() => {
        const map = {};
        const eventList = Array.isArray(events) ? events : Object.values(events);
        eventList.forEach(ev => {
            if (!ev || !ev.date) return;
            const cleanDate = ev.date.split('T')[0].split(' ')[0]; 
            map[cleanDate] = ev;
        });
        return map;
    }, [events]);

    const handleNavigate = (direction) => {
        let newMonth = direction === 'next' ? currentMonth + 1 : currentMonth - 1;
        let newYear = currentYear;
        if (newMonth > 12) { newMonth = 1; newYear++; }
        if (newMonth < 1) { newMonth = 12; newYear--; }

        router.get(route('user.calendar'), { month: newMonth, year: newYear }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="pt-2 pb-1">
                    <h2 className="font-bold text-3xl md:text-4xl text-text-primary tracking-tight">
                        Calendario <span className="text-text-secondary/50 font-light">Laboral</span>
                    </h2>
                </div>
            }
        >
            <Head title="Mi Calendario" />

            <div className="max-w-6xl mx-auto pt-0 pb-12 px-4">
                
                {/* BARRA DE ACCIONES Y NAVEGACIÓN */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 mb-10">
                    
                    <div className="flex flex-col gap-4">
                        <Link 
                            href={route('user.base_llegada')}
                            className="inline-flex w-fit items-center px-4 py-2 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
                        >
                            ← Volver a mis pagos
                        </Link>
                        
                        {/* Notificación de Advertencia Estilo iOS */}
                        <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-2xl">
                            <p className="text-red-500 text-xs md:text-sm font-black uppercase tracking-widest leading-none">
                                * Descuento de vacaciones y bajas aplicable
                            </p>
                        </div>
                    </div>

                    {/* Controles de Mes */}
                    <div className="flex items-center justify-between bg-text-secondary/5 p-2 rounded-3xl border border-text-secondary/10 min-w-[300px]">
                        <button 
                            onClick={() => handleNavigate('prev')}
                            className="p-3 hover:bg-bg-primary rounded-2xl text-text-secondary hover:text-text-primary transition-all active:scale-90"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        
                        <div className="text-center">
                            <span className="text-sm font-black uppercase tracking-[0.2em] text-text-secondary block mb-0.5">
                                {currentYear}
                            </span>
                            <h3 className="text-xl font-bold text-text-primary capitalize">
                                {monthNames[currentMonth - 1]}
                            </h3>
                        </div>

                        <button 
                            onClick={() => handleNavigate('next')}
                            className="p-3 hover:bg-bg-primary rounded-2xl text-text-secondary hover:text-text-primary transition-all active:scale-90"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* CONTENEDOR PRINCIPAL: GLASS PANEL */}
                <div className="glow-card-wrapper" style={{ '--card-gradient': 'linear-gradient(135deg, #fef08a 0%, #facc15 50%, #a16207 100%)' }}>
                    <div className="glow-card-content p-4 sm:p-8 bg-primary/95 backdrop-blur-sm">
                        
                        {/* Leyenda minimalista */}
                        <div className="flex gap-6 mb-8 px-2 overflow-x-auto pb-2 sm:pb-0">
                            <LegendItem color="bg-[#facc15]" text="Feriado" />
                            <LegendItem color="bg-red-500" text="Domingo" />
                            <LegendItem color="bg-text-secondary/20" text="Laboral" />
                        </div>

                        <div className="grid grid-cols-7 gap-px bg-text-secondary/10 border border-text-secondary/10 rounded-3xl overflow-hidden shadow-2xl">
                            
                            {/* Días de la semana */}
                            {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((d, i) => (
                                <div key={d} className="bg-bg-secondary py-4 text-center">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'text-red-500' : 'text-text-secondary'}`}>
                                        {d}
                                    </span>
                                </div>
                            ))}

                            {/* Celdas del Calendario */}
                            {[...Array(firstDayOfMonth)].map((_, i) => (
                                <div key={`empty-${i}`} className="bg-bg-primary/30 h-24 sm:h-32" />
                            ))}

                            {[...Array(daysInMonth)].map((_, i) => {
                                const day = i + 1;
                                const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const event = eventsMap[dateStr];

                                const isHoliday = event?.type === 'holiday';
                                const isSunday = event?.type === 'sunday';
                                const isNonWorked = event?.type === 'non_worked';

                                return (
                                    <div 
                                        key={day}
                                        className={`h-24 sm:h-32 p-3 sm:p-4 relative transition-colors bg-bg-primary
                                            ${isHoliday ? 'bg-accent/5' : ''} 
                                            ${isSunday ? 'bg-red-500/5' : ''}
                                            ${isNonWorked ? 'opacity-40 grayscale' : ''}
                                        `}
                                    >
                                        <span className={`text-base sm:text-xl font-black 
                                            ${isHoliday ? 'text-[#ca8a04]' : 
                                              isSunday ? 'text-red-500' : 
                                              'text-text-primary'}`}>
                                            {day}
                                        </span>

                                        {event?.description && (
                                            <div className="mt-2">
                                                <p className={`text-[9px] sm:text-[10px] font-bold uppercase leading-tight tracking-tighter line-clamp-2
                                                    ${isHoliday ? 'text-[#ca8a04]' : 
                                                      isSunday ? 'text-red-500' : 
                                                      'text-text-secondary'}`}>
                                                    {event.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Indicador sutil de día laboral común */}
                                        {!event && !isSunday && (
                                            <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-text-secondary/20" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function LegendItem({ color, text }) {
    return (
        <div className="flex items-center gap-2 shrink-0">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.1em]">{text}</span>
        </div>
    );
}