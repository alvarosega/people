import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import logoLight from '@/Components/Logo/logo.png';
import logoDark from '@/Components/Logo/logo-dark.png';
import ThemeToggle from '@/Components/ThemeToggle';
import { 
    Home, Users, Wallet, CalendarDays, Calendar, 
    Building2, Info, User as UserIcon, LogOut, Menu, ChevronDown,
    Calculator, FileText 
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { url } = usePage();

    // Detectar scroll para sombra y borde en navbar
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cerrar bottom sheet al cambiar de ruta
    useEffect(() => {
        setBottomSheetOpen(false);
    }, [url]);

    // Determinar logo según tema
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const logoSrc = isDark ? logoDark : logoLight;

    return (
        <div className="min-h-screen bg-primary text-text-primary font-sans antialiased flex flex-col transition-colors duration-300">
            {/* Navbar Estilo Apple (Glassmorphism) */}
            <nav className={`sticky top-0 z-40 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-primary/75 backdrop-blur-xl border-b border-text-secondary/10 shadow-sm' 
                    : 'bg-primary/95 backdrop-blur-md border-b border-transparent'
            }`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 sm:h-16 items-center justify-between">
                        
                        {/* Izquierda: Logo y menú hamburguesa (móvil) */}
                        <div className="flex items-center flex-1">
                            <button
                                onClick={() => setBottomSheetOpen(true)}
                                className="flex md:hidden mr-2 p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-text-secondary/10 transition-colors active:scale-95"
                                aria-label="Abrir menú"
                            >
                                <Menu size={24} strokeWidth={2} />
                            </button>
                            <Link href="/" className="flex items-center mx-auto md:mx-0 transition-transform active:scale-95">
                                <img src={logoSrc} alt="Logo" className="h-7 sm:h-8 md:h-9 w-auto" />
                            </Link>
                        </div>

                        {/* Centro: Navegación (solo desktop) */}
                        <div className="hidden md:flex md:items-center md:space-x-1 flex-1 justify-center">
                            {user.rol === 'admin' ? (
                                <>
                                    <NavLink href={route('admin.base-llegada.index')}>Inicio</NavLink>
                                    <NavLink href={route('admin.users.index')}>Usuarios</NavLink>
                                    <NavLink href={route('admin.work-calendar.index')}>Días Laborales</NavLink>
                                    <NavLink href={route('admin.calendar')}>Eventos</NavLink>
                                    <NavLink href={route('admin.organigrama.index')}>Organigrama</NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink href={route('user.base_llegada')}>Mis Pagos</NavLink>
                                    <NavLink href={route('user.calendar')}>Calendario</NavLink>
                                    <NavLink href={route('user.seniority_bonus')}>Bono Antigüedad</NavLink>
                                    <NavLink href={route('user.quinquenio_request')}>Solicitud Quinquenio</NavLink>
                                </>
                            )}
                        </div>

                        {/* Derecha: Tema y usuario (desktop) */}
                        <div className="flex items-center justify-end flex-1 gap-3">
                            <div className="hidden md:block">
                                <ThemeToggle variant="icon" />
                            </div>
                            <div className="hidden md:block">
                                <UserDropdown user={user} />
                            </div>
                            {/* Avatar móvil (simple) */}
                            <div className="md:hidden">
                                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-tr from-accent to-accent/60 text-primary font-black text-xs shadow-sm">
                                    {user?.nombre?.charAt(0).toUpperCase() ?? '?'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header opcional */}
            {header && (
                <header className="bg-primary/50 backdrop-blur-sm border-b border-text-secondary/5 relative z-30">
                    <div className="mx-auto max-w-7xl px-4 py-0 sm:px-6 lg:px-8">
                        <div className="animate-fade-in">{header}</div>
                    </div>
                </header>
            )}

            {/* Contenido principal */}
            <main className="flex-1 w-full relative z-10">
            <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-2 pt-2 pb-8">
                    <div className="animate-fade-in">{children}</div>
                </div>
            </main>

            {/* Botón flotante de tema en móvil */}
            <div className="md:hidden fixed bottom-6 right-4 z-30">
                <ThemeToggle floating />
            </div>

            {/* Bottom Sheet para móvil */}
            <BottomSheet isOpen={bottomSheetOpen} onClose={() => setBottomSheetOpen(false)} user={user} />
        </div>
    );
}

/* ---------------- Componentes internos ---------------- */

function NavLink({ href, children }) {
    const { url } = usePage();
    const isActive = url === href || url.startsWith(href + '/');
    return (
        <Link
            href={href}
            className={`relative px-4 py-2 text-[13px] font-bold transition-all rounded-full ${
                isActive 
                    ? 'text-text-primary bg-text-secondary/10' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-text-secondary/5'
            }`}
        >
            {children}
        </Link>
    );
}

function UserDropdown({ user }) {
    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-text-secondary/5 border border-text-secondary/10 hover:bg-text-secondary/10 transition-colors active:scale-95">
                    <span className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-tr from-accent to-accent/60 text-primary text-xs font-black">
                        {user?.nombre?.charAt(0).toUpperCase() ?? '?'}
                    </span>
                    <span className="hidden lg:block text-sm font-bold text-text-primary tracking-tight">
                        {user.nombre}
                    </span>
                    <ChevronDown size={14} strokeWidth={3} className="text-text-secondary" />
                </button>
            </Dropdown.Trigger>
            <Dropdown.Content className="mt-2 w-56 bg-primary/90 backdrop-blur-xl rounded-2xl shadow-lg border border-text-secondary/10 p-1.5 overflow-hidden">
            <Dropdown.Link 
                href={user.rol === 'admin' ? route('admin.profile.edit') : route('user.profile.edit')} 
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold hover:bg-text-secondary/10 text-text-primary transition-colors"
            >
                    <UserIcon size={16} strokeWidth={2.5} className="text-text-secondary" />
                    Mi Perfil
                </Dropdown.Link>
                <div className="border-t border-text-secondary/10 my-1 mx-2" />
                <Dropdown.Link href="/logout" method="post" as="button" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 w-full text-left transition-colors">
                    <LogOut size={16} strokeWidth={2.5} />
                    Cerrar Sesión
                </Dropdown.Link>
            </Dropdown.Content>
        </Dropdown>
    );
}

