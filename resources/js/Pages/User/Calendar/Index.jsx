import React, { useMemo } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    ChevronLeft, 
    ChevronRight, 
    Calendar as CalendarIcon, 
    CheckCircle2, 
    AlertCircle,
    ArrowLeft
} from 'lucide-react';

export default function Index({ auth, events = {}, currentMonth, currentYear }) {
    
    // --- Lógica de Construcción del Calendario ---
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();

    // Normalizador de eventos
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
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-accent shadow-glow">
                        <CalendarIcon className="h-6 w-6 text-abinbev-dark" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-text-primary tracking-tight">Calendario Laboral</h2>
                        <p className="text-sm text-text-secondary mt-0.5">Consulta de días trabajados y excepciones</p>
                    </div>
                </div>
            }
        >
            <Head title="Mi Calendario" />

            <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
                
                {/* Cabecera de Controles */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    
                    {/* Botón de Regreso y Advertencia Crítica */}
                    <div className="space-y-4">
                        <Link 
                            href={route('user.base_llegada')}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-primary-secondary border border-text-secondary/10 hover:border-accent rounded-xl text-sm font-bold text-text-primary transition-transform-shadow shadow-soft dark:shadow-dark-soft group"
                        >
                            <ArrowLeft size={16} className="text-text-secondary group-hover:text-accent group-hover:-translate-x-1 transition-all" />
                            Volver a pagos
                        </Link>
                        
                        {/* Advertencia en Grande y Rojo */}
                        <div className="animate-pulse">
                            <p className="text-functional-red text-lg md:text-xl font-black uppercase tracking-tight leading-tight">
                                * DE ESTOS DÍAS SE DESCONTARÁN VACACIONES Y BAJAS MÉDICAS
                            </p>
                        </div>
                    </div>

                    {/* Navegación de Mes */}
                    <div className="flex items-center gap-6 bg-primary-secondary p-3 rounded-2xl border border-text-secondary/10 shadow-float dark:shadow-dark-float self-center md:self-auto">
                        <button 
                            onClick={() => handleNavigate('prev')}
                            className="p-2.5 bg-primary hover:bg-accent/10 rounded-xl text-text-secondary hover:text-accent border border-text-secondary/10 hover:border-accent/30 transition-all btn-hover"
                        >
                            <ChevronLeft size={20} strokeWidth={2.5} />
                        </button>
                        
                        <div className="text-center min-w-[140px]">
                            <h3 className="text-lg font-black text-text-primary uppercase tracking-widest">
                                {monthNames[currentMonth - 1]} <span className="text-accent">{currentYear}</span>
                            </h3>
                        </div>

                        <button 
                            onClick={() => handleNavigate('next')}
                            className="p-2.5 bg-primary hover:bg-accent/10 rounded-xl text-text-secondary hover:text-accent border border-text-secondary/10 hover:border-accent/30 transition-all btn-hover"
                        >
                            <ChevronRight size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* Leyenda de Estados */}
                <div className="flex flex-wrap gap-4 mb-6 justify-center md:justify-end">
                    <LegendItem color="bg-accent/20 border-accent/40" text="Feriado / Especial" />
                    <LegendItem color="bg-functional-red/10 border-functional-red/30" text="Domingo Descanso" />
                    <LegendItem color="bg-primary border-text-secondary/20" text="Día Laboral" />
                </div>

                {/* Grilla del Calendario */}
                <div className="bg-primary-secondary rounded-3xl border border-text-secondary/10 p-4 sm:p-6 shadow-float dark:shadow-dark-float">
                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
                        
                        {/* Cabecera de días */}
                        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d, i) => (
                            <div key={d} className={`text-center text-[10px] sm:text-xs font-black py-3 uppercase tracking-widest bg-primary rounded-xl border border-text-secondary/10 ${i === 0 ? 'text-functional-red' : 'text-text-secondary'}`}>
                                {d}
                            </div>
                        ))}

                        {/* Espacios vacíos mes anterior */}
                        {[...Array(firstDayOfMonth)].map((_, i) => (
                            <div key={`empty-${i}`} className="h-24 sm:h-28 opacity-0" />
                        ))}

                        {/* Días del mes */}
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
                                    className={`h-24 sm:h-28 p-2 sm:p-3 border-2 rounded-2xl transition-all relative group flex flex-col
                                        ${isHoliday ? 'bg-accent/10 border-accent/30 shadow-glow' : 
                                          isSunday ? 'bg-functional-red/5 border-functional-red/20' : 
                                          isNonWorked ? 'bg-primary border-text-secondary/10 opacity-50' : 
                                          'bg-primary border-text-secondary/10 hover:border-accent/40 hover:shadow-soft'}`}
                                >
                                    <span className={`text-sm sm:text-base font-bold 
                                        ${isHoliday ? 'text-abinbev-gold' : 
                                          isSunday ? 'text-functional-red' : 
                                          isNonWorked ? 'text-text-secondary' : 
                                          'text-text-primary group-hover:text-accent transition-colors'}`}>
                                        {day}
                                    </span>

                                    {/* Información del día */}
                                    <div className="mt-auto">
                                        {event?.description ? (
                                            <p className={`text-[9px] sm:text-[10px] leading-tight font-black uppercase tracking-tighter line-clamp-2
                                                ${isHoliday ? 'text-abinbev-gold' : 
                                                  isSunday ? 'text-functional-red' : 
                                                  'text-text-secondary'}`}>
                                                {event.description}
                                            </p>
                                        ) : (
                                            !isSunday && !isNonWorked && (
                                                <div className="flex items-center gap-1.5 opacity-40 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <CheckCircle2 size={12} className="text-functional-green shrink-0" strokeWidth={3} />
                                                    <span className="text-[9px] text-functional-green font-black uppercase tracking-widest">Lab.</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Nota al pie */}
                <div className="mt-8 flex gap-4 p-5 bg-primary rounded-2xl border border-text-secondary/10 shadow-soft">
                    <AlertCircle className="text-accent shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-text-secondary leading-relaxed text-justify">
                        Este calendario refleja los registros oficiales cargados en el sistema. Los días con marco gris se consideran de <strong className="text-text-primary font-bold">actividad laboral normal</strong>. Si un domingo aparece con marco gris (sin marca roja), significa que fue registrado excepcionalmente como día trabajado.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function LegendItem({ color, text }) {
    return (
        <div className="flex items-center gap-2.5 px-3 py-2 bg-primary-secondary rounded-xl border border-text-secondary/10 shadow-sm">
            <div className={`w-3 h-3 rounded-full border-2 ${color}`} />
            <span className="text-[10px] font-black text-text-primary uppercase tracking-wider">{text}</span>
        </div>
    );
}