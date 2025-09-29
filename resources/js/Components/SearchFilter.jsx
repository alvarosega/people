// resources/js/Components/SearchFilter.jsx
import React, { useState } from 'react';

export default function SearchFilter({ onSearch, filters, roleOptions, regionOptions }) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.rol || '');
    const [regionFilter, setRegionFilter] = useState(filters.region || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(search, roleFilter, regionFilter);
    };

    const clearFilters = () => {
        setSearch('');
        setRoleFilter('');
        setRegionFilter('');
        onSearch('', '', '');
    };

    return (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar
                    </label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar en todos los campos..."
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol
                    </label>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Todos</option>
                        {roleOptions.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>

                <div className="min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Región
                    </label>
                    <select
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Todas</option>
                        {regionOptions.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                </div>

                <div className="flex space-x-2">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Buscar
                    </button>
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Limpiar
                    </button>
                </div>
            </form>
        </div>
    );
}