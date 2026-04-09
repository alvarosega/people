import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

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
        <div className="pt-2 pb-1">
          <h2 className="font-bold text-2xl md:text-3xl text-text-primary tracking-tight">
            Historial de Variables
          </h2>
        </div>
      }
    >
      <Head title="Base Llegada" />

      <div className="max-w-4xl mx-auto pt-0 pb-8 px-4 sm:px-6">
        <div className="flex flex-col gap-10">
          {registros && registros.length > 0 ? (
            registros.map((r, index) => <RegistroCard key={r.id || index} r={r} n={n} />)
          ) : (
            <div className="glow-card-wrapper" style={{ '--card-gradient': 'linear-gradient(to right, #4b5563, #1f2937)' }}>
              <div className="glow-card-content flex flex-col items-center justify-center py-20 text-center px-6">
                <p className="text-xl font-medium text-text-primary">Sin registros</p>
                <p className="text-sm text-text-secondary mt-2">Su legajo no posee datos cargados.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

function RegistroCard({ r, n }) {
  // 1. Cálculos de Porcentaje
  const factorReal = Number(r.pago_porcentaje) || 0;
  const displayPercent = factorReal * 100;

  // 2. Definición del Gradiente según Logro
  let gradientConfig = "linear-gradient(135deg, #ff4d4d 0%, #ef4444 50%, #991b1b 100%)"; // Rojo Dinámico
  let textColor = "text-red-500";

  if (displayPercent >= 95 && displayPercent < 100) {
    gradientConfig = "linear-gradient(135deg, #fef08a 0%, #facc15 50%, #a16207 100%)"; // Oro Tricolor
    textColor = "text-[#facc15]";
  } else if (displayPercent >= 100) {
    gradientConfig = "linear-gradient(135deg, #4ade80 0%, #10b981 50%, #064e3b 100%)"; // Verde Esmeralda Profundo
    textColor = "text-green-500";
  }

  // 3. Failsafe para Fechas (Garantiza que siempre se vea algo coherente)
  const safeDate = (rawStr, fallbackLabel) => {
    if (fallbackLabel) return fallbackLabel;
    if (!rawStr) return "N/A";
    try {
      const [year, month] = String(rawStr).split("T")[0].split("-");
      const d = new Date(year, parseInt(month) - 1, 1);
      return d.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
    } catch {
      return rawStr;
    }
  };

  const pVariable = safeDate(r.periodo_variable_raw || r.periodo_variable, r.periodo_variable_label);
  const pSalario = safeDate(r.periodo_salario_raw || r.periodo_salario, r.periodo_salario_label);
  const fPago = r.fecha_pago_label || (r.fecha_pago ? String(r.fecha_pago).split("T")[0] : "N/A");

  // 4. Lógica de URL del Calendario
  const rawUrlDate = String(r.periodo_salario_raw || r.periodo_salario || "").split("-");
  let urlYear = parseInt(rawUrlDate[0], 10) || new Date().getFullYear();
  let urlMonth = (parseInt(rawUrlDate[1], 10) || (new Date().getMonth() + 1)) - 1;

  if (urlMonth === 0) {
    urlMonth = 12;
    urlYear--;
  }

  return (
    <div 
        className="glow-card-wrapper group transition-all duration-500 hover:-translate-y-1 active:scale-[0.98] cursor-default" 
        style={{ '--card-gradient': gradientConfig }}
      >
      <div className="glow-card-content p-6 md:p-8">
        
        {/* ENCABEZADO: Fechas */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-text-secondary/20 pb-5 mb-6">
          <DateItem label="Periodo Variable - Devoluciones" value={pVariable} />
          <DateItem label="Salario Aplicado" value={pSalario} highlight />
          <DateItem label="Fecha Pago" value={fPago} alignRight />
        </div>

        {/* CUERPO CENTRAL */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          
          {/* Bloque Izquierdo: Cálculo */}
          <div className="flex-1 space-y-3">
            <h4 className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Desempeño</h4>
            <div className="panel-data flex flex-col justify-between h-[120px]">
              <DataRow label="Variable al 100%" value={`Bs${n(r.variable_100)}`} />
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-text-secondary">Logro Obtenido</span>
                <span className={`font-black text-xl ${textColor}`}>{n(displayPercent)}%</span>
              </div>
              <div className="flex justify-between items-end pt-2 border-t border-text-secondary/10">
                <span className="text-xs font-bold text-text-secondary">Alcanzado</span>
                <span className="text-2xl font-black text-text-primary tracking-tight">Bs{n(r.alcanzado)}</span>
              </div>
            </div>
          </div>

          {/* Bloque Derecho: Bonos */}
          <div className="flex-1 space-y-3">
            <h4 className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Fijos</h4>
            <div className="panel-data flex flex-col justify-between h-[120px]">
              <div className="space-y-1">
                <DataRow label="Alimentación" value={`Bs${n(r.devol_alimen)}`} />
                <DataRow label={`Territorio (${r.territorio || '0'})`} value={`Bs${n(r.dev_territorio)}`} />
                <DataRow label="Casa" value={`Bs${n(r.dev_casa)}`} />
              </div>
              <div className="flex justify-between items-end pt-2 border-t border-text-secondary/10">
                <span className="text-xs font-bold text-text-secondary">Total Bonos</span>
                <span className="text-xl font-black text-text-primary tracking-tight">Bs{n(r.total_bonos)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ACCIONES: Calendario posicionado sobre los comentarios o al final */}
        <div className="flex flex-col gap-4 mt-2">
          <Link
            href={route("user.calendar", { month: urlMonth, year: urlYear })}
            className="w-full text-center py-3 bg-text-secondary/5 hover:bg-text-secondary/10 border border-text-secondary/20 rounded-xl text-sm font-bold text-text-primary transition-colors"
          >
            Revisar calendario de pago
          </Link>

          {r.comentario && (
            <p className="text-xs text-text-secondary bg-bg-secondary p-3 rounded-lg border border-text-secondary/10">
              {r.comentario}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

const DateItem = ({ label, value, highlight, alignRight }) => (
  <div className={`flex flex-col ${alignRight ? 'sm:text-right' : ''}`}>
    <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary mb-1">
      {label}
    </span>
    <span className={`text-base font-bold capitalize ${highlight ? 'text-text-primary' : 'text-text-secondary'}`}>
      {value}
    </span>
  </div>
);

const DataRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs text-text-secondary">{label}</span>
    <span className="font-mono text-xs font-bold text-text-primary">{value}</span>
  </div>
);