// resources/js/Pages/Admin/Users/Index.jsx
import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/PaginationInertia';
import SearchFilter from '@/Components/SearchFilter';
import { 
    Plus, 
    Upload, 
    Download, 
    Search, 
    Filter, 
    Edit, 
    Trash2, 
    User, 
    Mail, 
    MapPin, 
    Briefcase,
    Shield,
    MoreVertical,
    Check,
    X
} from 'lucide-react';

export default function Index({ users, filters, roles, regions }) {
    const { props } = usePage();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loadingStates, setLoadingStates] = useState({});

    const handleSearch = (search, roleFilter, regionFilter) => {
        router.get(route('admin.users.index'), {
            search,
            rol: roleFilter,
            region: regionFilter
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = async (user) => {
        if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.nombre}?`)) {
            setLoadingStates(prev => ({ ...prev, [user.id]: true }));
            
            await router.delete(route('admin.users.destroy', user.id), {
                onFinish: () => {
                    setLoadingStates(prev => {
                        const newState = { ...prev };
                        delete newState[user.id];
                        return newState;
                    });
                }
            });
        }
    };

    const exportCSV = () => {
        window.location.href = route('admin.users.export');
    };

    const toggleSelectUser = (userId) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const getRoleColor = (role) => {
        const colors = {
            admin: 'from-red-500 to-red-600',
            manager: 'from-blue-500 to-blue-600',
            supervisor: 'from-purple-500 to-purple-600',
            user: 'from-green-500 to-green-600',
            guest: 'from-gray-500 to-gray-600'
        };
        return colors[role] || 'from-gray-500 to-gray-600';
    };

    const getRoleIcon = (role) => {
        const icons = {
            admin: <Shield className="h-3 w-3" />,
            manager: <User className="h-3 w-3" />,
            supervisor: <User className="h-3 w-3" />,
            user: <User className="h-3 w-3" />,
            guest: <User className="h-3 w-3" />
        };
        return icons[role] || <User className="h-3 w-3" />;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-accent to-accent-gold">
                        <User className="h-6 w-6 text-black" />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-text-primary">Gestión de Usuarios</h2>
                        <p className="text-text-secondary text-sm">
                            {users.total} usuario{users.total !== 1 ? 's' : ''} en el sistema
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Gestión de Usuarios" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Actions */}
                    {/* Header Actions */}
                    <div className="flex flex-col gap-6 mb-8">
                        {/* Title Section */}
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                                Administración de Usuarios
                            </h1>
                            <p className="text-text-secondary mt-2 text-sm sm:text-base">
                                Gestiona los usuarios y permisos del sistema
                            </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-stretch sm:items-center gap-3">
                            {/* Main Actions - Full width on mobile, auto on desktop */}
                            <div className="grid grid-cols-1 xs:grid-cols-2 lg:flex gap-3">
                                <Link
                                    href={route('admin.users.create')}
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-accent-gold text-black font-semibold py-3 px-4 sm:px-6 rounded-soft 
                                        shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/40 
                                        transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base"
                                >
                                    <Plus className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">Crear Usuario</span>
                                </Link>
                                
                                <Link
                                    href={route('admin.users.import.show')}
                                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-text-primary font-semibold py-3 px-4 sm:px-6 rounded-soft 
                                        hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base"
                                >
                                    <Upload className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">Importar CSV</span>
                                </Link>
                            </div>
                            
                            {/* Export Button - Full width on mobile, auto on desktop */}
                            <button
                                onClick={exportCSV}
                                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-text-primary font-semibold py-3 px-4 sm:px-6 rounded-soft 
                                    hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base xs:col-span-2 lg:col-span-1"
                            >
                                <Download className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">Exportar CSV</span>
                            </button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-8">
                        <SearchFilter
                            onSearch={handleSearch}
                            filters={filters}
                            roleOptions={roles}
                            regionOptions={regions}
                        />
                    </div>
                    {/* Users Grid */}
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                        {users.data.map((user) => (
                            <div
                                key={user.id}
                                className="group relative bg-primary/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 
                                    transition-all duration-300 hover:border-white/20 hover:bg-primary/90 hover:shadow-2xl hover:scale-105"
                            >
                                {/* Selection Checkbox */}
                                <div className="absolute top-4 right-4">
                                    <button
                                        onClick={() => toggleSelectUser(user.id)}
                                        className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center
                                            ${selectedUsers.includes(user.id) 
                                                ? 'bg-accent border-accent' 
                                                : 'border-text-secondary/50 hover:border-text-secondary'
                                            }`}
                                    >
                                        {selectedUsers.includes(user.id) && (
                                            <Check className="h-3 w-3 text-black" />
                                        )}
                                    </button>
                                </div>

                                {/* User Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-gold flex items-center justify-center">
                                            <User className="h-6 w-6 text-black" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-text-primary truncate">
                                                {user.nombre}
                                            </h3>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                                                bg-gradient-to-r ${getRoleColor(user.rol)} text-white`}>
                                                {getRoleIcon(user.rol)}
                                                {user.rol}
                                            </span>
                                        </div>
                                        <p className="text-text-secondary text-sm">Legajo: {user.legajo}</p>
                                    </div>
                                </div>

                                {/* User Info Grid */}
                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 text-sm mb-6">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-text-secondary/70" />
                                        <div>
                                            <p className="font-medium text-text-primary text-xs uppercase tracking-wide">Email</p>
                                            <p className="text-text-secondary truncate" title={user.email}>
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-text-secondary/70" />
                                        <div>
                                            <p className="font-medium text-text-primary text-xs uppercase tracking-wide">Región</p>
                                            <p className="text-text-secondary">{user.region}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-text-secondary/70" />
                                        <div>
                                            <p className="font-medium text-text-primary text-xs uppercase tracking-wide">Territorio</p>
                                            <p className="text-text-secondary">{user.territorio}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-text-secondary/70" />
                                        <div>
                                            <p className="font-medium text-text-primary text-xs uppercase tracking-wide">Puesto</p>
                                            <p className="text-text-secondary">{user.puesto}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-2 pt-4 border-t border-white/10">
                                    <div className="text-xs text-text-secondary/60 text-center xs:text-left">
                                        Creado: {new Date(user.created_at).toLocaleDateString()}
                                    </div>
                                    
                                    <div className="flex items-center justify-center xs:justify-end gap-2">
                                        <Link
                                            href={route('admin.users.edit', user.id)}
                                            className="p-2 rounded-soft bg-white/5 hover:bg-accent/20 text-text-secondary hover:text-accent 
                                                transition-all duration-200 hover:scale-110 flex-shrink-0"
                                            title="Editar usuario"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        
                                        {user.rol !== 'admin' && (
                                            <button
                                                onClick={() => handleDelete(user)}
                                                disabled={loadingStates[user.id]}
                                                className="p-2 rounded-soft bg-white/5 hover:bg-red-500/20 text-text-secondary hover:text-red-400 
                                                    transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                                title="Eliminar usuario"
                                            >
                                                {loadingStates[user.id] ? (
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {users.data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                                <User className="h-12 w-12 text-text-secondary/50" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">No se encontraron usuarios</h3>
                            <p className="text-text-secondary mb-6">Intenta ajustar los filtros de búsqueda</p>
                            <Link
                                href={route('admin.users.create')}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-accent-gold text-black font-semibold py-2 px-6 rounded-soft"
                            >
                                <Plus className="h-4 w-4" />
                                Crear primer usuario
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {users.data.length > 0 && (
                        <div className="mt-8">
                            <Pagination links={users.links} />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}