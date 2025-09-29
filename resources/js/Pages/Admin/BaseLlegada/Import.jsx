import { useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ImportPage({ auth }) {
  const [previewRows, setPreviewRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [serverErrors, setServerErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPreviewRows([]);
    setServerErrors({});
    setSuccessMessage("");
  };

  const handlePreview = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const { data } = await axios.post(
        "/admin/base-llegada/import/preview",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setPreviewRows(data.rows || []);
    } catch (e) {
      console.error(e);
      setServerErrors({ general: "Error al previsualizar el archivo." });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    // ✅ Filtramos solo filas SIN errores y enviamos TODOS los campos
    const validRows = previewRows
      .filter((r) => !r.errors || r.errors.length === 0)
      .map((r) => ({
        // Campos requeridos
        fecha: r.data.fecha,
        legajo: r.data.legajo,
        
        // Campos opcionales con todos los nombres correctos
        fecha_pago: r.data.fecha_pago ?? null,
        variable_100: r.data.variable_100 ?? null,
        pago_porcentaje: r.data.pago_porcentaje ?? null,
        
        // Campos de devoluciones
        devol_alimen: r.data.devol_alimen ?? null,
        dias_alim: r.data.dias_alim ?? null,
        
        dev_territorio: r.data.dev_territorio ?? null,
        dias_terr: r.data.dias_terr ?? null,
        
        dev_casa: r.data.dev_casa ?? null,
        dias_casa: r.data.dias_casa ?? null,
        
        // Otros campos
        anillo: r.data.anillo ?? null,
        comentario: r.data.comentario ?? null,
      }));

    if (validRows.length === 0) {
      alert("No hay filas válidas para importar ❌");
      return;
    }

    console.log("Enviando datos:", validRows); // Para debugging

    setLoading(true);
    try {
      const response = await axios.post("/admin/base-llegada/import/store", {
        rows: validRows,
      });
      
      setSuccessMessage(response.data.message || "Importación completada 🚀");
      setPreviewRows([]);
      setFile(null);
      
      // Mostrar detalles si hay errores parciales
      if (response.data.errors && response.data.errors.length > 0) {
        console.warn("Errores durante la importación:", response.data.errors);
      }
      
    } catch (e) {
      console.error("Error completo:", e.response?.data || e);
      
      const errorMsg = e.response?.data?.message || "Error al confirmar importación";
      alert(`Error: ${errorMsg}`);
      
      // Mostrar errores de validación si existen
      if (e.response?.data?.errors) {
        console.error("Errores de validación:", e.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800">
          Importar Base de Llegada
        </h2>
      }
    >
      <div className="p-6">
        {/* Selector de archivo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar archivo CSV o Excel
          </label>
          <input 
            type="file" 
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handlePreview}
            disabled={!file || loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Procesando..." : "Previsualizar"}
          </button>

          {previewRows.length > 0 && (
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Importando..." : "Confirmar Importación"}
            </button>
          )}
        </div>

        {/* Mensajes */}
        {serverErrors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {serverErrors.general}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* Resumen de preview */}
        {previewRows.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <strong>Resumen:</strong> {previewRows.length} filas encontradas, {' '}
              {previewRows.filter(r => !r.errors || r.errors.length === 0).length} válidas, {' '}
              {previewRows.filter(r => r.errors && r.errors.length > 0).length} con errores
            </p>
          </div>
        )}

        {/* Tabla de preview */}
        {previewRows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
              <thead>
                <tr>
                  {Object.keys(previewRows[0].data).map((col, i) => (
                    <th
                      key={i}
                      className="border px-2 py-1 bg-gray-100 text-left font-medium"
                    >
                      {col}
                    </th>
                  ))}
                  <th className="border px-2 py-1 bg-gray-100 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, i) => (
                  <tr
                    key={i}
                    className={
                      row.errors && row.errors.length > 0 ? "bg-red-50" : "bg-white"
                    }
                  >
                    {Object.values(row.data).map((val, j) => (
                      <td key={j} className="border px-2 py-1">
                        {val ?? ""}
                      </td>
                    ))}
                    <td className="border px-2 py-1">
                      {row.errors && row.errors.length > 0 ? (
                        <span className="text-red-600 text-xs">
                          ❌ {row.errors.join(", ")}
                        </span>
                      ) : (
                        <span className="text-green-600">✅ Válida</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}