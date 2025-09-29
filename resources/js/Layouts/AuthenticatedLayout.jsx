import { Link, usePage, router } from '@inertiajs/react'; 

import { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import logo from '@/Components/Logo/logo.png';
import ThemeToggle from '@/Components/ThemeToggle'; 

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [open, setOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Efecto para detectar scroll en móviles
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cerrar menú móvil al cambiar de ruta
    const { url } = usePage();
    useEffect(() => {
        setOpen(false);
    }, [url]);

    return (
        <div className="min-h-screen bg-primary text-text-primary font-sans antialiased flex flex-col">
            {/* NAVBAR - Optimizado para móviles */}
            <nav className={`sticky top-0 z-50 bg-primary border-b border-gray-200 dark:border-gray-800 transition-all duration-300 ${
                isScrolled ? 'shadow-dark-card py-0' : 'py-0'
            }`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 sm:h-16 items-center justify-between">

                        {/* IZQUIERDA: Logo + Menú hamburguesa móvil */}
                        <div className="flex items-center flex-1">
                            {/* Botón menú hamburguesa - SOLO MÓVIL */}
                            <div className="flex md:hidden mr-2">
                                <button
                                    onClick={() => setOpen(!open)}
                                    className="inline-flex items-center justify-center rounded-soft p-2 text-text-secondary transition-all duration-200 hover:bg-secondary hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
                                    aria-label="Abrir menú"
                                >
                                    {open ? (
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Logo - Centrado en móvil */}
                            <Link href="/" className="flex items-center mx-auto md:mx-0 hover-lift">
                            <img src={logo} alt="Logo" className="h-7 sm:h-8 md:h-10 w-auto transition-transform duration-200" />
                            </Link>
                        </div>

                        {/* CENTRO: Links de navegación - SOLO DESKTOP */}
                        <div className="hidden md:flex md:items-center md:space-x-6 mx-8 flex-1 justify-center">
                            {user.rol === 'admin' ? (
                                <>
                                    <NavLink href="/admin" text="Admin Panel" />
                                    <NavLink href="/admin/users" text="Usuarios" />
                                    <NavLink href="/admin/calendar" text="Calendario" />
                                    <NavLink href="/admin/organigrama" text="Organigrama" />
                                </>
                            ) : (
                                <>
                                    <NavLink href="/user" text="User Panel" />
                                    <NavLink href="/user/calendar" text="Calendario" />
                                    <NavLink href="/user/organigrama" text="Organigrama" />
                                </>
                            )}
                        </div>

                        {/* DERECHA: Usuario - Desktop con dropdown, móvil en menú lateral */}
                        <div className="flex items-center justify-end flex-1 gap-3">
                            {/* Botón Theme Toggle - SOLO DESKTOP */}
                            <div className="hidden md:flex">
                                <ThemeToggle />
                            </div>
                            {/* Desktop User Dropdown */}
                            <div className="hidden md:flex">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-secondary px-4 py-2.5 text-[15px] font-semibold leading-4 text-text-primary transition-all duration-200 hover:border-accent hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-accent/40 btn-hover"
                                        >
                                            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-text-primary font-medium">
                                                {user?.nombre?.charAt(0).toUpperCase() ?? "?"}
                                            </span>

                                            <span className="hidden lg:block">{user.nombre}</span>
                                            
                                            <svg
                                                className="h-4 w-4 text-text-secondary"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href="/profile" className="flex items-center gap-2">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Perfil
                                        </Dropdown.Link>
                                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                        <Dropdown.Link href="/logout" method="post" as="button" className="flex items-center gap-2 text-functional-red hover:text-red-400">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Cerrar Sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>

                            {/* Indicador móvil de usuario */}
                            <div className="md:hidden">
                                <span className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-text-primary font-medium text-sm">
                                    {user?.nombre?.charAt(0).toUpperCase() ?? "?"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MENÚ MÓVIL - Full screen overlay */}
                {open && (
                    <div className="md:hidden fixed inset-0 z-50 animate-scale-in">
                        {/* Overlay click para cerrar */}
                        <div 
                            className="absolute inset-0 bg-black/20"
                            onClick={() => setOpen(false)}
                        />
                        
                        {/* Contenido del menú */}
                        <div className="relative bg-primary border-r border-gray-200 dark:border-gray-800 h-full w-72 sm:w-80 max-w-full shadow-dark-float animate-slide-up">
                            <div className="p-6 space-y-1">
                                {/* Información del usuario */}
                                <div className="mb-6 p-4 rounded-xl bg-secondary">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="flex items-center justify-center h-12 w-12 rounded-full bg-accent text-black font-bold text-lg">
                                            {user?.nombre?.charAt(0).toUpperCase() ?? "?"}
                                        </span>
                                        <div>
                                            <div className="text-lg font-display font-bold text-text-primary">{user?.nombre ?? "Sin nombre"}</div>
                                            <div className="text-sm text-text-secondary">{user?.legajo ?? user?.email ?? ""}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Navegación */}
                                <div className="space-y-2">
                                    <div className="text-xs uppercase tracking-wider text-text-secondary font-semibold px-3 py-2">
                                        Navegación
                                    </div>
                                    {user.rol === 'admin' ? (
                                        <>
                                            <MobileLink href="/admin" text="Admin Panel" icon="🚀" />
                                            <MobileLink href="/admin/users" text="Usuarios" icon="👥" />
                                            <MobileLink href="/admin/calendar" text="Calendario" icon="📅" />
                                            <MobileLink href="/admin/organigrama" text="Organigrama" icon="🏢" />
                                        </>
                                    ) : (
                                        <>
                                            <MobileLink href="/user" text="User Panel" icon="👤" />
                                            <MobileLink href="/user/calendar" text="Calendario" icon="📅" />
                                            <MobileLink href="/user/organigrama" text="Organigrama" icon="🏢" />
                                        </>
                                    )}
                                </div>

                                {/* Acciones de usuario */}
                                <div className="space-y-2 pt-4">
                                    <div className="text-xs uppercase tracking-wider text-text-secondary font-semibold px-3 py-2">
                                        Cuenta
                                    </div>
                                    <MobileLink href="/profile" text="Mi Perfil" icon="👤" />
                                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-secondary">
                                        <span className="flex items-center gap-3 text-text-primary">
                                            <span className="text-lg">🌓</span>
                                            <span>Tema</span>
                                        </span>
                                        <ThemeToggle mobile />
                                    </div>
                                    <MobileLink href="/logout" method="post" as="button" text="Cerrar Sesión" icon="🚪" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* HEADER (opcional) */}
            {header && (
                <header className="bg-primary border-b border-gray-200 dark:border-gray-800 shadow-soft">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="animate-fade-in">
                            {header}
                        </div>
                    </div>
                </header>
            )}

            {/* CONTENIDO PRINCIPAL - Optimizado para móviles */}
            <main className="flex-1 w-full">
                <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6">

                    <div className="animate-fade-in">
                        {children}
                    </div>
                </div>
            </main>
            <div className="md:hidden fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
                <ThemeToggle floating />
            </div>
        </div>
    );
}

/* ------- Subcomponentes ------- */
function NavLink({ href, text }) {
    const { url } = usePage(); // ← Añadir esto
    const isActive = url === href; // ← Usar url de usePage
    
    return (
        <Link
            href={href}
            className={`inline-flex items-center px-3 py-2 rounded-xl text-[15px] font-semibold leading-5 transition-all duration-200 hover-lift ${
                isActive
                    ? 'bg-accent text-black shadow-glow'
                    : 'text-text-secondary hover:text-accent hover:bg-secondary'
            }`}
        >
            {text}
        </Link>
    );
}

function MobileLink({ href, text, icon, ...props }) {
    const { url } = usePage(); // ← Añadir esto
    const isActive = url === href; // ← Usar url de usePage
    
    return (
        <Link
            href={href}
            {...props}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base font-medium transition-all duration-200 ${
                isActive
                    ? 'bg-accent text-black shadow-glow'
                    : 'text-text-secondary hover:bg-secondary hover:text-accent'
            }`}
        >
            {icon && <span className="text-lg">{icon}</span>}
            <span>{text}</span>
            {isActive && (
                <span className="ml-auto text-sm">•</span>
            )}
        </Link>
    );
}