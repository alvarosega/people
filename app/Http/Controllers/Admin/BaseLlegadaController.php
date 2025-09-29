<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BaseLlegada;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\BaseLlegadaRawImport;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;


class BaseLlegadaController extends Controller
{
    /**
     * Listado principal de registros
     */
    public function index()
    {
        $user = Auth::user();
        if ($user->rol !== 'admin') {
            return redirect()->route('user');
        }

        $registros = BaseLlegada::orderBy('fecha', 'desc')
            ->orderBy('legajo', 'asc')
            ->get();

        return Inertia::render('Admin/BaseLlegada/Index', [
            'registros' => $registros->isEmpty() ? [] : $registros->toArray()
        ]);
    }
    public function edit($id)
    {
        $registro = BaseLlegada::with('usuario')->findOrFail($id);
    
        return Inertia::render('Admin/EditRegistro', [
            'registro' => $registro,
        ]);
    }
    
    public function update(Request $request, $id)
    {
        $registro = BaseLlegada::findOrFail($id);
    
        $data = $request->validate([
            'variable_100'   => 'numeric|nullable',
            'devol_alimen'   => 'numeric|nullable',
            'dev_territorio' => 'numeric|nullable',
            'dev_casa'       => 'numeric|nullable',
            'comentario'     => 'nullable|string',
        ]);
    
        $registro->update($data);
    
        return redirect()
            ->route('admin') // 👈 usa el nombre de la ruta de listado
            ->with('success', 'Registro actualizado correctamente.');
    }

    /**
     * Descargar plantilla CSV con encabezados correctos
     */
    public function downloadTemplate()
    {
        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="plantilla_base_llegada.csv"',
        ];

        $callback = function () {
            $out = fopen('php://output', 'w');
            // BOM UTF-8
            fwrite($out, chr(0xEF) . chr(0xBB) . chr(0xBF));
            // Encabezados correctos según la tabla
            fputcsv($out, [
                'fecha','fecha_pago','legajo','variable_100','pago_porcentaje',
                'devol_alimen','dias_alim',
                'dev_territorio','dias_terr',
                'dev_casa','dias_casa',
                'anillo','comentario'
            ]);
            
            fputcsv($out, [
                '03-2025','2025-03-15','12345','3000','25',
                '5000','10',
                '1500','5',
                '800','2',
                'A1','opcional'
            ]);
            
            fclose($out);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Previsualizar archivo subido
     */
    public function uploadPreview(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,csv,txt'],
        ]);

        $file = $request->file('file');

        $collections = Excel::toCollection(new BaseLlegadaRawImport, $file);
        if ($collections->isEmpty()) {
            return response()->json(['rows' => []]);
        }

        $sheet = $collections->first();
        if ($sheet->isEmpty()) {
            return response()->json(['rows' => []]);
        }

        $rows = [];
        foreach ($sheet as $idx => $row) {
            // 🔑 Normalizamos claves (si vienen como 0,1,2…)
            $normalizedRow = $this->normalizeKeys($row->toArray());

            [$data, $errors] = $this->validateAndNormalizeRow($normalizedRow, $idx + 2);

            $rows[] = [
                'data'   => $data,
                'errors' => $errors,
            ];
        }

