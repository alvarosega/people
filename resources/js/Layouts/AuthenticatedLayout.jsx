import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import logoLight from '@/Components/Logo/logo.png';
import logoDark from '@/Components/Logo/logo-dark.png';
import ThemeToggle from '@/Components/ThemeToggle';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { url } = usePage();

    // Detectar scroll para sombra en navbar
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
            {/* Navbar */}
            <nav className={`sticky top-0 z-40 bg-primary/80 backdrop-blur-md border-b border-text-secondary/10 transition-all duration-300 ${isScrolled ? 'shadow-soft dark:shadow-dark-soft' : ''}`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 sm:h-16 items-center justify-between">
                        
                        {/* Izquierda: Logo y menú hamburguesa (móvil) */}
                        <div className="flex items-center flex-1">
                            <button
                                onClick={() => setBottomSheetOpen(true)}
                                className="flex md:hidden mr-3 p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-primary-secondary transition-colors"
                                aria-label="Abrir menú"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <Link href="/" className="flex items-center mx-auto md:mx-0 hover-lift">
                                <img src={logoSrc} alt="Logo" className="h-7 sm:h-8 md:h-9 w-auto" />
                            </Link>
                        </div>

                        {/* Centro: Navegación (solo desktop) */}
                        <div className="hidden md:flex md:items-center md:space-x-2 flex-1 justify-center">
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
                                    <NavLink href={route('user.organigrama.index')}>Organigrama</NavLink>
                                    <NavLink href={route('user.information.index')}>Información</NavLink>
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
                                <span className="flex items-center justify-center h-9 w-9 rounded-xl bg-accent/10 border border-accent/20 text-accent font-black text-sm shadow-inner">
                                    {user?.nombre?.charAt(0).toUpperCase() ?? '?'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header opcional */}
            {header && (
                <header className="bg-primary border-b border-text-secondary/10 shadow-sm relative z-30">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                        <div className="animate-fade-in">{header}</div>
                    </div>
                </header>
            )}

            {/* Contenido principal */}
            <main className="flex-1 w-full relative z-10">
                <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
                    <div className="animate-fade-in">{children}</div>
                </div>
            </main>

            {/* Botón flotante de tema en móvil */}
            <div className="md:hidden fixed bottom-6 right-4 z-50">
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
            className={`relative px-4 py-2 text-sm font-bold transition-all hover:text-accent rounded-xl ${
                isActive ? 'text-accent bg-accent/5' : 'text-text-secondary hover:bg-primary-secondary'
            }`}
        >
            {children}
            {isActive && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-accent rounded-t-full shadow-glow" />
            )}
        </Link>
    );
}

function UserDropdown({ user }) {
    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-primary-secondary border border-text-secondary/10 hover:border-accent/40 transition-colors shadow-sm btn-hover">
                    <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-black shadow-inner">
                        {user?.nombre?.charAt(0).toUpperCase() ?? '?'}
                    </span>
                    <span className="hidden lg:block text-sm font-bold text-text-primary">
                        {user.nombre}
                    </span>
                    <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </Dropdown.Trigger>
            <Dropdown.Content className="mt-2 w-56 bg-primary rounded-2xl shadow-float dark:shadow-dark-float border border-text-secondary/10 p-1">
                <Dropdown.Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold hover:bg-primary-secondary text-text-primary transition-colors">
                    <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mi Perfil
                </Dropdown.Link>
                <div className="border-t border-text-secondary/10 my-1 mx-2" />
                <Dropdown.Link href="/logout" method="post" as="button" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-functional-red hover:bg-functional-red/10 w-full text-left transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                </Dropdown.Link>
            </Dropdown.Content>
        </Dropdown>
    );
}

function BottomSheet({ isOpen, onClose, user }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            {/* Sheet */}
            <div
                className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-text-secondary/10 transform transition-transform duration-300 ease-out"
                style={{ transform: isOpen ? 'translateY(0)' : 'translateY(100%)' }}
            >
                {/* Handle */}
                <div className="w-12 h-1.5 bg-text-secondary/20 rounded-full mx-auto mt-4 mb-2" />

                <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
                    {/* User info */}
                    <div className="flex items-center gap-4 bg-primary-secondary p-4 rounded-2xl border border-text-secondary/5">
                        <span className="flex items-center justify-center h-14 w-14 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xl font-black shadow-inner">
                            {user?.nombre?.charAt(0).toUpperCase() ?? '?'}
                        </span>
                        <div>
                            <div className="text-lg font-bold text-text-primary">
                                {user?.nombre ?? 'Usuario'}
                            </div>
                            <div className="text-sm font-medium text-text-secondary font-mono tracking-tighter">
                                ID: {user?.legajo ?? user?.email ?? ''}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1.5">
                        <div className="text-[10px] font-black uppercase tracking-widest text-text-secondary px-3 mb-3">
                            Menú Principal
                        </div>
                        {user.rol === 'admin' ? (
                            <>
                                <MobileLink href="/admin" icon="🏠">Inicio</MobileLink>
                                <MobileLink href="/admin/users" icon="👥">Usuarios</MobileLink>
                                <MobileLink href="/admin/base-llegada" icon="💰">Base Llegada</MobileLink>
                                <MobileLink href={route('admin.work-calendar.index')} icon="📅">Días Laborales</MobileLink>
                                <MobileLink href="/admin/calendar" icon="📌">Eventos</MobileLink>
                                <MobileLink href="/admin/organigrama" icon="🏢">Organigrama</MobileLink>
                            </>
                        ) : (
                            <>
                                <MobileLink href={route('user.base_llegada')} icon="💰">Mis Pagos</MobileLink>
                                <MobileLink href={route('user.calendar')} icon="📅">Calendario</MobileLink>
                                <MobileLink href={route('user.organigrama.index')} icon="🏢">Organigrama</MobileLink>
                                <MobileLink href={route('user.information.index')} icon="ℹ️">Información</MobileLink>
                            </>
                        )}
                    </nav>

                    {/* Acciones Rápidas */}
                    <div className="pt-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-text-secondary px-3 mb-3">
                            Cuenta
                        </div>
                        <MobileLink href="/profile" icon="👤">Mi Perfil</MobileLink>
                        
                        <div className="mt-2">
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex items-center gap-3 w-full px-4 py-3.5 text-sm font-bold text-functional-red bg-functional-red/5 hover:bg-functional-red/10 border border-functional-red/10 rounded-xl transition-colors"
                            >
                                <span className="text-lg">🚪</span>
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
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                isActive
                    ? 'bg-accent/10 text-accent border border-accent/20 shadow-sm'
                    : 'text-text-secondary hover:bg-primary-secondary hover:text-text-primary border border-transparent'
            }`}
        >
            <span className="text-lg opacity-90">{icon}</span>
            <span>{children}</span>
            {isActive && <span className="ml-auto text-accent text-lg shadow-glow rounded-full">•</span>}
        </Link>
    );
}