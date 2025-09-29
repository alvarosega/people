import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Calendar from '@/Components/Calendar';
import { useState } from 'react';
import axios from 'axios';
import {
    Calendar as CalendarIcon,
    Plus,
    Palette,
    Clock,
    FileText,
    Tag,
    CheckCircle,
    AlertCircle,
    Download,
    Upload
} from 'lucide-react';

export default function AdminCalendar() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        start: '',
        end: '',
        color: '#f5e003', // Amarillo AB InBev por defecto
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        if (form.end && form.start && new Date(form.end) < new Date(form.start)) {
            setError('La fecha de fin no puede ser anterior a la de inicio');
            setIsSubmitting(false);
            return;
        }

        try {
            await axios.post('/admin/events', form);
            setSuccess('Evento creado exitosamente');
            setForm({ 
                title: '', 
                description: '', 
                start: '', 
                end: '', 
                color: '#f5e003' 
            });
            
            // Refrescar el calendario después de 2 segundos
            setTimeout(() => {
                setSuccess('');
                // Aquí podrías agregar una función para refrescar el calendario
                // Por ejemplo: refreshCalendar();
            }, 2000);
            
        } catch (err) {
            console.error(err);
            setError('Error al crear el evento. Por favor, intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const presetColors = [
        '#f5e003', // Amarillo AB InBev
        '#e5b611', // Dorado AB InBev
        '#3788d8', // Azul
        '#10b981', // Verde
        '#f59e0b', // Naranja
        '#ef4444', // Rojo
        '#8b5cf6', // Violeta
        '#06b6d4', // Cian
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-accent to-accent-gold">
                        <CalendarIcon className="h-6 w-6 text-black" />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-text-primary">Calendario Administrativo</h2>
                        <p className="text-text-secondary text-sm">Gestiona eventos y actividades corporativas</p>
                    </div>
                </div>
            }
        >
            <div className="py-8 bg-gradient-to-br from-primary via-gray-900 to-black min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">


                    {/* Formulario de Evento */}
                    <div className="bg-primary/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-accent/20 to-accent-gold/20 border-b border-white/10 p-6">
                            <h3 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                                <Plus className="h-5 w-5 text-accent" />
                                Crear Nuevo Evento
                            </h3>
                            <p className="text-text-secondary text-sm mt-1">
                                Agrega nuevos eventos al calendario corporativo
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Mensajes de estado */}
                            {error && (
                                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                    <span className="text-red-400 text-sm">{error}</span>
                                </div>
                            )}

                            {success && (
                                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                    <span className="text-green-400 text-sm">{success}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

                                {/* Título */}
                                <div className="lg:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-3">
                                        <Tag className="h-4 w-4 text-accent" />
                                        Título del Evento
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ej: Reunión de equipo, Evento corporativo..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-text-primary 
                                            placeholder-text-secondary/60 focus:border-accent focus:ring-2 focus:ring-accent/20 
                                            transition-all duration-200"
                                    />
                                </div>

                                {/* Fechas */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-3">
                                        <Clock className="h-4 w-4 text-accent" />
                                        Fecha y Hora de Inicio
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="start"
                                        value={form.start}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-text-primary 
                                            focus:border-accent focus:ring-2 focus:ring-accent/20 
                                            transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-3">
                                        <Clock className="h-4 w-4 text-accent" />
                                        Fecha y Hora de Fin (Opcional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="end"
                                        value={form.end}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-text-primary 
                                            focus:border-accent focus:ring-2 focus:ring-accent/20 
                                            transition-all duration-200"
                                    />
                                </div>

                                {/* Selector de Color */}
                                <div className="lg:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-3">
                                        <Palette className="h-4 w-4 text-accent" />
                                        Color del Evento
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-2 flex-wrap">
                                            {presetColors.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, color })}
                                                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110
                                                        ${form.color === color ? 'border-white scale-110' : 'border-white/30'}`}
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                name="color"
                                                value={form.color}
                                                onChange={handleChange}
                                                className="w-12 h-12 rounded-2xl border border-white/20 cursor-pointer bg-transparent"
                                            />
                                            <span className="text-text-secondary text-sm">
                                                {form.color.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Descripción */}
                                <div className="lg:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-3">
                                        <FileText className="h-4 w-4 text-accent" />
                                        Descripción
                                    </label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Describe los detalles del evento..."
                                        rows="4"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-text-primary 
                                            placeholder-text-secondary/60 focus:border-accent focus:ring-2 focus:ring-accent/20 
                                            transition-all duration-200 resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Botón de envío */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 border-t border-white/10 gap-2 sm:gap-0">
                                <div className="text-text-secondary text-sm mb-2 sm:mb-0">
                                    Los eventos serán visibles para todos los usuarios
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-accent-gold text-black 
                                        font-semibold px-4 py-3 sm:px-8 sm:py-3 rounded-2xl shadow-lg shadow-yellow-500/25 
                                        transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/40 
                                        hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed 
                                        disabled:transform-none"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                                            Creando...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" />
                                            Crear Evento
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* Calendario */}
                    <div className="bg-primary/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-accent/20 to-accent-gold/20 border-b border-white/10 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="text-center sm:text-left">
                                <h3 className="text-lg sm:text-xl font-semibold text-text-primary flex items-center justify-center sm:justify-start gap-2">
                                    <CalendarIcon className="h-5 w-5 text-accent" />
                                    Vista de Calendario
                                </h3>
                                <p className="text-text-secondary text-sm mt-1">
                                    Visualiza y gestiona todos los eventos programados
                                </p>
                            </div>
                            <div className="flex justify-center sm:justify-end">
                                <button className="flex items-center gap-2 bg-white/10 text-text-primary font-semibold px-4 py-2 rounded-2xl 
                                    hover:bg-white/20 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto justify-center">
                                    <Download className="h-4 w-4" />
                                    Exportar
                                </button>
                            </div>
                        </div>
                        </div>
                        <div className="p-4 sm:p-6 overflow-x-auto">
                            <Calendar isAdmin={true} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}