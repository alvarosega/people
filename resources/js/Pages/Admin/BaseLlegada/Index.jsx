import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '@/Components/PaginationInertia';
import { 
    Plus, 
    Download, 
    Upload, 
    Edit, 
    Trash2, 
    Search, 
    FileText,
    CheckCircle2
} from 'lucide-react';

export default function Index({ auth, registros, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [loadingStates, setLoadingStates] = useState({});
    const isInitialMount = useRef(true);

    const n = (value) => {
        return new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value || 0);
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const delaySearch = setTimeout(() => {
            router.get(route('admin.base-llegada.index'), 
                { search }, 
                { preserveState: true, replace: true }
            );
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [search]);

    const handleDelete = async (registro) => {
        if (confirm(`¿Eliminar registro de ${registro.usuario?.nombre} (Salario: ${registro.periodo_salario_display})?`)) {
            setLoadingStates(prev => ({ ...prev, [registro.id]: true }));
            router.delete(route('admin.base-llegada.destroy', registro.id), {
                onFinish: () => {
                    setLoadingStates(prev => {
                        const newState = { ...prev };
                        delete newState[registro.id];
                        return newState;
                    });
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-gray-900 dark:text-white">Base Llegada</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Administración de ciclos de compensación</p>
                    </div>
                </div>
            }
        >
            <Head title="Base Llegada" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Alertas */}
                    {flash?.success && (
                        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center gap-3 shadow-sm">
                            <CheckCircle2 size={20} />
                            <span className="font-medium">{flash.success}</span>
                        </div>
                    )}

                    {/* Barra de Acciones y Búsqueda */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                        
                        <div className="w-full md:w-96 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por legajo o nombre..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <Link 
                                href={route('admin.base-llegada.import.show')} 
                                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex-1 md:flex-none text-sm"
                            >
                                <Upload size={16} /> Importar CSV
                            </Link>
                            <a 
                                href={route('admin.base-llegada.export')} 
                                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex-1 md:flex-none text-sm"
                            >
                                <Download size={16} /> Exportar CSV
                            </a>
                            <Link 
                                href={route('admin.base-llegada.create')} 
                                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full md:w-auto text-sm shadow-sm"
                            >
                                <Plus size={16} /> Nuevo Registro
                            </Link>
                        </div>
                    </div>

                    {/* Contenedor de Tabla */}
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden relative">
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-full text-left border-collapse whitespace-nowrap">
                                <thead className="bg-gray-50 dark:bg-gray-800/50">
                                    <tr className="border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        <th className="px-6 py-4 font-medium">Ciclo Temporal</th>
                                        {/* Columna Sticky en móvil */}
                                        <th className="px-6 py-4 font-medium sticky left-0 z-10 bg-gray-50 dark:bg-gray-800/50 shadow-[1px_0_0_0_#e5e7eb] dark:shadow-[1px_0_0_0_#374151] md:shadow-none">Empleado</th>
                                        <th className="px-6 py-4 font-medium text-right">Var. 100%</th>
                                        <th className="px-6 py-4 font-medium text-center">% Logro</th>
                                        <th className="px-6 py-4 font-medium text-right">Alcanzado</th>
                                        <th className="px-6 py-4 font-medium">Bonos Adicionales</th>
                                        <th className="px-6 py-4 font-medium text-right">Total Pago</th>
                                        <th className="px-6 py-4 font-medium text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {registros.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-24 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <FileText className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                                                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">No se encontraron registros de compensación.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        registros.data.map((r) => {
                                            const v100 = parseFloat(r.variable_100) || 0;
                                            const pLogro = parseFloat(r.pago_porcentaje) || 0;
                                            const percentDisplay = pLogro * 100;
                                            
                                            // Badges lógicos
                                            const isGood = percentDisplay >= 100;
                                            const isWarning = percentDisplay >= 95 && percentDisplay < 100;

                                            return (
                                                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                                    
                                                    {/* Ciclo Temporal */}
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="space-y-1 min-w-[140px] text-xs">
                                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                                <span className="w-12 font-medium">Variable:</span>
                                                                <span className="text-gray-900 dark:text-gray-100 capitalize">{r.periodo_variable_display}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                                <span className="w-12 font-medium">Salario:</span>
                                                                <span className="text-gray-900 dark:text-gray-100 font-medium capitalize">{r.periodo_salario_display}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500">
                                                                <span className="w-12 font-medium">Pago:</span>
                                                                <span>{r.fecha_pago_display}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Empleado - Sticky */}
                                                    <td className="px-6 py-4 align-top min-w-[200px] sticky left-0 z-10 bg-white dark:bg-gray-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50 shadow-[1px_0_0_0_#e5e7eb] dark:shadow-[1px_0_0_0_#374151] md:shadow-none transition-colors">
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{r.usuario?.nombre || 'Desconocido'}</p>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">ID: {r.legajo}</span>
                                                            {r.territorio && (
                                                                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium truncate">{r.territorio}</span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Variable 100% */}
                                                    <td className="px-6 py-4 align-top text-right min-w-[120px]">
                                                        <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                                            ${n(v100)}
                                                        </span>
                                                    </td>

                                                    {/* % Logro Badge */}
                                                    <td className="px-6 py-4 align-top text-center min-w-[100px]">
                                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                                            isGood ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                                            isWarning ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                                                            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                        }`}>
                                                            {n(percentDisplay)}%
                                                        </span>
                                                    </td>

                                                    {/* Alcanzado */}
                                                    <td className="px-6 py-4 align-top text-right min-w-[120px]">
                                                        <span className="font-mono text-sm text-gray-900 dark:text-gray-100 font-medium">
                                                            ${n(v100 * pLogro)}
                                                        </span>
                                                    </td>

                                                    {/* Detalle Bonos */}
                                                    <td className="px-6 py-4 align-top min-w-[180px]">
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                                            <span className="text-gray-500 dark:text-gray-400">Alimentos:</span> 
                                                            <span className="text-right text-gray-900 dark:text-gray-100 font-mono">${n(r.devol_alimen)}</span>
                                                            
                                                            <span className="text-gray-500 dark:text-gray-400">Territorio:</span> 
                                                            <span className="text-right text-gray-900 dark:text-gray-100 font-mono">${n(r.dev_territorio)}</span>
                                                            
                                                            <span className="text-gray-500 dark:text-gray-400">Casa:</span> 
                                                            <span className="text-right text-gray-900 dark:text-gray-100 font-mono">${n(r.dev_casa)}</span>
                                                        </div>
                                                    </td>

                                                    {/* Total Pago (Calculado desde Backend) */}
                                                    <td className="px-6 py-4 align-top text-right min-w-[140px]">
                                                        <p className="text-base font-bold text-gray-900 dark:text-white font-mono">
                                                            ${n(r.pago_calculado)}
                                                        </p>
                                                    </td>

                                                    {/* Acciones */}
                                                    <td className="px-6 py-4 align-middle text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Link 
                                                                href={route('admin.base-llegada.edit', r.id)} 
                                                                className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                                                title="Editar"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                            <button 
                                                                onClick={() => handleDelete(r)}
                                                                disabled={loadingStates[r.id]}
                                                                className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
                                                                title="Eliminar"
                                                            >
                                                                {loadingStates[r.id] ? (
                                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                                                ) : (
                                                                    <Trash2 className="h-4 w-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Paginación */}
                    {registros.data.length > 0 && (
                        <div className="mt-6 flex justify-end">
                            <Pagination links={registros.links} />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}