import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { CalendarDays, Percent, Banknote, MessageSquare, ArrowRight, Wallet, Target, Trophy } from "lucide-react";

export default function Index({ auth, registros = [] }) {
  const n = (x) =>
    (Number(x) || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-accent shadow-glow">
            <Wallet className="h-6 w-6 text-abinbev-dark" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-text-primary tracking-tight">Historial detallado de variables y bonos asignados</h2>
          </div>
        </div>
      }
    >
      <Head title="Base Llegada" />

      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        <div className="space-y-6">
          {registros && registros.length > 0 ? (
            registros.map((r, index) => <RegistroCard key={r.id || index} r={r} n={n} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-primary-secondary shadow-soft dark:shadow-dark-soft rounded-2xl border border-text-secondary/10">
              <Target className="h-16 w-16 text-text-secondary/30 mb-4" />
              <p className="text-text-secondary font-medium">No se registran datos cargados en su legajo aún.</p>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

function RegistroCard({ r, n }) {
  // 1. Cálculos
  const factorReal = Number(r.pago_porcentaje) || 0;
  const displayPercent = factorReal * 100;

  // 2. Tematización usando tus colores funcionales
  let theme = {
    border: "border-t-functional-red",
    glow: "from-functional-red/10",
    text: "text-functional-red",
  };
  
  if (displayPercent >= 95 && displayPercent < 100) {
    theme = {
      border: "border-t-abinbev-yellow",
      glow: "from-abinbev-yellow/10",
      text: "text-abinbev-gold",
    };
  } else if (displayPercent >= 100) {
    theme = {
      border: "border-t-functional-green",
      glow: "from-functional-green/10",
      text: "text-functional-green",
    };
  }

  // 3. Formateo estricto de fechas en Español
  const formatMonth = (dateString) => {
    if (!dateString) return "N/A";
    const [year, month] = String(dateString).split("T")[0].split("-");
    const date = new Date(year, parseInt(month) - 1, 1);
    return date.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  };

  const formatExactDate = (dateString) => {
    if (!dateString) return "N/A";
    const [year, month, day] = String(dateString).split("T")[0].split("-");
    const date = new Date(year, parseInt(month) - 1, day);
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

// Lógica para abrir el calendario un mes antes del periodo de salario
const rawDate = String(r.periodo_salario || "").split("T")[0].split("-");
let urlYear = parseInt(rawDate[0], 10) || new Date().getFullYear();
let urlMonth = (parseInt(rawDate[1], 10) || (new Date().getMonth() + 1)) - 1;

// Si el mes es Enero (1), al restar queda 0, debemos pasar a Diciembre (12) del año anterior
if (urlMonth === 0) {
  urlMonth = 12;
  urlYear--;
}
  return (
    <div className={`relative bg-primary-secondary rounded-2xl border border-text-secondary/10 shadow-float dark:shadow-dark-float overflow-hidden transition-transform-shadow hover-lift`}>
      
      {/* Indicador de Estado */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.glow} ${theme.border} border-t-2`} />

      <div className="p-6 md:p-8">
        
        {/* HEADER: Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <DateBadge label="Periodo Variable - Devoluciones" value={formatMonth(r.periodo_variable)} />
          <DateBadge label="Salario Aplicado" value={formatMonth(r.periodo_salario)} isHighlight />
          <DateBadge label="Fecha de Pago" value={formatExactDate(r.fecha_pago)} />
        </div>

        {/* CUERPO: Finanzas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Bloque: Variable */}
          <div className="bg-primary rounded-xl p-6 border border-text-secondary/10 relative overflow-hidden">
            <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${theme.glow} to-transparent rounded-full blur-3xl opacity-60`} />
            
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <Target size={18} className="text-accent" />
              </div>
              <h4 className="text-xs font-bold uppercase text-text-secondary tracking-widest">Cálculo Variable</h4>
            </div>

            <div className="space-y-4">
              <DataRow label="Variable al 100%" value={`$${n(r.variable_100)}`} />
              
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-text-secondary">Logro Obtenido</span>
                <span className={`font-mono text-xl font-black ${theme.text}`}>
                  {n(displayPercent)}%
                </span>
              </div>

              <div className="pt-4 border-t border-text-secondary/10 flex justify-between items-end">
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Monto Alcanzado</span>
                <span className="text-3xl font-black text-text-primary tracking-tight">${n(r.alcanzado)}</span>
              </div>
            </div>
          </div>
          <Link
            href={route("user.calendar", { month: urlMonth, year: urlYear })}
            className="flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary border border-text-secondary/20 hover:border-accent text-text-primary rounded-xl font-bold text-sm btn-hover group"
          >
            <CalendarDays size={18} className="text-text-secondary group-hover:text-accent transition-colors" />
            Ver calendario de pago
            <ArrowRight size={16} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
          </Link>
          {/* Bloque: Bonos */}
          <div className="bg-primary rounded-xl p-6 border border-text-secondary/10">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                <Banknote size={18} className="text-accent" />
              </div>
              <h4 className="text-xs font-bold uppercase text-text-secondary tracking-widest">Desglose Bonos Fijos</h4>
            </div>

            <div className="space-y-3 mb-5">
              <DataRow label="Alimentación(Lun-Vie)" value={`$${n(r.devol_alimen)}`} />
              <DataRow label="Territorio(Lun-Sab)" value={`$${n(r.dev_territorio)}`} />
              <DataRow label="Casa" value={`$${n(r.dev_casa)}`} />
            </div>

            <div className="pt-4 border-t border-text-secondary/10 flex justify-between items-end mt-auto">
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Total Bonos</span>
              <span className="text-3xl font-black text-abinbev-gold tracking-tight">${n(r.total_bonos)}</span>
            </div>
          </div>
        </div>

        {/* FOOTER: Acciones */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 pt-6 border-t border-text-secondary/10">
          
          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4">


            
            {r.comentario && (
              <div className="flex-1 flex items-start gap-3 px-4 py-2.5 bg-accent/5 border border-accent/10 rounded-xl text-text-primary text-sm">
                <MessageSquare size={16} className="text-accent shrink-0 mt-0.5" />
                <p className="leading-relaxed">"{r.comentario}"</p>
              </div>
            )}
          </div>



        </div>
      </div>
    </div>
  );
}

const DateBadge = ({ label, value, isHighlight }) => (
  <div className={`p-5 rounded-2xl flex flex-col justify-center items-center text-center transition-all ${isHighlight ? 'bg-accent/10 border-2 border-accent/30 shadow-glow' : 'bg-primary border border-text-secondary/10'}`}>
    <span className={`text-[11px] font-black uppercase tracking-[0.15em] mb-2 ${isHighlight ? 'text-abinbev-gold' : 'text-text-secondary'}`}>
      {label}
    </span>
    <span className="text-xl md:text-2xl font-black text-text-primary capitalize leading-none">
      {value}
    </span>
  </div>
);

const DataRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-sm text-text-secondary">{label}</span>
    <span className="font-mono text-sm font-medium text-text-primary">{value}</span>
  </div>
);