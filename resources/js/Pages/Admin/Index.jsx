import { useEffect, useMemo, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function AdminIndex({
  auth,
  registros,
  totalPagos,
  usuariosUnicos,
  promedioPago,
  search,
}) {
  // ---------- Normalizadores ----------
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

  // ---------- Estados ----------
  const [query, setQuery] = useState(search ?? "");
  const [regionFilter, setRegionFilter] = useState("");
  const [anilloFilter, setAnilloFilter] = useState("");
  const [percentMin, setPercentMin] = useState("");
  const [percentMax, setPercentMax] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("nombre");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const preserveOptions = useMemo(
    () => ({ preserveScroll: true, preserveState: true, replace: true }),
    []
  );

  // Aplicar filtros con debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = {};
      
      if (query) params.search = query;
      if (regionFilter) params.region = regionFilter;
      if (anilloFilter) params.anillo = anilloFilter;
      if (percentMin) params.percent_min = percentMin;
      if (percentMax) params.percent_max = percentMax;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      if (sortBy) params.sort_by = sortBy;
      if (sortOrder) params.sort_order = sortOrder;

      router.get(route("admin"), params, preserveOptions);
    }, 500);
    
    return () => clearTimeout(handler);
  }, [
    query, 
    regionFilter, 
    anilloFilter, 
    percentMin, 
    percentMax, 
    dateFrom, 
    dateTo, 
    sortBy, 
    sortOrder
  ]);

  const clearFilters = () => {
    setQuery("");
    setRegionFilter("");
    setAnilloFilter("");
    setPercentMin("");
    setPercentMax("");
    setDateFrom("");
    setDateTo("");
    setSortBy("nombre");
    setSortOrder("asc");
    
    router.get(route("admin"), {}, preserveOptions);
  };

  const openDetailsModal = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  // Función para procesar y ordenar registros
  const processedRecords = useMemo(() => {
    if (!registros?.data) return [];
    
    let records = [...registros.data];
    
    // Ordenar registros
    records.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case "nombre":
          valueA = a.usuario?.nombre || "";
          valueB = b.usuario?.nombre || "";
          break;
        case "porcentaje":
          const factorA = a.pago_porcentaje_decimal !== undefined
            ? parseNumber(a.pago_porcentaje_decimal)
            : normalizePercentFactor(a.pago_porcentaje);
          const factorB = b.pago_porcentaje_decimal !== undefined
            ? parseNumber(b.pago_porcentaje_decimal)
            : normalizePercentFactor(b.pago_porcentaje);
          valueA = factorA * 100;
          valueB = factorB * 100;
          break;
        case "fecha":
          valueA = a.fecha_pago_display || "";
          valueB = b.fecha_pago_display || "";
          break;
        case "monto":
          const factorA2 = a.pago_porcentaje_decimal !== undefined
            ? parseNumber(a.pago_porcentaje_decimal)
            : normalizePercentFactor(a.pago_porcentaje);
          const factorB2 = b.pago_porcentaje_decimal !== undefined
            ? parseNumber(b.pago_porcentaje_decimal)
            : normalizePercentFactor(b.pago_porcentaje);
          
          const variable100A = parseNumber(a.variable_100);
          const devolAlimenA = parseNumber(a.devol_alimen);
          const devTerritorioA = parseNumber(a.dev_territorio);
          const devCasaA = parseNumber(a.dev_casa);
          const totalA = (variable100A * factorA2) + devolAlimenA + devTerritorioA + devCasaA;
          
          const variable100B = parseNumber(b.variable_100);
          const devolAlimenB = parseNumber(b.devol_alimen);
          const devTerritorioB = parseNumber(b.dev_territorio);
          const devCasaB = parseNumber(b.dev_casa);
          const totalB = (variable100B * factorB2) + devolAlimenB + devTerritorioB + devCasaB;
          
          valueA = totalA;
          valueB = totalB;
          break;
        default:
          valueA = a.usuario?.nombre || "";
          valueB = b.usuario?.nombre || "";
      }
      
      if (typeof valueA === 'string') {
        return sortOrder === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      } else {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });
    
    return records;
  }, [registros, sortBy, sortOrder]);

  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Dashboard Admin" />

      <div className="min-h-screen bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Encabezado - Estilo Apple */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-text-primary">
                Bienvenido,&nbsp;
                <span className="text-accent">
                  {auth?.user?.nombre ?? auth?.user?.name ?? "Usuario"}
                </span>
              </h1>
              <p className="mt-2 text-text-secondary">Panel de administración de registros de pagos</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link
                href="/admin/base-llegada/import"
                className="inline-flex items-center rounded-xl bg-accent px-6 py-3 text-black font-semibold transition-all duration-200 hover-lift focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Importar CSV
              </Link>
            </div>
          </div>

          {/* Estadísticas - Rediseñadas */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total Registros" 
              value={nInt(registros?.total)} 
              icon="📊" 
              trend="up"
            />
            <StatCard 
              title="Usuarios Únicos" 
              value={nInt(usuariosUnicos)} 
              icon="👥" 
              trend="neutral"
            />
            <StatCard 
              title="Total Pagos" 
              value={`$${n(totalPagos)}`} 
              icon="💰" 
              trend="up"
            />
            <StatCard 
              title="Promedio Pago" 
              value={`$${n(promedioPago)}`} 
              icon="📈" 
              trend="up"
            />
          </div>

          {/* Panel de Filtros - Estilo Apple */}
          <div className="mb-8 rounded-2xl bg-secondary p-4 sm:p-6 shadow-soft border border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h3 className="text-xl font-display font-semibold text-text-primary mb-2 md:mb-0">
                Filtros y Búsqueda
              </h3>
              <button
                onClick={clearFilters}
                className="flex items-center text-sm text-text-secondary hover:text-accent transition-colors duration-200"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
                Limpiar todos los filtros
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Búsqueda</label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Legajo o nombre..."
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-primary px-4 py-3 text-text-primary placeholder-text-secondary focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Región</label>
                <input
                  type="text"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  placeholder="Filtrar por región..."
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-primary px-4 py-3 text-text-primary placeholder-text-secondary focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Anillo</label>
                <input
                  type="text"
                  value={anilloFilter}
                  onChange={(e) => setAnilloFilter(e.target.value)}
                  placeholder="Filtrar por anillo..."
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-primary px-4 py-3 text-text-primary placeholder-text-secondary focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Ordenar por</label>
                <div className="flex rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 bg-primary">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-4 py-3 bg-transparent text-text-primary focus:outline-none"
                  >
                    <option value="nombre">Nombre</option>
                    <option value="porcentaje">Porcentaje</option>
                    <option value="fecha">Fecha Pago</option>
                    <option value="monto">Monto Total</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-4 bg-secondary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 border-l border-gray-300 dark:border-gray-700"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">% Mínimo</label>
                <input
                  type="number"
                  value={percentMin}
                  onChange={(e) => setPercentMin(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="100"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-primary px-4 py-3 text-text-primary placeholder-text-secondary focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">% Máximo</label>
                <input
                  type="number"
                  value={percentMax}
                  onChange={(e) => setPercentMax(e.target.value)}
                  placeholder="100"
                  min="0"
                  max="100"
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-primary px-4 py-3 text-text-primary placeholder-text-secondary focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Desde</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-primary px-4 py-3 text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Hasta</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-primary px-4 py-3 text-text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Tarjetas de Registros - Rediseñadas */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {processedRecords.length > 0 ? (
              processedRecords.map((r, i) => {
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

                const statusColor =
                  percentDisplay < 100
                    ? "bg-functional-red/10 text-functional-red border-functional-red/20"
                    : Math.abs(percentDisplay - 100) < 0.001
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                    : "bg-functional-green/10 text-functional-green border-functional-green/20";

                return (
                  <div
                    key={r.id ?? i}
                    className="rounded-2xl bg-secondary p-4 sm:p-6 shadow-soft border border-gray-200 dark:border-gray-800 transition-all duration-200 hover-lift"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-display font-semibold text-text-primary truncate mb-1">
                          {r.usuario?.nombre || "N/A"}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
                          <span className="bg-primary px-2 py-1 rounded-lg">Legajo: {r.legajo}</span>
                          <span className="bg-primary px-2 py-1 rounded-lg">Región: {r.usuario?.region || "N/A"}</span>
                          <span className="bg-primary px-2 py-1 rounded-lg">Anillo: {r.anillo ?? "-"}</span>
                        </div>
                        <p className="text-sm text-text-secondary mt-2">
                          <span className="font-medium">Período:</span> {r.fecha_display}
                        </p>
                      </div>

                      {/* Estado / Porcentaje */}
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
                          {n(percentDisplay)}%
                        </span>
                        <button
                          onClick={() => router.get(route("admin.base-llegada.edit", r.id))}
                          className="text-text-secondary hover:text-accent transition-colors duration-200"
                          title="Editar registro"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              strokeWidth={1.5} 
                              stroke="currentColor" 
                              className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687 1.687-9.193 9.193-3.32.368.368-3.32 9.193-9.193z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.125 2.25a1.5 1.5 0 012.121 2.121l-1.687 1.687-2.121-2.121L19.125 2.25z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Resumen financiero */}
                    <div className="mb-4 p-4 bg-primary rounded-xl">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-text-secondary">Pago calculado:</span>
                        <span className="text-xl font-display font-bold text-text-primary">${n(total)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-text-secondary">Alcanzado:</span>
                          <span className="block font-medium text-text-primary">${n(alcanzado)}</span>
                        </div>
                        <div>
                          <span className="text-text-secondary">Bonos:</span>
                          <span className="block font-medium text-text-primary">${n(totalBonos)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-secondary">
                        {r.fecha_pago_display}
                      </span>
                      <button
                        onClick={() => openDetailsModal(r)}
                        className="text-sm text-accent hover:text-abinbev-gold font-medium transition-colors duration-200"
                      >
                        Ver detalles →
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center">
                <div className="text-text-secondary mb-4">
                  <svg className="h-20 w-20 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg text-text-secondary">
                  {query || regionFilter || anilloFilter || percentMin || percentMax || dateFrom || dateTo
                    ? "No se encontraron registros con los filtros aplicados"
                    : "No hay registros en el sistema"}
                </p>
                {(query || regionFilter || anilloFilter || percentMin || percentMax || dateFrom || dateTo) && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-accent hover:text-abinbev-gold font-medium transition-colors duration-200"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Paginación - Rediseñada */}
          {registros?.links?.length > 3 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex flex-wrap items-center justify-center gap-2">
                {registros.links.map((link, i) => (
                  <button
                    key={i}
                    disabled={!link.url}
                    onClick={() => link.url && router.get(link.url, {}, preserveOptions)}
                    className={`min-h-[44px] min-w-[44px] flex justify-center items-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      link.active
                        ? "bg-accent text-black shadow-glow"
                        : "text-text-secondary hover:bg-secondary hover:text-text-primary"
                    } ${!link.url ? "opacity-30 cursor-not-allowed" : "hover-lift"}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles - Rediseñado */}
      {showModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-secondary rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-dark-float p-4 sm:p-6">
                <button
                  onClick={closeModal}
                  className="text-text-secondary hover:text-text-primary transition-colors duration-200 p-2 rounded-xl hover:bg-primary"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              <DetailModalContent record={selectedRecord} parseNumber={parseNumber} normalizePercentFactor={normalizePercentFactor} n={n} />
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}

// Componente para el contenido del modal de detalles - Rediseñado
function DetailModalContent({ record, parseNumber, normalizePercentFactor, n }) {
  const factor =
    record.pago_porcentaje_decimal !== undefined
      ? parseNumber(record.pago_porcentaje_decimal)
      : normalizePercentFactor(record.pago_porcentaje);

  const percentDisplay = factor * 100;

  const variable100 = parseNumber(record.variable_100);
  const devolAlimen = parseNumber(record.devol_alimen);
  const devTerritorio = parseNumber(record.dev_territorio);
  const devCasa = parseNumber(record.dev_casa);

  const alcanzado = variable100 * factor;
  const totalBonos = devolAlimen + devTerritorio + devCasa;
  const total = alcanzado + totalBonos;

  return (
    <div className="space-y-6">
      {/* Detalles de porcentaje y montos */}
      <div>
        <div className="bg-primary p-5 rounded-2xl">
          <div className="mb-6 text-center">
            <p className="text-sm text-text-secondary mb-1">Porcentaje de pago</p>
            <p className="text-3xl font-display font-bold text-accent">{n(percentDisplay)}%</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-text-secondary">Meta al 100%</span>
              <span className="font-display font-semibold text-text-primary">${n(variable100)}</span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-text-secondary">Alcanzado</span>
              <span className="font-display font-semibold text-text-primary">${n(alcanzado)}</span>
            </div>
            
            <div>
              <p className="text-text-secondary mb-3">Bonos</p>
              <div className="space-y-2 pl-4">
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Alimentación:</span>
                  <span className="font-medium text-text-primary">${n(devolAlimen)} ({record.dias_alim} días)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Territorio:</span>
                  <span className="font-medium text-text-primary">${n(devTerritorio)} ({record.dias_terr} días)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Casa:</span>
                  <span className="font-medium text-text-primary">${n(devCasa)} ({record.dias_casa} días)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                  <span className="font-medium text-text-primary">Total bonos:</span>
                  <span className="font-display font-semibold text-text-primary">${n(totalBonos)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-lg font-display font-semibold text-text-primary">Pago calculado</span>
              <span className="text-2xl font-display font-bold text-accent">${n(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comentario */}
      {record.comentario && (
        <div>
          <h4 className="text-lg font-display font-semibold text-text-primary mb-3">Comentario</h4>
          <p className="text-text-primary bg-accent/10 p-4 rounded-2xl border border-accent/20">{record.comentario}</p>
        </div>
      )}
    </div>
  );
}

// Componente de tarjeta de estadística - Rediseñado
function StatCard({ title, value, icon, trend }) {
  const trendColors = {
    up: "text-functional-green",
    down: "text-functional-red", 
    neutral: "text-text-secondary"
  };

  const trendIcons = {
    up: "↗",
    down: "↘",
    neutral: "→"
  };

  return (
    <div className="rounded-2xl bg-secondary p-4 sm:p-6 shadow-soft border border-gray-200 dark:border-gray-800 transition-all duration-200 hover-lift">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-1">{title}</p>
          <p className="text-2xl font-display font-bold text-text-primary">{value}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl block mb-1">{icon}</span>
          <span className={`text-xs font-semibold ${trendColors[trend]}`}>
            {trendIcons[trend]}
          </span>
        </div>
      </div>
    </div>
  );
}