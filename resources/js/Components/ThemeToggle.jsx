// resources/js/Components/ThemeToggle.jsx
import { useState, useEffect } from 'react';

export default function ThemeToggle({ mobile = false, floating = false }) {
    const [isDark, setIsDark] = useState(true);

    // Cargar tema al iniciar
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const isDarkMode = savedTheme === 'dark';
        setIsDark(isDarkMode);
        applyTheme(isDarkMode);
    }, []);

    const applyTheme = (dark) => {
        const html = document.documentElement;
        if (dark) {
            html.classList.add('dark');
            html.classList.remove('light');
        } else {
            html.classList.add('light');
            html.classList.remove('dark');
        }
    };

    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        applyTheme(newDark);
        localStorage.setItem('theme', newDark ? 'dark' : 'light');
        
        // Forzar repintado para asegurar que los estilos se aplican
        setTimeout(() => {
            document.body.style.display = 'none';
            document.body.offsetHeight; // Trigger reflow
            document.body.style.display = '';
        }, 10);
    };

    // Versión flotante para móviles
    if (floating) {
        return (
            <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-accent shadow-lg hover:shadow-xl text-black transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-3 focus:ring-accent/50"
                aria-label={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
            >
                {isDark ? (
                    // Sol - para cambiar a claro
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                ) : (
                    // Luna - para cambiar a oscuro
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                )}
            </button>
        );
    }

    // Versión normal (toggle switch)
    return (
        <button
            onClick={toggleTheme}
            className={`flex items-center ${
                mobile ? 'w-12 h-6' : 'w-12 h-6 hover:scale-105'
            } rounded-full bg-gray-300 dark:bg-gray-700 px-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50`}
            aria-label={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
        >
            <div className={`flex items-center justify-center w-4 h-4 rounded-full bg-white dark:bg-gray-900 shadow-md transform transition-transform duration-300 ${
                isDark ? 'translate-x-6' : 'translate-x-0'
            }`}>
                {isDark ? (
                    <svg className="w-3 h-3 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                ) : (
                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
        </button>
    );
}