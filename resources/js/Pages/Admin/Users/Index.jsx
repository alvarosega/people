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

    const getRoleBadge = (role) => {
        switch(role) {
            case 'admin':
                return 'bg-functional-red/10 text-functional-red border-functional-red/30';
            case 'user':
                return 'bg-functional-green/10 text-functional-green border-functional-green/30';
            default:
                return 'bg-text-secondary/10 text-text-secondary border-text-secondary/30';
        }
    };

    return (
        <AuthenticatedLayout
            user={props.auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-accent shadow-glow shrink-0">
                            <Users className="h-6 w-6 text-abinbev-dark" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="font-bold text-xl md:text-2xl text-text-primary tracking-tight uppercase">Directorio de Personal</h2>
                            <p className="text-text-secondary text-xs md:text-sm mt-0.5 tracking-wide">
                                {users.total} usuario{users.total !== 1 ? 's' : ''} registrados
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Gestión de Usuarios" />

            <div className="py-4 md:py-8">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Alertas */}
                    {flash?.success && (
                        <div className="mb-6 p-4 rounded-xl bg-functional-green/10 border-[0.5px] border-functional-green/40 text-functional-green flex items-center gap-3 animate-slide-up shadow-sm">
                            <CheckCircle2 size={20} strokeWidth={2.5} className="shrink-0" />
                            <span className="font-medium text-sm md:text-base">{flash.success}</span>
                        </div>
                    )}

                    {/* Acciones Superiores */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 bg-primary-secondary p-4 md:p-5 rounded-2xl border-[0.5px] border-text-secondary/20 shadow-float">
                        <div className="w-full lg:flex-1">
                            <SearchFilter
                                onSearch={handleSearch}
                                filters={filters}
                                roleOptions={roles}
                                regionOptions={regions}
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-3 w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
                            <button
                                onClick={exportCSV}
                                className="inline-flex items-center justify-center gap-2 bg-primary border-[0.5px] border-text-secondary/30 text-text-secondary font-bold py-3 px-5 rounded-xl hover:text-accent hover:border-accent/60 transition-all text-sm tracking-wide"
                            >
                                <Download size={18} strokeWidth={2.5} />
                                <span>Exportar CSV</span>
                            </button>

                            <Link
                                href={route('admin.users.create')}
                                className="inline-flex items-center justify-center gap-2 bg-accent text-abinbev-dark font-black py-3 px-6 rounded-xl shadow-glow hover:opacity-90 transition-opacity text-sm tracking-widest uppercase"
                            >
                                <Plus size={18} strokeWidth={3} />
                                <span>Nuevo Usuario</span>
                            </Link>
                        </div>
                    </div>

                    {/* Contenedor de Tabla Ultra-Responsivo */}
                    <div className="bg-primary-secondary rounded-2xl border-[0.5px] border-text-secondary/20 shadow-float overflow-hidden relative">
                        <div className="overflow-x-auto w-full custom-scrollbar">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-primary border-b-[0.5px] border-text-secondary/20 text-[10px] uppercase tracking-widest text-text-secondary">
                                        {/* Checkbox Header */}
                                        <th className="px-4 md:px-6 py-4 font-black text-center w-12 shrink-0">
                                            <button 
                                                onClick={toggleSelectAll}
                                                className={`w-4 h-4 rounded border transition-colors flex items-center justify-center mx-auto
                                                    ${selectedUsers.length === users.data.length && users.data.length > 0
                                                        ? 'bg-accent border-accent text-black' 
                                                        : 'bg-primary border-text-secondary/40 hover:border-accent/80'
                                                }`}
                                            >
                                                {selectedUsers.length === users.data.length && users.data.length > 0 && (
                                                    <Check size={12} strokeWidth={4} />
                                                )}
                                            </button>
                                        </th>
                                        
                                        {/* Columna Anclada (Sticky) en Móvil */}
                                        <th className="px-4 md:px-6 py-4 font-black sticky left-0 z-10 bg-primary shadow-[1px_0_0_0_rgba(255,255,255,0.05)] md:shadow-none">Usuario</th>
                                        <th className="px-4 md:px-6 py-4 font-black">Contacto</th>
                                        <th className="px-4 md:px-6 py-4 font-black">Ubicación</th>
                                        <th className="px-4 md:px-6 py-4 font-black">Rol</th>
                                        <th className="px-4 md:px-6 py-4 font-black text-center sticky right-0 md:static bg-primary shadow-[-1px_0_0_0_rgba(255,255,255,0.05)] md:shadow-none">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-[0.5px] divide-text-secondary/10">
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-24 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <User className="h-12 w-12 text-text-secondary/20 mb-3" />
                                                    <p className="text-text-secondary font-medium text-lg uppercase tracking-wide">Sin Registros</p>
                                                    <p className="text-text-secondary/50 text-sm mt-1">Ajusta los filtros o ingresa nuevos datos.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((user) => (
                                            <tr 
                                                key={user.id} 
                                                className={`transition-colors group hover:bg-primary/50 ${selectedUsers.includes(user.id) ? 'bg-primary/80' : 'bg-transparent'}`}
                                            >
                                                {/* Checkbox */}
                                                <td className="px-4 md:px-6 py-4 text-center align-middle">
                                                    <button
                                                        onClick={() => toggleSelectUser(user.id)}
                                                        className={`w-4 h-4 rounded border transition-colors flex items-center justify-center mx-auto
                                                            ${selectedUsers.includes(user.id) 
                                                                ? 'bg-accent border-accent text-black' 
                                                                : 'bg-primary border-text-secondary/40 group-hover:border-accent/80'
                                                        }`}
                                                    >
                                                        {selectedUsers.includes(user.id) && (
                                                            <Check size={12} strokeWidth={4} />
                                                        )}
                                                    </button>
                                                </td>

                                                {/* Usuario Info - Sticky */}
                                                <td className={`px-4 md:px-6 py-4 align-middle min-w-[220px] sticky left-0 z-10 shadow-[1px_0_0_0_rgba(255,255,255,0.05)] md:shadow-none transition-colors group-hover:bg-primary-secondary ${selectedUsers.includes(user.id) ? 'bg-primary/80' : 'bg-primary-secondary'}`}>
                                                    <div className="flex items-center gap-3 md:gap-4">
                                                        <div className="h-10 w-10 md:h-11 md:w-11 rounded-lg bg-accent/10 border-[0.5px] border-accent/30 flex items-center justify-center flex-shrink-0">
                                                            <span className="font-black text-accent text-xs md:text-sm">
                                                                {user.nombre.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-text-primary text-xs md:text-sm mb-0.5 truncate max-w-[120px] sm:max-w-[180px] md:max-w-xs" title={user.nombre}>{user.nombre}</p>
                                                            <div className="inline-flex items-center px-1.5 py-0.5 bg-primary border-[0.5px] border-text-secondary/20 rounded">
                                                                <p className="text-[9px] md:text-[10px] text-text-secondary font-mono tracking-widest font-bold">
                                                                    ID: {user.legajo}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contacto */}
                                                <td className="px-4 md:px-6 py-4 align-middle">
                                                    <p className="text-xs md:text-sm font-medium text-text-primary">{user.email}</p>
                                                    <p className="text-[10px] md:text-[11px] font-bold tracking-widest uppercase text-accent mt-1">{user.puesto || 'S/N'}</p>
                                                </td>

                                                {/* Ubicación */}
                                                <td className="px-4 md:px-6 py-4 align-middle">
                                                    <p className="text-xs md:text-sm font-medium text-text-primary">{user.region || 'S/R'}</p>
                                                    <p className="text-[10px] md:text-[11px] font-bold tracking-widest uppercase text-text-secondary mt-1">
                                                        {user.ultimo_territorio || 'S/T'}
                                                    </p>
                                                </td>

                                                {/* Rol Badge */}
                                                <td className="px-4 md:px-6 py-4 align-middle">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border-[0.5px] text-[9px] md:text-[10px] font-black uppercase tracking-widest ${getRoleBadge(user.rol)}`}>
                                                        {user.rol === 'admin' ? <Shield size={10} strokeWidth={3} /> : <User size={10} strokeWidth={3} />}
                                                        <span>{user.rol}</span>
                                                    </span>
                                                </td>

                                                {/* Acciones - Sticky en Móvil opcional (activado para facilidad de tap) */}
                                                <td className={`px-4 md:px-6 py-4 align-middle text-center sticky right-0 md:static shadow-[-1px_0_0_0_rgba(255,255,255,0.05)] md:shadow-none transition-colors group-hover:bg-primary-secondary ${selectedUsers.includes(user.id) ? 'bg-primary/80' : 'bg-primary-secondary'}`}>
                                                    <div className="flex items-center justify-center gap-2 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity duration-200">
                                                        <Link
                                                            href={route('admin.users.edit', user.id)}
                                                            className="p-2 rounded-lg bg-primary border-[0.5px] border-text-secondary/20 hover:border-accent hover:text-accent text-text-secondary transition-all"
                                                            title="Editar"
                                                        >
                                                            <Edit className="h-4 w-4" strokeWidth={2.5} />
                                                        </Link>
                                                        
                                                        {user.rol !== 'admin' && (
                                                            <button
                                                                onClick={() => handleDelete(user)}
                                                                disabled={loadingStates[user.id]}
                                                                className="p-2 rounded-lg bg-primary border-[0.5px] border-text-secondary/20 hover:border-functional-red/60 hover:bg-functional-red/10 text-text-secondary hover:text-functional-red disabled:opacity-30 transition-all"
                                                                title="Eliminar"
                                                            >
                                                                {loadingStates[user.id] ? (
                                                                    <div className="h-4 w-4 animate-spin rounded-full border-[2px] border-functional-red border-t-transparent"></div>
                                                                ) : (
                                                                    <Trash2 className="h-4 w-4" strokeWidth={2.5} />
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
                        <div className="mt-6 flex justify-center md:justify-end">
                            <Pagination links={users.links} />
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}