// resources/js/Pages/Admin/Calendar/Index.jsx
import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Save } from 'lucide-react';

export default function CalendarIndex({ auth, events, currentMonth, currentYear }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [editData, setEditData] = useState({ type: 'worked', description: '' });

    // --- Lógica de Generación de Calendario ---
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const handleNavigate = (direction) => {
        let newMonth = direction === 'next' ? currentMonth + 1 : currentMonth - 1;
        let newYear = currentYear;
    
        if (newMonth > 12) { newMonth = 1; newYear++; }
        if (newMonth < 1) { newMonth = 12; newYear--; }
    
        // Nombre de ruta corregido: admin.work-calendar.index
        router.get(route('admin.work-calendar.index'), { month: newMonth, year: newYear });
    };

    const handleDayClick = (dateStr, existingEvent) => {
        setSelectedDate(dateStr);
        setEditData({
            type: existingEvent ? existingEvent.type : 'worked',
            description: existingEvent ? existingEvent.description : ''
        });
    };

    const submitChange = () => {
        // Nombre de ruta corregido: admin.work-calendar.update
        router.post(route('admin.work-calendar.update'), {
            date: selectedDate,
            ...editData
        }, { 
            onSuccess: () => setSelectedDate(null),
            preserveScroll: true 
        });
    };

    return (
        <AuthenticatedLayout 
            header={<h2 className="font-bold text-2xl text-text-primary flex items-center gap-2"><CalendarIcon className="text-accent"/> Calendario Laboral</h2>}
        >
            <Head title="Calendario Laboral" />

            <div className="max-w-5xl mx-auto py-6">
                {/* Selector de Mes */}
                <div className="flex items-center justify-between mb-8 bg-secondary p-4 rounded-2xl border border-white/10 shadow-lg">
                    <button onClick={() => handleNavigate('prev')} className="p-2 hover:bg-primary rounded-full transition-colors"><ChevronLeft/></button>
                    <h3 className="text-xl font-display font-bold text-accent uppercase tracking-widest">{monthNames[currentMonth - 1]} {currentYear}</h3>
                    <button onClick={() => handleNavigate('next')} className="p-2 hover:bg-primary rounded-full transition-colors"><ChevronRight/></button>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                        <div key={d} className="text-center text-text-secondary text-xs font-bold py-2 uppercase">{d}</div>
                    ))}

                    {[...Array(firstDayIndex)].map((_, i) => <div key={`empty-${i}`} className="h-24 opacity-0" />)}

                    {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const event = events[dateStr];
                        
                        return (
                            <div 
                                key={day}
                                onClick={() => handleDayClick(dateStr, event)}
                                className={`h-28 p-2 border rounded-xl cursor-pointer transition-all hover:scale-[1.02] relative overflow-hidden
                                    ${event?.type === 'holiday' ? 'bg-accent/20 border-accent/50 text-accent' : 
                                      event?.type === 'sunday' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                                      event?.type === 'non_worked' ? 'bg-gray-500/20 border-white/10 text-text-secondary' :
                                      'bg-primary/40 border-white/5 hover:border-white/20'}`}
                            >
                                <span className="font-bold text-lg">{day}</span>
                                {event?.description && <p className="text-[10px] mt-1 leading-tight line-clamp-2">{event.description}</p>}
                                {!event && <span className="absolute bottom-2 right-2 text-[10px] opacity-20 italic">Laboral</span>}
                            </div>
                        );
                    })}
                </div>

                {/* Modal de Edición Rápida */}
                {selectedDate && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-secondary border border-white/10 p-6 rounded-3xl w-full max-w-md shadow-2xl animate-scale-in">
                            <h4 className="text-xl font-bold mb-4 text-text-primary">Configurar: {selectedDate}</h4>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Tipo de Día</label>
                                    <select 
                                        value={editData.type}
                                        onChange={e => setEditData({...editData, type: e.target.value})}
                                        className="w-full bg-primary border-white/10 rounded-xl text-text-primary"
                                    >
                                        <option value="worked">Día Laboral (Normal)</option>
                                        <option value="holiday">Feriado Nacional</option>
                                        <option value="sunday">Domingo</option>
                                        <option value="non_worked">Día No Laborable (Asueto)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Descripción / Motivo</label>
                                    <input 
                                        type="text"
                                        value={editData.description}
                                        onChange={e => setEditData({...editData, description: e.target.value})}
                                        placeholder="Ej: Año Nuevo"
                                        className="w-full bg-primary border-white/10 rounded-xl text-text-primary"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button onClick={submitChange} className="flex-1 bg-accent text-black font-bold py-3 rounded-xl hover:bg-accent-gold transition-all flex items-center justify-center gap-2">
                                        <Save size={18}/> Guardar
                                    </button>
                                    <button onClick={() => setSelectedDate(null)} className="flex-1 bg-white/5 text-text-secondary font-bold py-3 rounded-xl hover:bg-white/10 transition-all">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}