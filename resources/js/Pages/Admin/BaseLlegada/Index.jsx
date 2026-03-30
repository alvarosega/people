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
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-accent shadow-glow">
                        <FileText className="h-6 w-6 text-abinbev-dark" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="font-bold text-2xl text-text-primary tracking-tight">Base Llegada</h2>
                        <p className="text-sm text-text-secondary mt-0.5">Administración de ciclos de compensación</p>
                    </div>
                </div>
            }
        >
            <Head title="Base Llegada" />

            <div className="py-8">
                <div className="max-w-[1400px] mx-auto sm:px-6 lg:px-8">
                    
                    {/* Alertas */}
                    {flash?.success && (
                        <div className="mb-6 p-4 rounded-xl bg-functional-green/10 border border-functional-green/20 text-functional-green flex items-center gap-3 animate-slide-up shadow-sm">
                            <CheckCircle2 size={20} strokeWidth={2.5} />
                            <span className="font-medium">{flash.success}</span>
                        </div>
                    )}

                    {/* Barra de Acciones y Búsqueda */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-8 bg-primary-secondary p-4 rounded-2xl border border-text-secondary/10 shadow-float dark:shadow-dark-float">
                        
                        <div className="w-full lg:w-96 relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-text-secondary group-focus-within:text-accent transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por legajo o nombre..."
                                className="w-full pl-11 pr-4 py-3 bg-primary border border-text-secondary/10 rounded-xl text-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-inner"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            <Link 
                                href={route('admin.base-llegada.import.show')} 
                                className="inline-flex items-center justify-center gap-2 bg-primary border border-text-secondary/20 text-text-secondary font-bold py-3 px-5 rounded-xl hover:text-accent hover:border-accent/40 transition-all btn-hover flex-1 lg:flex-none text-sm"
                            >
                                <Upload size={18} strokeWidth={2.5} /> Importar CSV
                            </Link>
                            <a 
                                href={route('admin.base-llegada.export')} 
                                className="inline-flex items-center justify-center gap-2 bg-primary border border-text-secondary/20 text-text-secondary font-bold py-3 px-5 rounded-xl hover:text-accent hover:border-accent/40 transition-all btn-hover flex-1 lg:flex-none text-sm"
                            >
                                <Download size={18} strokeWidth={2.5} /> Exportar CSV
                            </a>
                            <Link 
                                href={route('admin.base-llegada.create')} 
                                className="inline-flex items-center justify-center gap-2 bg-accent text-abinbev-dark font-black py-3 px-6 rounded-xl shadow-glow hover-lift w-full lg:w-auto text-sm tracking-wide uppercase"
                            >
                                <Plus size={18} strokeWidth={3} /> Nuevo Registro
                            </Link>
                        </div>
                    </div>

                    {/* Contenedor de Tabla Principal */}
                    <div className="bg-primary-secondary rounded-3xl border border-text-secondary/10 shadow-float dark:shadow-dark-float overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-primary border-b border-text-secondary/10 text-[10px] uppercase tracking-widest text-text-secondary">
                                        <th className="px-6 py-4 font-black">Ciclo Temporal</th>
                                        <th className="px-6 py-4 font-black">Empleado</th>
                                        <th className="px-6 py-4 font-black text-right">Var. 100%</th>
                                        <th className="px-6 py-4 font-black text-center">% Logro</th>
                                        <th className="px-6 py-4 font-black text-right">Alcanzado</th>
                                        <th className="px-6 py-4 font-black">Bonos Detalle</th>
                                        <th className="px-6 py-4 font-black text-right">Total Pago</th>
                                        <th className="px-6 py-4 font-black text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-text-secondary/10">
                                    {registros.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-24 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <FileText className="h-12 w-12 text-text-secondary/30 mb-3" />
                                                    <p className="text-text-secondary font-medium">No se encontraron registros de compensación.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        registros.data.map((r) => {
                                            const v100 = parseFloat(r.variable_100) || 0;
                                            const pLogro = parseFloat(r.pago_porcentaje) || 0;
                                            const percentDisplay = pLogro * 100;
                                            const totalB = (parseFloat(r.devol_alimen) || 0) + (parseFloat(r.dev_territorio) || 0) + (parseFloat(r.dev_casa) || 0);
                                            const totalCalculado = (v100 * pLogro) + totalB;
                                            
                                            // Estado de Logro para Badge
                                            const isGood = percentDisplay >= 100;
                                            const isWarning = percentDisplay >= 95 && percentDisplay < 100;

                                            return (
                                                <tr key={r.id} className="transition-colors hover:bg-primary group">
                                                    
                                                    {/* Ciclo Temporal */}
                                                    <td className="px-6 py-4 align-top">
                                                        <div className="space-y-1.5 min-w-[140px]">
                                                            <div className="flex items-center gap-2 text-[10px] text-text-secondary">
                                                                <span className="w-14 uppercase font-bold tracking-wider">Var:</span>
                                                                <span className="text-text-primary capitalize">{r.periodo_variable_display}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-[10px] text-text-secondary">
                                                                <span className="w-14 uppercase font-bold tracking-wider text-accent">Sal:</span>
                                                                <span className="text-accent font-bold capitalize">{r.periodo_salario_display}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-[10px] text-text-secondary italic">
                                                                <span className="w-14 uppercase font-bold tracking-wider">Pago:</span>
                                                                <span>{r.fecha_pago_display}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Empleado */}
                                                    <td className="px-6 py-4 align-top min-w-[200px]">
                                                        <p className="text-sm font-bold text-text-primary mb-1">{r.usuario?.nombre || 'Desconocido'}</p>
                                                        <div className="inline-flex items-center px-2 py-0.5 bg-primary rounded border border-text-secondary/20">
                                                            <p className="text-[10px] text-text-secondary font-mono tracking-widest font-bold">ID: {r.legajo}</p>
                                                        </div>
                                                    </td>

                                                    {/* Variable 100% */}
                                                    <td className="px-6 py-4 align-top text-right min-w-[120px]">
                                                        <span className="font-mono text-sm text-text-primary font-medium">
                                                            ${n(v100)}
                                                        </span>
                                                    </td>

                                                    {/* % Logro Badge */}
                                                    <td className="px-6 py-4 align-top text-center min-w-[100px]">
                                                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-black border ${
                                                            isGood ? 'bg-functional-green/10 text-functional-green border-functional-green/20' : 
                                                            isWarning ? 'bg-abinbev-yellow/10 text-abinbev-gold border-abinbev-yellow/20' : 
                                                            'bg-functional-red/10 text-functional-red border-functional-red/20'
                                                        }`}>
                                                            {n(percentDisplay)}%
                                                        </span>
                                                    </td>

                                                    {/* Alcanzado */}
                                                    <td className="px-6 py-4 align-top text-right min-w-[120px]">
                                                        <span className="font-mono text-sm text-text-primary font-bold">
                                                            ${n(v100 * pLogro)}
                                                        </span>
                                                    </td>

                                                    {/* Detalle Bonos */}
                                                    <td className="px-6 py-4 align-top min-w-[180px]">
                                                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                                                            <span className="text-text-secondary tracking-wide">ALIM:</span> 
                                                            <span className="text-right text-text-primary font-mono">${n(r.devol_alimen)}</span>
                                                            
                                                            <span className="text-text-secondary tracking-wide">TERR:</span> 
                                                            <span className="text-right text-text-primary font-mono">${n(r.dev_territorio)}</span>
                                                            
                                                            <span className="text-text-secondary tracking-wide">CASA:</span> 
                                                            <span className="text-right text-text-primary font-mono">${n(r.dev_casa)}</span>
                                                            
                                                            <div className="col-span-2 mt-1 pt-1 border-t border-text-secondary/10 flex justify-between">
                                                                <span className="font-black text-text-secondary uppercase tracking-widest">Total:</span> 
                                                                <span className="text-right font-black text-text-primary font-mono">${n(totalB)}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Total Pago (Dorado) */}
                                                    <td className="px-6 py-4 align-top text-right min-w-[140px]">
                                                        <p className="text-[17px] font-black text-abinbev-gold tracking-tight font-mono">
                                                            ${n(totalCalculado)}
                                                        </p>
                                                    </td>

                                                    {/* Acciones */}
                                                    <td className="px-6 py-4 align-middle">
                                                        <div className="flex items-center justify-center gap-2 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity duration-200">
                                                            <Link 
                                                                href={route('admin.base-llegada.edit', r.id)} 
                                                                className="p-2 rounded-xl bg-primary border border-text-secondary/10 hover:border-accent hover:text-accent text-text-secondary transition-all shadow-sm"
                                                                title="Editar Registro"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                            <button 
                                                                onClick={() => handleDelete(r)}
                                                                disabled={loadingStates[r.id]}
                                                                className="p-2 rounded-xl bg-primary border border-text-secondary/10 hover:border-functional-red/50 hover:bg-functional-red/10 text-text-secondary hover:text-functional-red disabled:opacity-30 transition-all shadow-sm"
                                                                title="Eliminar Registro"
                                                            >
                                                                {loadingStates[r.id] ? (
                                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-functional-red border-t-transparent" />
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
                        <div className="mt-8 flex justify-end">
                            <Pagination links={registros.links} />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}