        return response()->json(['rows' => $rows]);
    }

    /**
     * Confirmar y guardar filas en DB
     */
    public function storeImported(Request $request)
    {
        try {
            // Log detallado del request
            Log::info('=== INICIO IMPORTACIÓN ===');
            Log::info('Request method: ' . $request->method());
            Log::info('Request all data:', $request->all());
            
            $inputRows = $request->input('rows', []);
            Log::info('Rows recibidas:', ['count' => count($inputRows), 'data' => $inputRows]);

            // Validación básica primero
            if (empty($inputRows) || !is_array($inputRows)) {
                Log::error('No se recibieron filas válidas');
                return response()->json([
                    'message' => 'No se recibieron datos válidos para importar',
                    'success' => false
                ], 400);
            }

            $savedCount = 0;
            $errors = [];
            
            foreach ($inputRows as $index => $row) {
                Log::info("=== PROCESANDO FILA {$index} ===", $row);

                try {
                    // Validar campos requeridos
                    if (empty($row['fecha'])) {
                        $errors[] = "Fila {$index}: fecha es requerida";
                        continue;
                    }
                    
                    if (empty($row['legajo'])) {
                        $errors[] = "Fila {$index}: legajo es requerido";
                        continue;
                    }

                    // Procesar fechas
                    $fecha = $this->procesarPeriodo($row['fecha'] ?? null);
                    $fechaPago = !empty($row['fecha_pago']) 
                        ? $this->procesarFechaPago($row['fecha_pago']) 
                        : null;
                    

                    Log::info("Fechas procesadas", ['fecha' => $fecha, 'fecha_pago' => $fechaPago]);

                    // Preparar datos para inserción
                    $dataToInsert = [
                        'fecha'           => $fecha,
                        'fecha_pago'      => $fechaPago,
                        'legajo'          => $row['legajo'],
                        'variable_100'    => $this->parseNumber($row['variable_100'] ?? null),
                        'pago_porcentaje' => $this->parsePercentToDecimal($row['pago_porcentaje'] ?? null),
                        'devol_alimen'    => $this->parseNumber($row['devol_alimen'] ?? null),
                        'dias_alim'       => $this->parseNumber($row['dias_alim'] ?? null),
                        'dev_territorio'  => $this->parseNumber($row['dev_territorio'] ?? null),
                        'dias_terr'       => $this->parseNumber($row['dias_terr'] ?? null),
                        'dev_casa'        => $this->parseNumber($row['dev_casa'] ?? null),
                        'dias_casa'       => $this->parseNumber($row['dias_casa'] ?? null),
                        'anillo'          => $row['anillo'] ?? null,
                        'comentario'      => $row['comentario'] ?? null,
                    ];

                    Log::info("Datos preparados para inserción:", $dataToInsert);

                    // Crear el registro
                    $registro = BaseLlegada::create($dataToInsert);
                    
                    Log::info("✅ Registro creado exitosamente", ['id' => $registro->id]);
                    $savedCount++;

                } catch (\Exception $rowError) {
                    Log::error("❌ Error en fila {$index}", [
                        'error' => $rowError->getMessage(),
                        'file' => $rowError->getFile(),
                        'line' => $rowError->getLine()
                    ]);
                    $errors[] = "Fila {$index}: " . $rowError->getMessage();
                }
            }

            Log::info('=== RESULTADO FINAL ===', [
                'saved_count' => $savedCount,
                'errors_count' => count($errors),
                'errors' => $errors
            ]);
            
            if ($savedCount > 0) {
                return response()->json([
                    'message' => "Importación completada: {$savedCount} registros guardados" . 
                                (count($errors) > 0 ? " (con " . count($errors) . " errores)" : ""),
                    'success' => true,
                    'saved_count' => $savedCount,
                    'errors' => $errors
                ]);
            } else {
                return response()->json([
                    'message' => 'No se pudo importar ningún registro',
                    'success' => false,
                    'errors' => $errors
                ], 400);
            }
            
        } catch (\Exception $e) {
            Log::error('💥 ERROR CRÍTICO EN IMPORTACIÓN', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Error interno del servidor: ' . $e->getMessage(),
                'success' => false,
                'debug' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ], 500);
        }
    }
    // Para fecha (periodo)
    private function procesarPeriodo($valor)
    {
        if (empty($valor)) return null;
    
        try {
            return Carbon::createFromFormat('m-Y', $valor)->format('m-Y');
        } catch (\Exception $e) {
            return null;
        }
    }
    
    // Para fecha_pago
    private function procesarFechaPago($valor)
    {
        if (empty($valor)) return null;
        return Carbon::parse($valor)->format('d-m-Y');
    }

    // ---------------------- Helpers ----------------------

    /**
     * Validar y normalizar fila de Excel/CSV
     */
    private function validateAndNormalizeRow(array $row, int $rowNumber)
    {
        $errors = [];
        $data = $row;

        // ✅ Fecha en formato m-YYYY
        $fecha = $row['fecha'] ?? null;
        if ($fecha !== null) {
            $parsed = null;
            $dt = \DateTime::createFromFormat('m-Y', $fecha);
            if ($dt !== false) {
                $parsed = $dt->format('m-Y');
            }
            if ($parsed === null && is_numeric($fecha)) {
                try {
                    $dt = ExcelDate::excelToDateTimeObject($fecha);
                    $parsed = $dt->format('m-Y');
                } catch (\Exception $e) {}
            }
            if ($parsed === null) {
                $errors[] = "Fila {$rowNumber}: fecha inválida (formato m-YYYY).";
            } else {
                $data['fecha'] = $parsed;
            }
        }

        // ✅ Fecha pago
        if (!empty($row['fecha_pago'])) {
            $data['fecha_pago'] = $this->procesarFechaPago($row['fecha_pago']);
        }

        // ✅ Pago porcentaje
        $data['pago_porcentaje'] = $this->parsePercentToDecimal($row['pago_porcentaje'] ?? null);

        // ✅ Campos numéricos: devol_alimen, variable_100, dev_territorio, dev_casa
        foreach (['devol_alimen','variable_100','dev_territorio','dev_casa'] as $campo) {
            $val = $this->parseNumber($row[$campo] ?? null);
            if ($val === null && isset($row[$campo]) && $row[$campo] !== '') {
                $errors[] = "Fila {$rowNumber}: {$campo} inválido.";
            } else {
                $data[$campo] = $val;
            }
        }

        // ✅ Días (enteros)
        foreach (['dias_alim','dias_terr','dias_casa'] as $campo) {
            if (isset($row[$campo]) && $row[$campo] !== '') {
                if (!ctype_digit((string)$row[$campo])) {
                    $errors[] = "Fila {$rowNumber}: {$campo} debe ser un número entero.";
                } else {
                    $data[$campo] = (int) $row[$campo];
                }
            }
        }

        return [$data, $errors];
    }

    private function parsePercentToDecimal($value)
    {
        if ($value === null || $value === '') {
            return null;
        }
    
        // Eliminar espacios y símbolo de porcentaje
        $s = str_replace(['%', ' '], '', (string)$value);
    
        // Normalizar separador decimal
        $s = str_replace('.', '', $s);   // quita miles con punto
        $s = str_replace(',', '.', $s); // convierte coma en decimal
    
        if (!is_numeric($s)) {
            return null;
        }
    
        $n = (float) $s;
        // Si es 25 => 0.25 | Si es 0.25 => 0.25
        return $n > 1 ? $n / 100 : $n;
    }
    
    private function parseNumber($value)
    {
        if ($value === null || $value === '') {
            return null;
        }
    
        $s = (string)$value;
    
        // Caso 1: número con coma decimal (ej: 1.234,56)
        if (preg_match('/\d+,\d{1,2}$/', $s)) {
            $s = str_replace('.', '', $s); // quita puntos de miles
            $s = str_replace(',', '.', $s); // deja coma como decimal
        } 
        // Caso 2: número con punto decimal (ej: 1234.56)
        else {
            $s = str_replace(',', '', $s); // quita comas de miles
        }
    
        if (!is_numeric($s)) {
            return null;
        }
    
        return (float) $s;
    }

    /**
     * Exportar datos en CSV con las columnas correctas
     */
    public function export(Request $request)
    {
        $query = BaseLlegada::query();

        $filename = "base_llegada_" . now()->format("Ymd_His") . ".csv";
        
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];
        
        $callback = function () use ($query) {
            $handle = fopen('php://output', 'w');
        
            // BOM UTF-8 para que Excel abra bien el archivo
            fwrite($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));
        
            // Encabezados
            fputcsv($handle, [
                'fecha','fecha_pago','legajo','variable_100','pago_porcentaje',
                'devol_alimen','dias_alim',
                'dev_territorio','dias_terr',
                'dev_casa','dias_casa',
                'anillo','comentario'
            ]);
            
            foreach ($query->get() as $item) {
                fputcsv($handle, [
                    $item->fecha,
                    $item->fecha_pago,
                    $item->legajo,
                    $item->variable_100,
                    $item->pago_porcentaje,
                    $item->devol_alimen,
                    $item->dias_alim,
                    $item->dev_territorio,
                    $item->dias_terr,
                    $item->dev_casa,
                    $item->dias_casa,
                    $item->anillo,
                    $item->comentario,
                ]);
            }
            
            fclose($handle);
        };
        
        return response()->stream($callback, 200, $headers);
    }

    public function showImport()
    {
        return Inertia::render('Admin/BaseLlegada/Import', [
            'previewData' => [],
            'errors' => []
        ]);
    }

    /**
     * Normalizar claves de fila: convertir índices numéricos a nombres
     */
    private function normalizeKeys(array $row): array
    {
        $map = [
            '0'  => 'fecha',
            '1'  => 'fecha_pago',
            '2'  => 'legajo',
            '3'  => 'variable_100',
            '4'  => 'pago_porcentaje',
            '5'  => 'devol_alimen',
            '6'  => 'dias_alim',
            '7'  => 'dev_territorio',
            '8'  => 'dias_terr',
            '9'  => 'dev_casa',
            '10' => 'dias_casa',
            '11' => 'anillo',
            '12' => 'comentario',
        ];
        
        foreach ($map as $key => $alias) {
            if (isset($row[$key]) && !isset($row[$alias])) {
                $row[$alias] = $row[$key];
                unset($row[$key]);
            }
        }

        return $row;
    }
}