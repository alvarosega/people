import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AdminIndex({ auth, stats }) {
    return (
        <AuthenticatedLayout>
            <Head title="Bienvenido Admin" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-12 text-center md:text-left">
                        <h1 className="text-4xl font-display font-bold text-text-primary">
                            Panel de Control
                        </h1>
                        <p className="mt-2 text-text-secondary text-lg">
                            Selecciona un módulo en el menú superior para comenzar.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <StatCard title="Usuarios Totales" value={stats.total_usuarios} icon="👥" />
                        <StatCard title="Usuarios Activos" value={stats.usuarios_activos} icon="✅" />
                        <StatCard title="Registros Base" value={stats.total_registros} icon="📊" />
                        <StatCard title="Pagos Mes" value={`$${stats.pagos_mes_actual.toLocaleString()}`} icon="💰" />
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <QuickAction 
                            href="/admin/users" 
                            title="Gestión de Usuarios" 
                            desc="Crea, edita o elimina personal de la plataforma."
                        />
                        <QuickAction 
                            href="/admin/base-llegada" 
                            title="Base de Llegada" 
                            desc="Gestiona pagos, importa CSV y revisa historiales."
                        />
                        <QuickAction 
                            href="/admin/organigrama" 
                            title="Organigrama" 
                            desc="Visualiza y edita la jerarquía de la empresa."
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div className="bg-secondary p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-soft hover-lift">
            <span className="text-3xl mb-4 block">{icon}</span>
            <p className="text-sm font-semibold text-text-secondary uppercase tracking-widest">{title}</p>
            <p className="text-3xl font-display font-bold text-text-primary mt-2">{value}</p>
        </div>
    );
}

function QuickAction({ href, title, desc }) {
    return (
        <Link href={href} className="group bg-primary p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-accent transition-all duration-300">
            <h3 className="text-xl font-bold text-text-primary group-hover:text-accent">{title}</h3>
            <p className="mt-2 text-text-secondary text-sm leading-relaxed">{desc}</p>
        </Link>
    );
}