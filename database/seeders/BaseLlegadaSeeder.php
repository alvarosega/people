<?php

namespace Database\Seeders;

use App\Models\BaseLlegada;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class BaseLlegadaSeeder extends Seeder
{
    public function run(): void
    {
        $csvFile = database_path('data/historico_base_llegada.csv');

        if (!file_exists($csvFile)) {
            $this->command->error("Archivo no encontrado en: $csvFile");
            return;
        }

        $file = fopen($csvFile, 'r');
        fgetcsv($file); // Saltar cabecera

        $procesados = 0;
        $omitidos = 0;

        while (($row = fgetcsv($file, 0, ',')) !== FALSE) {
            // Validamos que la fila tenga contenido mínimo
            if (empty($row) || count($row) < 10) continue;

            try {
                // Limpiador de basura de strings (espacios, caracteres invisibles de Excel)
                $clean = fn($v) => trim(preg_replace('/[\x00-\x1F\x7F-\xFF]/', '', $v ?? ''));
                
                $legajo = $clean($row[3]);

                // Verificación de integridad del usuario
                if (!User::where('legajo', $legajo)->withTrashed()->exists()) {
                    $omitidos++;
                    continue;
                }

                $parseDate = function($val, $isPeriod = true) use ($clean) {
                    $v = $clean($val);
                    
                    // 1. Si es YYYYMM (6 dígitos), es un periodo
                    if (is_numeric($v) && strlen($v) === 6) {
                        return Carbon::createFromFormat('Ym', $v)->startOfMonth();
                    }
                
                    // 2. Si es un serial de Excel (normalmente 5 dígitos para estas fechas)
                    if (is_numeric($v) && strlen($v) === 5) {
                        return Carbon::create(1899, 12, 30)->addDays((int)$v);
                    }
                
                    // 3. Fallback para fechas con guiones o barras
                    return Carbon::parse(str_replace('/', '-', $v));
                };

                // 2. PARSEO NUMÉRICO (Soporta punto decimal '.' y limpia guiones '-')
                $num = function($v) use ($clean) {
                    $v = $clean($v);
                    // Si es un guion o está vacío, el valor matemático es 0
                    if ($v === '-' || $v === '' || !isset($v)) return 0;
                    
                    // Quitamos comas de miles si existieran, para dejar solo el punto decimal
                    $val = str_replace(',', '', $v);
                    
                    return is_numeric($val) ? (float)$val : 0;
                };

                // Ejecución de carga/actualización
                BaseLlegada::updateOrCreate(
                    [
                        'periodo_salario' => $parseDate($row[1])->format('Y-m-d'), 
                        'legajo'          => $legajo
                    ],
                    [
                        'periodo_variable' => $parseDate($row[0])->format('Y-m-d'),
                        'fecha_pago'       => $parseDate($row[2], false)->format('Y-m-d'),
                        'variable_100'     => $num($row[4]),
                        'pago_porcentaje'  => $num($row[5]),
                        'devol_alimen'     => $num($row[6]),
                        'dias_alim'        => $num($row[7]),
                        'dev_territorio'   => $num($row[8]),
                        'dias_terr'        => $num($row[9]),
                        'dev_casa'         => $num($row[10]),
                        'dias_casa'        => $num($row[11]),
                        'territorio'       => $clean($row[12]) ?: '0',
                        'comentario'       => $clean($row[13]) ?: null,
                    ]
                );

                $procesados++;

            } catch (\Exception $e) {
                $this->command->error("Error crítico en legajo " . ($row[3] ?? '???') . ": " . $e->getMessage());
            }
        }

        fclose($file);
        $this->command->info("Carga finalizada: $procesados registros procesados. ($omitidos omitidos por legajo inexistente)");
    }
}