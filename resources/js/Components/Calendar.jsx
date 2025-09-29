// resources/js/Components/Calendar.jsx
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import {
    Calendar as CalendarIcon,
    Filter,
    Eye,
    EyeOff,
    Users,
    X,
    Save,
    Trash2,
    Clock,
    User,
    CheckCircle,
    AlertCircle,
    Loader
} from 'lucide-react';

/* --------- Función utilitaria (colores respetando tu theme) --------- */
const getVacationColor = (estado) => {
    switch (estado) {
        case "pendiente":
            return "bg-yellow-500";
        case "aprobada":
            return "bg-green-500";
        case "rechazada":
            return "bg-red-500";
        default:
            return "bg-gray-500";
    }
};

/* --------- Mapeo de colores reales para FullCalendar (hex) --------- */
const getVacationHex = (estado) => {
    switch (estado) {
        case "pendiente":
            return "#f5e003"; // Amarillo AB InBev
        case "aprobada":
            return "#10b981"; // Verde
        case "rechazada":
            return "#ef4444"; // Rojo
        default:
            return "#6b7280"; // Gris
    }
};

export default function Calendar({ isAdmin = false }) {
    const [events, setEvents] = useState([]);
    const [showEvents, setShowEvents] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    /* --------- FETCH EVENTS --------- */
    const fetchEvents = async () => {
        try {
            if (!showEvents) {
                setEvents([]);
                return;
            }
            const url = isAdmin ? "/admin/events" : "/user/events";
            const res = await axios.get(url);
            setEvents(Array.isArray(res.data) ? res.data.map((e) => ({ 
                ...e, 
                type: "event",
                backgroundColor: e.color || '#3788d8',
                borderColor: e.color || '#3788d8'
            })) : []);
        } catch (err) {
            console.error("Error cargando eventos", err);
            setEvents([]);
        }
    };


    /* --------- FETCH USERS (solo admin) --------- */
    const fetchUsers = async () => {
        try {
            if (!isAdmin) return setUsers([]);
            const res = await axios.get("/admin/users-json");
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error cargando usuarios", err);
            setUsers([]);
        }
    };

    /* --------- EFECTOS --------- */
    useEffect(() => {
        fetchEvents();
    }, [showEvents, isAdmin]);

    /* --------- HANDLERS --------- */
    const handleEventClick = (info) => {
        if (!isAdmin) return;
        const { type } = info.event.extendedProps || {};
            if (confirm(`¿Eliminar el evento "${info.event.title}"?`)) {
                axios
                    .delete(`/admin/events/${info.event.id}`)
                    .then(() => fetchEvents())
                    .catch((err) => console.error(err));
            }
    };

    const handleDateClick = (info) => {
        if (!isAdmin) return;
    };

    const handleModalSave = () => {
        setModalOpen(false);
        fetchVacations();
    };

    /* --------- RENDER --------- */
    return (
        <div className="bg-primary/80 backdrop-blur-sm rounded-2xl border border-white/10 p-3 xs:p-4 sm:p-6 space-y-4 xs:space-y-6">

            {/* HEADER CON FILTROS */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 xs:gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-accent to-accent-gold flex-shrink-0">
                        <CalendarIcon className="h-5 w-5 text-black" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-text-primary text-base xs:text-lg">
                            {isAdmin ? 'Calendario Administrativo' : 'Mi Calendario'}
                        </h3>
                        <p className="text-text-secondary text-xs xs:text-sm truncate">
                            Gestión de eventos y vacaciones
                        </p>
                    </div>
                </div>

                <div className="flex justify-center xs:justify-end">
                    <button
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className="flex items-center justify-center gap-2 bg-white/10 text-text-primary px-3 xs:px-4 py-2 rounded-2xl 
                            hover:bg-white/20 transition-all duration-200 w-full xs:w-auto text-sm xs:text-base"
                    >
                        <Filter className="h-4 w-4 flex-shrink-0" />
                        <span>Filtros</span>
                    </button>
                </div>
            </div>

            {/* PANEL DE FILTROS */}
            {filtersOpen && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 space-y-4">
                    <div className="flex flex-wrap gap-2 xs:gap-3 justify-center xs:justify-start">
                        {/* Mostrar Eventos */}
                        <label className="flex items-center gap-2 xs:gap-3 p-2 xs:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer w-full xs:w-auto justify-center xs:justify-start">
                            <div className="relative flex-shrink-0">
                                <input
                                    type="checkbox"
                                    checked={showEvents}
                                    onChange={() => setShowEvents((s) => !s)}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 xs:w-6 xs:h-6 rounded border-2 transition-all duration-200 flex items-center justify-center
                                    ${showEvents ? 'bg-accent border-accent' : 'border-white/30'}`}
                                >
                                    {showEvents && <CheckCircle className="h-3 h-4 w-3 w-4 text-black" />}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 xs:gap-2">
                                <CalendarIcon className="h-3 w-3 xs:h-4 xs:w-4 text-text-secondary flex-shrink-0" />
                                <span className="text-text-primary text-xs xs:text-sm font-medium whitespace-nowrap">Mostrar Eventos</span>
                            </div>
                        </label>
                    </div>

                    {/* Leyenda de Colores */}
                    <div className="pt-3 border-t border-white/10">
                        <p className="text-text-secondary text-sm font-medium mb-2">Leyenda:</p>
                        <div className="flex flex-col xs:flex-row xs:flex-wrap gap-2 xs:gap-3">
                        <div className="flex items-center gap-2 justify-center xs:justify-start">
                            <div className="w-3 h-3 rounded-full bg-[#3788d8] flex-shrink-0"></div>
                            <span className="text-text-secondary text-xs whitespace-nowrap">Eventos</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center xs:justify-start">
                            <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0"></div>
                            <span className="text-text-secondary text-xs whitespace-nowrap">Pendientes</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center xs:justify-start">
                            <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                            <span className="text-text-secondary text-xs whitespace-nowrap">Aprobadas</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center xs:justify-start">
                            <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                            <span className="text-text-secondary text-xs whitespace-nowrap">Rechazadas</span>
                        </div>
                    </div>
                    </div>
                </div>
            )}

            {/* CALENDARIO */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-x-auto">
                <div className="p-2 xs:p-3 sm:p-4 min-w-[320px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-48 xs:h-64">
                            <div className="text-center">
                                <Loader className="h-6 w-6 xs:h-8 xs:w-8 animate-spin text-accent mx-auto mb-2" />
                                <p className="text-text-secondary text-xs xs:text-sm">Cargando calendario...</p>
                            </div>
                        </div>
                    ) : (
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView={window.innerWidth < 475 ? "dayGridMonth" : window.innerWidth < 768 ? "timeGridWeek" : "dayGridMonth"}
                            events={events}
                            eventClick={handleEventClick}
                            dateClick={isAdmin ? handleDateClick : undefined}
                            headerToolbar={{
                                left: "prev,next",
                                center: "title",
                                right: window.innerWidth < 475 ? "dayGridMonth,timeGridDay" : window.innerWidth < 768 ? "dayGridMonth,timeGridWeek,timeGridDay" : "dayGridMonth,timeGridWeek,timeGridDay",
                            }}
                            locale="es"
                            height="auto"
                            dayMaxEventRows={window.innerWidth < 475 ? 1 : window.innerWidth < 768 ? 2 : 3}
                            navLinks={true}
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            }}
                            eventDisplay="block"
                            eventBorderColor="transparent"
                            eventTextColor="#000000"
                            eventClassNames="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-xs xs:text-sm"
                            views={{
                                dayGridMonth: {
                                    titleFormat: { year: 'numeric', month: 'short' },
                                    dayHeaderFormat: { weekday: 'short' },
                                    dayMaxEventRows: window.innerWidth < 475 ? 1 : 2
                                },
                                timeGridWeek: {
                                    titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
                                    dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric' }
                                },
                                timeGridDay: {
                                    titleFormat: { year: 'numeric', month: 'short', day: 'numeric' },
                                    dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric' }
                                }
                            }}
                            buttonText={{
                                today: 'Hoy',
                                month: 'Mes',
                                week: 'Semana',
                                day: 'Día',
                                list: 'Lista'
                            }}
                        />
                    )}
                </div>
            </div>

        </div>
    );
}

/* --------- MODAL MEJORADO --------- */
function VacationModal({ vacation, onClose, onSave, users = [], isAdmin }) {
    const [form, setForm] = useState({
        id: vacation?.id ?? null,
        legajo: vacation?.legajo ?? "",
        fecha_inicio: vacation?.start ?? "",
        fecha_fin: vacation?.end ?? "",
        dias: vacation?.dias ?? 1,
        estado: vacation?.estado ?? "pendiente",
        comentario: vacation?.comentario ?? "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setForm({
            id: vacation?.id ?? null,
            legajo: vacation?.legajo ?? "",
            fecha_inicio: vacation?.start ?? "",
            fecha_fin: vacation?.end ?? "",
            dias: vacation?.dias ?? 1,
            estado: vacation?.estado ?? "pendiente",
            comentario: vacation?.comentario ?? "",
        });
    }, [vacation]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.fecha_fin && form.fecha_inicio && form.fecha_fin < form.fecha_inicio) {
            alert("La fecha fin no puede ser anterior a la fecha inicio");
            return;
        }

        setIsSubmitting(true);
        try {
            if (form.id) {
                await axios.put(`/admin/vacaciones/${form.id}`, form);
            } else {
                await axios.post(`/admin/vacaciones`, form);
            }
            onSave();
        } catch (err) {
            console.error(err);
            alert("Error guardando vacaciones");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!form.id || !confirm("¿Eliminar esta solicitud de vacaciones?")) return;
        setIsSubmitting(true);
        try {
            await axios.delete(`/admin/vacaciones/${form.id}`);
            onSave();
        } catch (err) {
            console.error(err);
            alert("Error eliminando vacaciones");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop con blur */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-primary/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-10">
                {/* Header */}
                <div className="bg-gradient-to-r from-accent/20 to-accent-gold/20 border-b border-white/10 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                            <Users className="h-5 w-5 text-accent" />
                            {form.id ? "Editar Vacaciones" : "Nueva Solicitud"}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full text-text-secondary hover:text-text-primary transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                            <User className="h-4 w-4 text-accent" />
                            Usuario
                        </label>
                        <select
                            name="legajo"
                            value={form.legajo}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-text-primary 
                                focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                        >
                            <option value="">Seleccionar usuario</option>
                            {users.map((u) => (
                                <option key={u.legajo} value={u.legajo}>
                                    {u.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                                <Clock className="h-4 w-4 text-accent" />
                                Inicio
                            </label>
                            <input
                                name="fecha_inicio"
                                type="date"
                                value={form.fecha_inicio}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-text-primary 
                                    focus:border-accent focus:ring-2 focus:ring-accent/20"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                                <Clock className="h-4 w-4 text-accent" />
                                Fin
                            </label>
                            <input
                                name="fecha_fin"
                                type="date"
                                value={form.fecha_fin}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-text-primary 
                                    focus:border-accent focus:ring-2 focus:ring-accent/20"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                            Días Solicitados
                        </label>
                        <input
                            name="dias"
                            type="number"
                            min="1"
                            value={form.dias}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-text-primary"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                            Estado
                        </label>
                        <select
                            name="estado"
                            value={form.estado}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-text-primary 
                                focus:border-accent focus:ring-2 focus:ring-accent/20"
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="aprobada">Aprobada</option>
                            <option value="rechazada">Rechazada</option>
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                            Comentario
                        </label>
                        <textarea
                            name="comentario"
                            value={form.comentario}
                            onChange={handleChange}
                            rows="3"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-text-primary 
                                resize-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                            placeholder="Observaciones adicionales..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div>
                            {form.id && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-2xl 
                                        hover:bg-red-500/30 transition-all duration-200 disabled:opacity-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Eliminar
                                </button>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 bg-white/10 text-text-primary rounded-2xl 
                                    hover:bg-white/20 transition-all duration-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-accent to-accent-gold 
                                    text-black font-semibold rounded-2xl hover:shadow-lg transition-all duration-200 
                                    disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <Loader className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {form.id ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}