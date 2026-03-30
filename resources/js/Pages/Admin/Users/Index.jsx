import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/PaginationInertia';
import SearchFilter from '@/Components/SearchFilter';
import { 
    Plus, 
    Download, 
    Edit, 
    Trash2, 
    User, 
    Shield,
    Check,
    CheckCircle2,
    Users
} from 'lucide-react';

export default function Index({ users, filters, roles, regions }) {
    const { props } = usePage();
    const { flash } = props;
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loadingStates, setLoadingStates] = useState({});
    const isInitialMount = useRef(true);

    const handleSearch = (searchVal, roleFilter, regionFilter) => {
        router.get(route('admin.users.index'), {
            search: searchVal,
            rol: roleFilter,
            region: regionFilter
        }, {
            preserveState: true,
            replace: true
        });
    };

    // Efecto de búsqueda con debounce (si usas un input externo al SearchFilter)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const delaySearch = setTimeout(() => {
            router.get(route('admin.users.index'), 
                { search }, 
                { preserveState: true, replace: true }
            );
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [search]);

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

    const toggleSelectAll = () => {
        if (selectedUsers.length === users.data.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.data.map(u => u.id));
        }
    };

    // Badges de Rol adaptados al sistema de diseño
    const getRoleBadge = (role) => {
        switch(role) {
            case 'admin':
                return 'bg-functional-red/10 text-functional-red border-functional-red/20';
            case 'user':
                return 'bg-functional-green/10 text-functional-green border-functional-green/20';
            default:
                return 'bg-text-secondary/10 text-text-secondary border-text-secondary/20';
        }
    };

    return (
        <AuthenticatedLayout
            user={props.auth.user}
            header={
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-accent shadow-glow">
                        <Users className="h-6 w-6 text-abinbev-dark" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-text-primary tracking-tight">Directorio de Personal</h2>
                        <p className="text-text-secondary text-sm mt-0.5">
                            {users.total} usuario{users.total !== 1 ? 's' : ''} registrados en la plataforma
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Gestión de Usuarios" />

            <div className="py-8">
                <div className="max-w-[1400px] mx-auto sm:px-6 lg:px-8">
                    
                    {/* Alertas */}
                    {flash?.success && (
                        <div className="mb-6 p-4 rounded-xl bg-functional-green/10 border border-functional-green/20 text-functional-green flex items-center gap-3 animate-slide-up shadow-sm">
                            <CheckCircle2 size={20} strokeWidth={2.5} />
                            <span className="font-medium">{flash.success}</span>
                        </div>
                    )}

                    {/* Acciones Superiores */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8 bg-primary-secondary p-4 rounded-2xl border border-text-secondary/10 shadow-float dark:shadow-dark-float">
                        <div className="flex-1 w-full">
                            <SearchFilter
                                onSearch={handleSearch}
                                filters={filters}
                                roleOptions={roles}
                                regionOptions={regions}
                            />
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
                            <button
                                onClick={exportCSV}
                                className="inline-flex items-center justify-center gap-2 bg-primary border border-text-secondary/20 text-text-secondary font-bold py-3 px-5 rounded-xl hover:text-accent hover:border-accent/40 transition-all btn-hover flex-1 md:flex-none text-sm"
                            >
                                <Download size={18} strokeWidth={2.5} />
                                <span>Exportar CSV</span>
                            </button>

                            <Link
                                href={route('admin.users.create')}
                                className="inline-flex items-center justify-center gap-2 bg-accent text-abinbev-dark font-black py-3 px-6 rounded-xl shadow-glow hover-lift w-full md:w-auto text-sm tracking-wide uppercase"
                            >
                                <Plus size={18} strokeWidth={3} />
                                <span>Nuevo Usuario</span>
                            </Link>
                        </div>
                    </div>

                    {/* Contenedor de Tabla */}
                    <div className="bg-primary-secondary rounded-3xl border border-text-secondary/10 shadow-float dark:shadow-dark-float overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-primary border-b border-text-secondary/10 text-[10px] uppercase tracking-widest text-text-secondary">
                                        <th className="px-6 py-4 font-black text-center w-16">
                                            <button 
                                                onClick={toggleSelectAll}
                                                className={`w-4 h-4 rounded border transition-colors flex items-center justify-center mx-auto
                                                    ${selectedUsers.length === users.data.length && users.data.length > 0
                                                        ? 'bg-accent border-accent text-black' 
                                                        : 'bg-primary border-text-secondary/30 hover:border-accent/50'
                                                    }`}
                                            >
                                                {selectedUsers.length === users.data.length && users.data.length > 0 && (
                                                    <Check size={12} strokeWidth={4} />
                                                )}
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 font-black">Usuario</th>
                                        <th className="px-6 py-4 font-black">Contacto</th>
                                        <th className="px-6 py-4 font-black">Ubicación</th>
                                        <th className="px-6 py-4 font-black">Rol</th>
                                        <th className="px-6 py-4 font-black text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-text-secondary/10">
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-24 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <User className="h-12 w-12 text-text-secondary/30 mb-3" />
                                                    <p className="text-text-secondary font-medium text-lg">No se encontraron registros</p>
                                                    <p className="text-text-secondary/60 text-sm mt-1">Ajusta los filtros o crea un nuevo usuario.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((user) => (
                                            <tr 
                                                key={user.id} 
                                                className={`transition-colors group ${selectedUsers.includes(user.id) ? 'bg-primary' : 'hover:bg-primary'}`}
                                            >
                                                {/* Checkbox */}
                                                <td className="px-6 py-4 text-center align-middle">
                                                    <button
                                                        onClick={() => toggleSelectUser(user.id)}
                                                        className={`w-4 h-4 rounded border transition-colors flex items-center justify-center mx-auto
                                                            ${selectedUsers.includes(user.id) 
                                                                ? 'bg-accent border-accent text-black' 
                                                                : 'bg-primary border-text-secondary/30 group-hover:border-accent/50'
                                                            }`}
                                                    >
                                                        {selectedUsers.includes(user.id) && (
                                                            <Check size={12} strokeWidth={4} />
                                                        )}
                                                    </button>
                                                </td>

                                                {/* Usuario Info */}
                                                <td className="px-6 py-4 align-middle min-w-[250px]">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-11 w-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                                                            <span className="font-black text-accent text-sm">
                                                                {user.nombre.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-text-primary text-sm mb-0.5">{user.nombre}</p>
                                                            <div className="inline-flex items-center px-2 py-0.5 bg-primary border border-text-secondary/10 rounded">
                                                                <p className="text-[10px] text-text-secondary font-mono tracking-widest font-bold">
                                                                    ID: {user.legajo}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contacto */}
                                                <td className="px-6 py-4 align-middle">
                                                    <p className="text-sm font-medium text-text-primary">{user.email}</p>
                                                    <p className="text-[11px] font-bold tracking-wider uppercase text-text-secondary mt-1">{user.puesto || 'Sin puesto'}</p>
                                                </td>

                                                {/* Ubicación */}
                                                <td className="px-6 py-4 align-middle">
                                                    <p className="text-sm font-medium text-text-primary">{user.region || 'Sin región'}</p>
                                                    <p className="text-[11px] font-bold tracking-wider uppercase text-text-secondary mt-1">{user.territorio || 'Sin territorio'}</p>
                                                </td>

                                                {/* Rol Badge */}
                                                <td className="px-6 py-4 align-middle">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getRoleBadge(user.rol)}`}>
                                                        {user.rol === 'admin' ? <Shield size={12} strokeWidth={2.5} /> : <User size={12} strokeWidth={2.5} />}
                                                        <span>{user.rol}</span>
                                                    </span>
                                                </td>

                                                {/* Acciones */}
                                                <td className="px-6 py-4 align-middle text-center">
                                                    <div className="flex items-center justify-center gap-2 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity duration-200">
                                                        <Link
                                                            href={route('admin.users.edit', user.id)}
                                                            className="p-2 rounded-xl bg-primary border border-text-secondary/10 hover:border-accent hover:text-accent text-text-secondary transition-all shadow-sm"
                                                            title="Editar"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                        
                                                        {user.rol !== 'admin' && (
                                                            <button
                                                                onClick={() => handleDelete(user)}
                                                                disabled={loadingStates[user.id]}
                                                                className="p-2 rounded-xl bg-primary border border-text-secondary/10 hover:border-functional-red/50 hover:bg-functional-red/10 text-text-secondary hover:text-functional-red disabled:opacity-30 transition-all shadow-sm"
                                                                title="Eliminar"
                                                            >
                                                                {loadingStates[user.id] ? (
                                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-functional-red border-t-transparent"></div>
                                                                ) : (
                                                                    <Trash2 className="h-4 w-4" />
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {users.data.length > 0 && (
                        <div className="mt-8 flex justify-end">
                            <Pagination links={users.links} />
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}