function BottomSheet({ isOpen, onClose, user }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
            {/* Backdrop oscuro con Blur (Estilo iOS) */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            {/* Contenedor del Sheet */}
            <div
                className="relative bg-primary/95 backdrop-blur-2xl rounded-t-[32px] shadow-2xl border-t border-text-secondary/10 transform transition-transform duration-300 ease-out flex flex-col max-h-[90vh]"
                style={{ transform: isOpen ? 'translateY(0)' : 'translateY(100%)' }}
            >
                {/* Grab Handle */}
                <div className="w-12 h-1.5 bg-text-secondary/20 rounded-full mx-auto mt-4 mb-2 shrink-0" />

                <div className="p-6 space-y-6 overflow-y-auto overscroll-contain">
                    {/* User info Card */}
                    <div className="flex items-center gap-4 bg-text-secondary/5 p-4 rounded-2xl border border-text-secondary/10">
                        <span className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-tr from-accent to-accent/60 text-primary text-lg font-black shadow-sm">
                            {user?.nombre?.charAt(0).toUpperCase() ?? '?'}
                        </span>
                        <div>
                            <div className="text-base font-bold text-text-primary tracking-tight">
                                {user?.nombre ?? 'Usuario'}
                            </div>
                            <div className="text-xs font-bold text-text-secondary tracking-widest uppercase mt-0.5">
                                ID: {user?.legajo ?? user?.email ?? ''}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 px-2 mb-2">
                            Menú Principal
                        </div>
                        {user.rol === 'admin' ? (
                            <>
                                <MobileLink href="/admin" icon={<Home size={20} />}>Inicio</MobileLink>
                                <MobileLink href="/admin/users" icon={<Users size={20} />}>Usuarios</MobileLink>
                                <MobileLink href="/admin/base-llegada" icon={<Wallet size={20} />}>Base Llegada</MobileLink>
                                <MobileLink href={route('admin.work-calendar.index')} icon={<CalendarDays size={20} />}>Días Laborales</MobileLink>
                                <MobileLink href="/admin/calendar" icon={<Calendar size={20} />}>Eventos</MobileLink>
                                <MobileLink href="/admin/organigrama" icon={<Building2 size={20} />}>Organigrama</MobileLink>
                            </>
                        ) : (
                            <>
                                <MobileLink href={route('user.base_llegada')} icon={<Wallet size={20} />}>Mis Pagos</MobileLink>
                                <MobileLink href={route('user.calendar')} icon={<CalendarDays size={20} />}>Calendario</MobileLink>
                                <MobileLink href={route('user.seniority_bonus')} icon={<Calculator size={20} />}>Bono Antigüedad</MobileLink>
                                <MobileLink href={route('user.quinquenio_request')} icon={<FileText size={20} />}>Solicitud Quinquenio</MobileLink>
                            </>
                        )}
                    </nav>

                    {/* Acciones Rápidas */}
                    <div className="pt-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60 px-2 mb-2">
                            Cuenta
                        </div>
                        <MobileLink 
                            href={user.rol === 'admin' ? route('admin.profile.edit') : route('user.profile.edit')} 
                            icon={<UserIcon size={20} />}
                        >
                            Mi Perfil
                        </MobileLink>
                        
                        <div className="mt-2">
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex items-center gap-4 w-full px-4 py-3.5 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-2xl transition-colors active:scale-95"
                            >
                                <LogOut size={20} strokeWidth={2.5} />
                                <span>Cerrar Sesión</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MobileLink({ href, icon, children, ...props }) {
    const { url } = usePage();
    const isActive = url === href || url.startsWith(href + '/');
    return (
        <Link
            href={href}
            {...props}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[15px] font-bold transition-all active:scale-95 ${
                isActive
                    ? 'bg-text-secondary/10 text-text-primary'
                    : 'text-text-secondary hover:bg-text-secondary/5 hover:text-text-primary'
            }`}
        >
            <span className={isActive ? 'text-text-primary' : 'text-text-secondary/70'}>
                {icon}
            </span>
            <span>{children}</span>
        </Link>
    );
}