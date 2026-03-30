// resources/js/Components/SearchFilter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter } from 'lucide-react';

export default function SearchFilter({ onSearch, filters, roleOptions = [], regionOptions = [] }) {
    // Inicializar estado con los filtros actuales
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.rol || '');
    const [regionFilter, setRegionFilter] = useState(filters.region || '');
    
    // Ref para rastrear si es la carga inicial y evitar la primera búsqueda en blanco
    const isInitialMount = useRef(true);

    // Efecto de Debounce
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Configurar el temporizador de 2 segundos (2000 ms)
        const delaySearch = setTimeout(() => {
            onSearch(search, roleFilter, regionFilter);
        }, 2000);

        // Limpiar el temporizador si el usuario interactúa antes de que pasen los 2 segundos
        return () => clearTimeout(delaySearch);
    }, [search, roleFilter, regionFilter]); // Se ejecuta al cambiar cualquier estado

    const clearFilters = () => {
        setSearch('');
        setRoleFilter('');
        setRegionFilter('');
        // Al limpiar, ejecutamos la búsqueda inmediatamente (sin delay)
        onSearch('', '', '');
    };

    const hasActiveFilters = search || roleFilter || regionFilter;

    return (
        <div className="bg-primary/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col md:flex-row items-stretch gap-4">
                
                {/* Búsqueda por texto */}
                <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-text-secondary group-focus-within:text-accent transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por legajo, nombre, email o puesto..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-text-primary placeholder-text-secondary/60 focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                </div>

                {/* Filtro Rol */}
                <div className="md:w-48 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-text-secondary" />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-text-primary appearance-none focus:border-accent focus:ring-1 focus:ring-accent transition-all [&>option]:bg-primary [&>option]:text-white"
                    >
                        <option value="">Todos los roles</option>
                        {roleOptions.map(role => (
                            <option key={role} value={role} className="capitalize">{role}</option>
                        ))}
                    </select>
                </div>

                {/* Filtro Región */}
                <div className="md:w-48 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-text-secondary" />
                    </div>
                    <select
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-text-primary appearance-none focus:border-accent focus:ring-1 focus:ring-accent transition-all [&>option]:bg-primary [&>option]:text-white"
                    >
                        <option value="">Todas las regiones</option>
                        {regionOptions.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                </div>

                {/* Botón Limpiar */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-xl text-text-secondary hover:text-red-400 transition-all group"
                        title="Limpiar filtros"
                    >
                        <X className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span className="md:hidden">Limpiar filtros</span>
                    </button>
                )}
            </div>
            
            <div className="mt-3 flex items-center justify-end">
                 <p className="text-xs text-text-secondary/60 italic">
                    {hasActiveFilters ? "Buscando automáticamente en 2 segundos..." : "Escribe o selecciona para buscar."}
                 </p>
            </div>
        </div>
    );
}