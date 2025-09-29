import { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function UserIndex({ auth, registros = [] }) {
  // ---------- Normalizadores (copiados de admin) ----------
  const parseNumber = (v) => {
    if (v === null || v === undefined) return 0;
    if (typeof v === "number") return Number.isFinite(v) ? v : 0;
    let s = String(v).trim().replace(/\$/g, "").replace(/\u00A0/g, "").replace(/\s/g, "");
    const hasComma = s.includes(",");
    const hasDot = s.includes(".");
    if (hasComma && hasDot) {
      if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
        s = s.replace(/\./g, "").replace(",", ".");
      } else {
        s = s.replace(/,/g, "");
      }
    } else if (hasComma) {
      s = s.replace(",", ".");
    }
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  };

  const normalizePercentFactor = (v) => {
    if (v === null || v === undefined) return 0;
    let s = String(v).replace(/%/g, "").trim();
    s = s.replace(/\u00A0/g, "").replace(/\s/g, "");
    s = s.replace(",", ".");
    if ((s.match(/\./g) || []).length > 1) {
      const last = s.lastIndexOf(".");
      s = s.slice(0, last).replace(/\./g, "") + s.slice(last);
    }
    const n = Number(s);
    if (!Number.isFinite(n)) return 0;
    return n <= 2 ? n : n / 100;
  };

  const n = (x, opt = {}) =>
    (Number.isFinite(x) ? x : 0).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      ...opt,
    });

  const nInt = (x, opt = {}) =>
    (Number.isFinite(x) ? x : 0).toLocaleString("es-AR", {
      maximumFractionDigits: 0,
      ...opt,
    });

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-display font-bold text-2xl text-text-primary leading-tight">
          Panel de Usuario
        </h2>
      }
    >
      <Head title="Dashboard Usuario" />

      <div className="min-h-screen bg-primary">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
          {/* Encabezado Principal */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-display font-bold text-text-primary mb-4">
              Bienvenido,{" "}
              <span className="text-accent">
                {auth?.user?.nombre ?? auth?.user?.name ?? "Usuario"}
              </span>
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Aquí puedes consultar todos tus registros de pagos y bonificaciones de manera clara y organizada.
            </p>
          </div>

          {/* Tarjetas de Resumen Rápido */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <SummaryCard
              title="Total de Registros"
              value={nInt(registros.length)}
              icon="📊"
              description="Registros en tu historial"
            />
            <SummaryCard
              title="Promedio de Pago"
              value={`$${n(registros.reduce((acc, r) => {
                const factor = r.pago_porcentaje_decimal !== undefined
                  ? parseNumber(r.pago_porcentaje_decimal)
                  : normalizePercentFactor(r.pago_porcentaje);
                const variable100 = parseNumber(r.variable_100);
                const devolAlimen = parseNumber(r.devol_alimen);
                const devTerritorio = parseNumber(r.dev_territorio);
                const devCasa = parseNumber(r.dev_casa);
                return acc + (variable100 * factor) + devolAlimen + devTerritorio + devCasa;
              }, 0) / Math.max(registros.length, 1))}`}
              icon="💰"
              description="Valor promedio por período"
            />
            <SummaryCard
              title="Último Período"
              value={registros.length > 0 ? registros[0].fecha_display || registros[0].fecha : "N/A"}
              icon="📅"
              description="Período más reciente"
            />
          </div>

          {/* Sección de Registros */}
          <div className="bg-secondary rounded-2xl p-8 shadow-soft border border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h2 className="text-2xl font-display font-semibold text-text-primary mb-4 md:mb-0">
                Mis Registros de Base Llegada
              </h2>
              <div className="text-sm text-text-secondary">
                {registros.length} registro{registros.length !== 1 ? 's' : ''} encontrado{registros.length !== 1 ? 's' : ''}
              </div>
            </div>

            {registros && registros.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {registros.map((r, i) => (
                  <RegistroCard 
                    key={r.id ?? i} 
                    r={r} 
                    authUser={auth.user} 
                    n={n}
                    parseNumber={parseNumber}
                    normalizePercentFactor={normalizePercentFactor}
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

/**
 * Componente de tarjeta de resumen
 */
function SummaryCard({ title, value, icon, description }) {
  return (
    <div className="bg-secondary rounded-2xl p-6 shadow-soft border border-gray-200 dark:border-gray-800 transition-all duration-200 hover-lift">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-1">{title}</p>
          <p className="text-2xl font-display font-bold text-text-primary">{value}</p>
          <p className="text-xs text-text-secondary mt-1">{description}</p>
        </div>
        <span className="text-3xl opacity-80">{icon}</span>
      </div>
    </div>
  );
}

/**
 * Componente por registro - CORREGIDO: Despliegue dentro de montos totales
 */
function RegistroCard({ r, authUser, n, parseNumber, normalizePercentFactor }) {
  const [showDetail, setShowDetail] = useState(false);

  // Cálculos idénticos a la vista de admin
  const factor =
    r.pago_porcentaje_decimal !== undefined
      ? parseNumber(r.pago_porcentaje_decimal)
      : normalizePercentFactor(r.pago_porcentaje);

  const percentDisplay = factor * 100;

  const variable100 = parseNumber(r.variable_100);
  const devolAlimen = parseNumber(r.devol_alimen);
  const devTerritorio = parseNumber(r.dev_territorio);
  const devCasa = parseNumber(r.dev_casa);

  const alcanzado = variable100 * factor;
  const totalBonos = devolAlimen + devTerritorio + devCasa;
  const total = alcanzado + totalBonos;

  // Colores según el porcentaje - Estilo Apple
  const statusConfig =
    percentDisplay < 100
      ? {
          bg: "bg-functional-red/10",
          border: "border-functional-red/20",
          text: "text-functional-red",
          badge: "bg-functional-red/20 text-functional-red"
        }
      : Math.abs(percentDisplay - 100) < 0.001
      ? {
          bg: "bg-gray-200 dark:bg-gray-700",
          border: "border-gray-300 dark:border-gray-600",
          text: "text-gray-700 dark:text-gray-300",
          badge: "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
        }
      : {
          bg: "bg-functional-green/10",
          border: "border-functional-green/20",
          text: "text-functional-green",
          badge: "bg-functional-green/20 text-functional-green"
        };

  return (
    <div
      className={`rounded-2xl border p-6 transition-all duration-200 hover-lift ${statusConfig.bg} ${statusConfig.border}`}
    >
      {/* Header - Información básica */}
      <div className="mb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-display font-semibold text-text-primary truncate mb-1">
              {r.usuario?.nombre || authUser?.nombre || "N/A"}
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-primary px-2 py-1 rounded-lg text-text-secondary">
                Legajo: {r.legajo || authUser?.legajo || "N/A"}
              </span>
              <span className="bg-primary px-2 py-1 rounded-lg text-text-secondary">
                Región: {r.usuario?.region || authUser?.region || "N/A"}
              </span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.badge}`}>
            {n(percentDisplay)}%
          </span>
        </div>

        <div className="text-sm text-text-secondary space-y-1">
          <p><span className="font-medium">Período:</span> {r.fecha_display || r.fecha || "-"}</p>
          <p><span className="font-medium">Anillo:</span> {r.anillo || "-"}</p>
          {r.fecha_pago_display && (
            <p><span className="font-medium">Pago realizado:</span> {r.fecha_pago_display}</p>
          )}
        </div>
      </div>

      {/* Porcentaje destacado */}
      <div className="text-center mb-4 py-3 bg-primary rounded-xl">
        <p className="text-sm text-text-secondary mb-1">Porcentaje de Pago</p>
        <p className="text-3xl font-display font-bold text-text-primary">
          {n(percentDisplay)}%
        </p>
      </div>

      {/* Resumen financiero - CON DESPLIEGUE INTERNO CORREGIDO */}
      <div className="mb-4 rounded-xl bg-primary p-4 border border-gray-200 dark:border-gray-700">
        {/* Alcanzado */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-text-secondary">Alcanzado</span>
          <span className="font-display font-semibold text-text-primary">${n(alcanzado)}</span>
        </div>
        
        {/* Detalle de Meta (desplegable) */}
        {showDetail && (
          <div className="mb-3 ml-4 pl-3 border-l-2 border-gray-300 dark:border-gray-600 animate-slide-up">
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Meta al 100%</span>
              <span className="font-medium">${n(variable100)}</span>
            </div>
          </div>
        )}
        
        {/* Total Bonos */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-text-secondary">Total Bonos</span>
          <span className="font-display font-semibold text-text-primary">${n(totalBonos)}</span>
        </div>
        
        {/* Detalle de Bonos (desplegable) */}
        {showDetail && (
          <div className="mb-3 ml-4 pl-3 border-l-2 border-gray-300 dark:border-gray-600 space-y-2 animate-slide-up">
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Alimentación</span>
              <span className="font-medium text-text-primary">${n(devolAlimen)} ({r.dias_alim} días)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Territorio</span>
              <span className="font-medium text-text-primary">${n(devTerritorio)} ({r.dias_terr} días)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Casa</span>
              <span className="font-medium text-text-primary">${n(devCasa)} ({r.dias_casa} días)</span>
            </div>
          </div>
        )}
        
        {/* Pago Calculado */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-base font-display font-semibold text-text-primary">Pago Calculado</span>
            <span className="text-lg font-display font-bold text-accent">${n(total)}</span>
          </div>
        </div>
      </div>

      {/* Comentario opcional (solo se muestra cuando hay detalles desplegados) */}
      {showDetail && r.comentario && (
        <div className="mb-4 p-3 bg-accent/10 rounded-xl border border-accent/20 animate-fade-in">
          <p className="text-sm font-medium text-text-secondary mb-1">Comentario</p>
          <p className="text-sm text-text-primary italic">{r.comentario}</p>
        </div>
      )}

      {/* Botón para mostrar/ocultar detalles DENTRO de la sección de montos */}
      <button
        onClick={() => setShowDetail((p) => !p)}
        className="w-full rounded-xl bg-secondary hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-3 text-sm font-medium text-text-primary transition-all duration-200 hover-lift focus:outline-none focus:ring-2 focus:ring-accent/20"
      >
        {showDetail ? (
          <span className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
            Ocultar detalles
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
            Ver detalles de montos
          </span>
        )}
      </button>
    </div>
  );
}

/**
 * Estado vacío - Rediseñado
 */
function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="text-text-secondary mb-4">
        <svg className="h-20 w-20 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
        No tienes registros aún
      </h3>
      <p className="text-text-secondary max-w-md mx-auto">
        Los registros aparecerán aquí automáticamente cuando se carguen en el sistema. 
        Puedes contactar con administración si crees que deberías tener registros visibles.
      </p>
    </div>
  );
}