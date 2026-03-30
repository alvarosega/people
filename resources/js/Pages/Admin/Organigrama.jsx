import React, { useEffect, useState, useCallback, useRef } from "react";
import { Head } from "@inertiajs/react"; // si usas Inertia (lo tenías antes)
import Tree from "react-d3-tree";
import axios from "axios";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Organigrama = () => {
  // refs
  const treeContainerRef = useRef(null);
  

  // estados
  const [treeData, setTreeData] = useState([]); // array de raíces (transformada)
  const [rawTree, setRawTree] = useState([]); // data cruda tal como la devuelve el backend
  const [users, setUsers] = useState([]); // lista de usuarios para selects
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null); // nodo seleccionado (objeto que recibe react-d3-tree)
  const [creatingRoot, setCreatingRoot] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // ← Nuevo estado para controlar modal


  // formularios
  const [rootForm, setRootForm] = useState({
    legajo: "",
    banda: "",
    nivel_jerarquico: 0,
    vacante: false,
  });

  const [editForm, setEditForm] = useState({
    legajo: "",
    banda: "",
    nivel_jerarquico: 0,
    vacante: false,
  });

  const [childForm, setChildForm] = useState({
    legajo: "",
    banda: "",
    nivel_jerarquico: 1,
    orden: 0,
    vacante: true,
  });

  // -------------------------
  // Util: normalizar/transformar
  // -------------------------
  // Aseguramos que cada nodo tenga 'name' y children correctamente,
  // y mantenemos las propiedades originales (id, legajo, banda, nivel_jerarquico, vacante, user, etc.)
  const normalizeNode = (node) => {
    const name =
      node.name ??
      node.user?.nombre ??
      (node.legajo ? `(${node.legajo})` : "Vacante");

    // título / subtítulo para mostrar
    const titleParts = [];
    if (node.user?.puesto) titleParts.push(node.user.puesto);
    if (node.user?.territorio) titleParts.push(node.user.territorio);
    if (node.user?.region) titleParts.push(node.user.region);
    if (node.banda) titleParts.push(`Banda ${node.banda}`);
    
    const title = titleParts.join(' • ');

    return {
      // campos requeridos por rd3
      name,
      title,
      // copiar campos importantes para edición
      id: node.id,
      legajo: node.legajo ?? null,
      banda: node.banda ?? null,
      nivel_jerarquico: node.nivel_jerarquico ?? 0,
      orden: node.orden ?? 0,
      vacante: !!node.vacante,
      user: node.user ?? null,
      attributes: node.attributes ?? {},
      // hijos recursivos
      children: (node.children || []).map(normalizeNode),
      // además guardamos la 'raw' por si algo requiere el original
      __raw: node,
    };
  };

  // -------------------------
  // Fetch: árbol + usuarios
  // -------------------------
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      // CSRF header (si no lo seteaste globalmente)
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
      if (token) axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
      axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

      const [treeRes, usersRes] = await Promise.all([
        axios.get("/admin/organigrama/data"),
        axios.get("/admin/organigrama/users-list"),
      ]);

      const raw = (treeRes?.data?.data) ?? [];
      const normalized = raw.map(normalizeNode);

      setRawTree(raw);
      setTreeData(normalized);
      setUsers((usersRes?.data?.data) ?? []);
    } catch (err) {
      console.error("fetchAll error:", err);
      alert("Error cargando datos. Revisa consola / network.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchAll(); // ya incluye organigrama + usuarios
  }, [fetchAll]);
  // -------------------------
  // Helpers: translate center
  // -------------------------
  const getTranslate = () => {
    const w = treeContainerRef.current?.clientWidth ?? 800;
    return { x: w / 2, y: 80 };
  };

  // -------------------------
  // Operaciones CRUD
  // -------------------------
  // Crear raíz
  const createRoot = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        legajo: rootForm.legajo || null,
        banda: rootForm.banda || null,
        nivel_jerarquico: Number(rootForm.nivel_jerarquico || 0),
        orden: 0,
        parent_id: null,
        vacante: !!rootForm.vacante,
      };
      await axios.post("/admin/organigrama", payload);
      setCreatingRoot(false);
      setRootForm({ legajo: "", banda: "", nivel_jerarquico: 0, vacante: false });
      await fetchAll();
    } catch (err) {
      console.error("createRoot error:", err);
      alert("Error creando nodo raíz. Revisa consola.");
    }
  };

  // Actualizar nodo seleccionado
  const updateNode = async (e) => {
    e.preventDefault();
    if (!selectedNode) return alert("No hay nodo seleccionado.");
    try {
      const payload = {
        legajo: editForm.vacante ? null : (editForm.legajo || null),
        banda: editForm.banda || null,
        nivel_jerarquico: Number(editForm.nivel_jerarquico || 0),
        orden: Number(editForm.orden || 0),
        vacante: !!editForm.vacante,
      };
      await axios.put(`/admin/organigrama/${selectedNode.id}`, payload);
      setSelectedNode(null);
      setIsModalOpen(false);
      await fetchAll();
      setIsModalOpen(false);
    } catch (err) {
      console.error("updateNode error:", err);
      alert("Error actualizando nodo.");
    }
  };

  // Eliminar nodo seleccionado (y su subárbol)
  const deleteNode = async () => {
    if (!selectedNode) return alert("No hay nodo seleccionado.");
    if (!confirm("¿Eliminar este nodo y todos sus hijos?")) return;
    try {
      await axios.delete(`/admin/organigrama/${selectedNode.id}`);
      setSelectedNode(null);
      await fetchAll();
    } catch (err) {
      console.error("deleteNode error:", err);
      alert("Error eliminando nodo.");
    }
  };

  // Crear hijo del nodo seleccionado
  const createChild = async (e) => {
    e.preventDefault();
    if (!selectedNode) return alert("Selecciona un nodo padre primero.");
    try {
      const payload = {
        parent_id: selectedNode.id,
        legajo: childForm.vacante ? null : (childForm.legajo || null),
        banda: childForm.banda || null,
        nivel_jerarquico: Number(childForm.nivel_jerarquico || 0),
        orden: Number(childForm.orden || 0),
        vacante: !!childForm.vacante,
      };
      await axios.post("/admin/organigrama", payload);
      // reset child form (nivel por defecto +1 del padre)
      setChildForm({
        legajo: "",
        banda: "",
        nivel_jerarquico: (selectedNode.nivel_jerarquico || 0) + 1,
        orden: 0,
        vacante: true,
      });
      await fetchAll();
    } catch (err) {
      console.error("createChild error:", err);
      alert("Error creando hijo.");
    }
  };

  // -------------------------
  // Interacción con el árbol
  // -------------------------
  // Cuando se hace click en un nodo del árbol
  const handleNodeClick = (nodeDatum, evt) => {
    // nodeDatum ya es el nodo transformado (normalizeNode)
    setSelectedNode(nodeDatum);
    setIsModalOpen(true); // Abrir modal al hacer click

    // precargar formulario de edición
    setEditForm({
      legajo: nodeDatum.legajo ?? "",
      banda: nodeDatum.banda ?? "",
      nivel_jerarquico: nodeDatum.nivel_jerarquico ?? 0,
      orden: nodeDatum.orden ?? 0,
      vacante: !!nodeDatum.vacante,
    });

    // precargar childForm para crear hijo con nivel+1
    setChildForm({
      legajo: "",
      banda: "",
      nivel_jerarquico: (nodeDatum.nivel_jerarquico ?? 0) + 1,
      orden: 0,
      vacante: true,
    });
  };

  // -------------------------
  // Render del nodo custom (con click encaminado)
  // -------------------------
  const renderCustomNode = ({ nodeDatum, toggleNode }) => {
    // usamos onClick en el <g> para asegurar selección incluso con foreignObject
    return (
      <g onClick={(evt) => handleNodeClick(nodeDatum, evt)} style={{ cursor: "pointer" }}>
        {/* marcador (círculo) */}
        <circle r={8} cx={-110} cy={-18} fill={nodeDatum.vacante ? "#ff6b6b" : "#2b6cb0"} />
        {/* foreignObject para contenido (texto) */}
        <foreignObject x={-100} y={-35} width={220} height={70}>
        <div
          className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl p-3 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            padding: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            pointerEvents: "none"
          }}
        >

            <div style={{ fontWeight: 700, fontSize: 13 }}>
              {nodeDatum.name || "Vacante"}
            </div>
            <div style={{ fontSize: 11, color: "#666" }}>
              {nodeDatum.title || (nodeDatum.attributes?.puesto ?? "")}
            </div>
            <div style={{ fontSize: 10, color: "#999", marginTop: 4 }}>
              {`Nivel ${nodeDatum.nivel_jerarquico ?? "-"} • ${nodeDatum.vacante ? "VACANTE" : (nodeDatum.legajo ?? "-")}`}
            </div>
          </div>
        </foreignObject>
      </g>
    );
  };

  // -------------------------
  // Render general
  // -------------------------
  
  if (loading) return <div className="p-6">Cargando organigrama...</div>;
  return (
    <AuthenticatedLayout
    header={
      <h2 className="font-semibold text-xl text-gray-800 leading-tight">
        Organigrama
      </h2>
    }
  >
    <Head title="Organigrama" />
    <div className="flex flex-col h-screen">
      {/* Árbol con estilo visual similar a UserOrganigrama */}
      <div
        ref={treeContainerRef}
        className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 overflow-hidden relative"
        style={{ height: "calc(100vh - 200px)" }}
      >

            <div className="w-full h-full flex">
          {(!treeData || treeData.length === 0) ? (
            // Si no hay nodos: UI para crear raíz
            <div className="flex items-center justify-center h-full">
              {!creatingRoot ? (
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Organigrama vacío</h2>
                  <p className="text-gray-600 mb-4">No hay nodos creados todavía. Crea el nodo raíz para comenzar.</p>


                  <div className="flex gap-2">
                    <button
                      onClick={() => setCreatingRoot(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >Crear nodo raíz</button>

                    <button
                      onClick={async () => {
                        if (!confirm("Crear nodos desde todos los users que no tengan?")) return;
                        try {
                          await axios.post("/admin/organigrama/generate-from-users");
                          await fetchAll();
                        } catch (err) {
                          console.error(err);
                          alert("Error generando desde users.");
                        }
                      }}
                      className="px-4 py-2 border rounded"
                    >Generar desde users</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={createRoot} className="bg-white p-4 rounded shadow max-w-md">
                  <h3 className="font-bold mb-2">Crear nodo raíz</h3>

                  <div>
                    <label className="block text-sm">Asignar usuario (opcional)</label>
                    <select
                        value={rootForm.legajo}
                        onChange={(e) =>
                          setRootForm({ ...rootForm, legajo: e.target.value })
                        }
                        className="border rounded p-1 w-full"
                      >
                        <option value="">-- Vacante --</option>
                        {users.map((u) => (
                          <option key={u.legajo} value={u.legajo}>
                            {u.legajo} - {u.nombre}
                          </option>
                        ))}
                      </select>

                  </div>


                  <label className="block text-sm">Banda</label>
                  <input
                    value={rootForm.banda}
                    onChange={(e) => setRootForm({ ...rootForm, banda: e.target.value })}
                    className="border p-2 rounded w-full mb-2"
                  />

                  <label className="block text-sm">Nivel jerárquico</label>
                  <input
                    type="number"
                    value={rootForm.nivel_jerarquico}
                    onChange={(e) => setRootForm({ ...rootForm, nivel_jerarquico: Number(e.target.value) })}
                    className="border p-2 rounded w-full mb-2"
                  />

                  <label className="inline-flex items-center mb-3">
                    <input
                      checked={rootForm.vacante}
                      onChange={(e) => setRootForm({ ...rootForm, vacante: e.target.checked })}
                      type="checkbox"
                      className="mr-2"
                    />
                    Vacante
                  </label>

                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Guardar raíz</button>
                    <button type="button" onClick={() => setCreatingRoot(false)} className="px-4 py-2 border rounded">Cancelar</button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            // Si hay data: mostrar árbol
            <div className="w-full h-full overflow-auto">
            <Tree
              data={treeData}
              translate={getTranslate()}
              orientation="vertical"
              pathFunc="elbow"
              zoomable
              collapsible
              onNodeClick={(nodeDatum, evt) => handleNodeClick(nodeDatum, evt)}
              renderCustomNodeElement={(rd3tProps) => renderCustomNode(rd3tProps)}
              allowForeignObjects
              nodeSize={{ x: 260, y: 140 }}   // controla el tamaño de "celdas" de cada nodo
              separation={{ siblings: 1, nonSiblings: 1 }} 
            />
          </div>
          )}
        </div>
      </div>


      {/* Modal para detalles del nodo */}
      {isModalOpen && selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl w-11/12 sm:w-96 max-h-[90vh] p-6 shadow-xl relative overflow-auto border border-gray-200">


            {/* Botón cerrar */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold mb-3">Detalles</h3>

            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">ID: {selectedNode.id}</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{selectedNode.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{selectedNode.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Legajo: {selectedNode.legajo ?? '-'}</div>
              </div>

              {/* Formulario de edición */}
              <form onSubmit={updateNode} className="border-t pt-2 space-y-2">
                <h4 className="font-medium">Editar / Asignar usuario</h4>

                <label className="block text-xs">Asignar usuario</label>
                <select
                  value={editForm.legajo}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      legajo: e.target.value,
                      vacante: !e.target.value,
                    })
                  }
                  className="border p-2 rounded w-full"
                >
                <option value="">-- Dejar vacante --</option>
                {[selectedNode.user, ...users].filter(Boolean).map((u) => (
                  <option key={u.legajo} value={u.legajo}>
                    {u.nombre} ({u.legajo})
                  </option>
                ))}
              </select>

                <label className="block text-xs">Banda</label>
                <input
                  className="border p-2 rounded w-full"
                  value={editForm.banda}
                  onChange={(e) => setEditForm({ ...editForm, banda: e.target.value })}
                />

                <label className="block text-xs">Nivel</label>
                <input
                  type="number"
                  className="border p-2 rounded w-full"
                  value={editForm.nivel_jerarquico}
                  onChange={(e) => setEditForm({ ...editForm, nivel_jerarquico: Number(e.target.value) })}
                />

                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={editForm.vacante}
                    onChange={(e) => setEditForm({ ...editForm, vacante: e.target.checked })}
                  />
                  Vacante
                </label>

                <div className="flex gap-2 mt-2">
                  <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Guardar</button>
                  <button type="button" onClick={deleteNode} className="px-3 py-1 bg-red-600 text-white rounded">Eliminar</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1 border rounded">Cerrar</button>
                </div>
              </form>

              {/* Crear hijo */}
              <div className="border-t pt-2">
                <h4 className="font-medium">Crear hijo</h4>

                <label className="block text-xs mt-2">Asignar usuario</label>
                <select
                  value={childForm.legajo}
                  onChange={(e) => setChildForm({ ...childForm, legajo: e.target.value })}
                  className="border p-2 rounded w-full"
                >
                  <option value="">-- Vacante --</option>
                  {users.map(u => <option key={u.legajo} value={u.legajo}>{u.nombre} ({u.legajo})</option>)}
                </select>

                <label className="block text-xs mt-2">Banda</label>
                <input
                  className="border p-2 rounded w-full"
                  value={childForm.banda}
                  onChange={(e) => setChildForm({ ...childForm, banda: e.target.value })}
                />

                <label className="block text-xs mt-2">Nivel</label>
                <input
                  type="number"
                  className="border p-2 rounded w-full"
                  value={childForm.nivel_jerarquico}
                  onChange={(e) => setChildForm({ ...childForm, nivel_jerarquico: Number(e.target.value) })}
                />

                <label className="inline-flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={childForm.vacante}
                    onChange={(e) => setChildForm({ ...childForm, vacante: e.target.checked })}
                  />
                  Vacante
                </label>

                <div className="mt-3">
                  <button onClick={createChild} className="px-3 py-1 bg-blue-600 text-white rounded">Crear hijo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
    </AuthenticatedLayout>
  );



};

export default Organigrama;
