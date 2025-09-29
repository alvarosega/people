import { Link } from '@inertiajs/react';
import backgroundImg from '@/assets/login-bg.jpg';
import ThemeToggle from '@/Components/ThemeToggle';

export default function GuestLayout({ children }) {
    return (
        <div
            className="flex min-h-screen items-center justify-center bg-cover bg-center bg-fixed relative p-4 sm:p-6 lg:p-8"
            style={{ backgroundImage: `url(${backgroundImg})` }}
        >
            {/* Overlay sutil para mejor legibilidad */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
            
            {/* Botón flotante para cambiar tema - Responsivo */}
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
                <ThemeToggle floating />
            </div>

            {/* Contenedor responsivo */}
            <div className="relative z-10 w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 
                transform transition-all duration-300">
                {children}
            </div>
        </div>
    );
}