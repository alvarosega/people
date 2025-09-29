import React, { useEffect, useState, useCallback, useRef } from "react";
import { Head } from "@inertiajs/react"; 
import Tree from "react-d3-tree";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const UserOrganigrama = () => {
  // refs - MANTENIDO
  const treeContainerRef = useRef(null);

  // estados - MANTENIDO con pequeñas mejoras
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 }); // ✅ Añadido para responsive

  // -------------------------
  // Efectos de dimensiones - MEJORADO
  // -------------------------
  useEffect(() => {
    const updateDimensions = () => {
      if (treeContainerRef.current) {
        setDimensions({
          width: treeContainerRef.current.clientWidth,
          height: treeContainerRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // -------------------------
  // Normalización de nodos - MANTENIDO (funcionalidad original)
  // -------------------------
  const normalizeNode = (node) => {
    const name =
      node.name ??
      node.user?.nombre ??
      (node.legajo ? `(${node.legajo})` : "Vacante");

    const title =
      (node.attributes?.puesto ?? node.user?.puesto) ||
      (node.banda ? `Banda ${node.banda}` : "");

    return {
      name,
      title,
      id: node.id,
      legajo: node.legajo ?? null,
      banda: node.banda ?? null,
      nivel_jerarquico: node.nivel_jerarquico ?? 0,
      orden: node.orden ?? 0,
      vacante: !!node.vacante,
      user: node.user ?? null,
      attributes: node.attributes ?? {},
      children: (node.children || []).map(normalizeNode),
      __raw: node,
    };
  };

  // -------------------------
  // Fetch del organigrama - MANTENIDO (funcionalidad original)
  // -------------------------
  const fetchTree = useCallback(async () => {
    setLoading(true);
    try {
      const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");
      if (token) axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
      axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

      const res = await axios.get("/user/organigrama/data");
      const raw = res?.data?.data ?? null;
      if (raw) {
        setTreeData([normalizeNode(raw)]); // un solo root - MANTENIDO
      } else {
        setTreeData([]);
      }
    } catch (err) {
      console.error("Error cargando organigrama:", err);
      alert("No se pudo cargar el organigrama.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  // -------------------------
  // Helpers - MANTENIDO con mejoras
  // -------------------------
  const getTranslate = () => {
    const w = dimensions.width > 0 ? dimensions.width : 800;
    return { x: w / 2, y: 100 }; // ✅ Mejorado para ser responsive
  };

  // -------------------------
  // Render custom de nodos - MEJORADO (misma funcionalidad, mejor diseño)
  // -------------------------
  const renderCustomNode = ({ nodeDatum, toggleNode }) => {
    const nodeColor = nodeDatum.vacante ? "#ff6b6b" : "#2b6cb0";
    const hasChildren = nodeDatum.children && nodeDatum.children.length > 0;

    return (
      <g style={{ cursor: "default" }}>
        {/* Círculo del nodo - MEJORADO visualmente */}
        <circle
          r={10}
          cx={-120}
          cy={-15}
          fill={nodeColor}
          stroke="#fff"
          strokeWidth={2}
          className="transition-all duration-200 hover:r-12"
        />
        
        {/* Contenedor del nodo - MEJORADO visualmente */}
        <foreignObject x={-105} y={-40} width={230} height={80}>
          <div
            className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Header del nodo */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div 
                  className="font-bold text-gray-900 text-sm truncate"
                  style={{ fontSize: '14px', fontWeight: '700' }}
                >
                  {nodeDatum.name || "Vacante"}
                </div>
                <div 
                  className="text-gray-600 text-xs truncate mt-1"
                  style={{ fontSize: '12px' }}
                >
                  {nodeDatum.title || nodeDatum.attributes?.puesto || ""}
                </div>
              </div>
              
              {/* Indicador de nivel */}
              <div 
                className="flex-shrink-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold ml-2"
                style={{ 
                  background: 'linear-gradient(135deg, #f5e003, #e5b611)',
                  color: '#000',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '700'
                }}
              >
                N{nodeDatum.nivel_jerarquico ?? "-"}
              </div>
            </div>

            {/* Información adicional */}
            <div 
              className="text-gray-500 text-xs flex items-center justify-between"
              style={{ fontSize: '10px' }}
            >
              <span>
                {nodeDatum.vacante ? "VACANTE" : nodeDatum.legajo ? `Legajo: ${nodeDatum.legajo}` : "-"}
              </span>
              {hasChildren && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {nodeDatum.children.length} subordinado{nodeDatum.children.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </foreignObject>

        {/* Indicador de hijos colapsables - MANTENIDO funcionalidad */}
        {hasChildren && (
          <circle
            r={6}
            cx={130}
            cy={0}
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth={1}
            onClick={toggleNode}
            style={{ cursor: "pointer" }}
            className="hover:fill-#cbd5e0"
          />
        )}
      </g>
    );
  };

  // -------------------------
  // Render principal - MEJORADO visualmente, MANTENIDO funcionalidad
  // -------------------------
  if (loading) {
    return (
      <AuthenticatedLayout
        header={
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Mi Organigrama
          </h2>
        }
      >
        <Head title="Organigrama" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando organigrama...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
              Mi Organigrama
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Estructura organizacional de tu posición
            </p>
          </div>
          <button
            onClick={fetchTree}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200"
          >
            Actualizar Vista
          </button>
        </div>
      }
    >
      <Head title="Mi Organigrama" />

      <div 
        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 overflow-hidden"
        style={{ height: "calc(100vh - 200px)" }}
      >
        <div
          ref={treeContainerRef}
          className="w-full h-full relative"
        >
          {(!treeData || treeData.length === 0) ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏢</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Organigrama vacío</h2>
                <p className="text-gray-600 mb-4">No se encontró información en tu organigrama.</p>
                <button
                  onClick={fetchTree}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : (
            <Tree
              data={treeData}
              translate={getTranslate()}
              orientation="vertical"
              pathFunc="elbow"
              zoomable
              collapsible
              renderCustomNodeElement={(rd3tProps) => renderCustomNode(rd3tProps)}
              allowForeignObjects
              pathClassFunc={() => "stroke-gray-300 stroke-2"} // ✅ Mejorado
              transitionDuration={300} // ✅ Mejorado
              dimensions={dimensions} // ✅ Mejorado para responsive
            />
          )}
        </div>

        {/* Leyenda de colores - ✅ AÑADIDO (mejora UX) */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-#2b6cb0 rounded-full"></div>
              <span className="text-gray-600">Posición ocupada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-#ff6b6b rounded-full"></div>
              <span className="text-gray-600">Posición vacante</span>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default UserOrganigrama;