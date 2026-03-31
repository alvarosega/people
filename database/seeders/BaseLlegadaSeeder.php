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
            $this->command->error("Archivo no encontrado");
            return;
        }

        $file = fopen($csvFile, 'r');
        fgetcsv($file); // Saltar cabecera

        $procesados = 0;
        $omitidos = 0;

        while (($row = fgetcsv($file, 0, ',')) !== FALSE) {
            if (empty($row) || count($row) < 4) continue;

            try {
                $clean = fn($v) => trim(preg_replace('/[\x00-\x1F\x7F-\xFF]/', '', $v ?? ''));
                
                $legajo = $clean($row[3]);
                if (!User::where('legajo', $legajo)->withTrashed()->exists()) {
                    $omitidos++;
                    continue;
                }

                // 1. Manejo robusto de fechas (Detecta si es Serial de Excel o String YYYYMM)
                $parseDate = function($val, $isPeriod = true) use ($clean) {
                    $v = $clean($val);
                    if (is_numeric($v) && strlen($v) < 7) {
                        // Es un serial de Excel (ej: 46082)
                        return Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($v));
                    }
                    
                    if ($isPeriod) {
                        return Carbon::createFromFormat('Ym', substr($v, 0, 6))->startOfMonth();
                    }
                    
                    return Carbon::parse(str_replace('/', '-', $v));
                };

                $pVariable = $parseDate($row[0])->format('Y-m-d');
                $pSalario  = $parseDate($row[1])->format('Y-m-d');
                $fPago     = $parseDate($row[2], false)->format('Y-m-d');

                // 2. Helper Numérico (Maneja separadores de miles "3,527.54")
                $num = function($v) use ($clean) {
                    $v = $clean($v);
                    if ($v === '-' || $v === '') return 0;
                    // Eliminamos la coma (miles) para que PHP reconozca el punto (decimal)
                    $val = str_replace(',', '', $v);
                    return is_numeric($val) ? (float)$val : 0;
                };

                BaseLlegada::updateOrCreate(
                    ['periodo_salario' => $pSalario, 'legajo' => $legajo],
                    [
                        'periodo_variable' => $pVariable,
                        'fecha_pago'       => $fPago,
                        'variable_100'     => $num($row[4]),
                        'pago_porcentaje'  => $num($row[5]),
                        'devol_alimen'     => $num($row[6]),
                        'dias_alim'        => $num($row[7]),
                        'dev_territorio'   => $num($row[8]),
                        'dias_terr'        => $num($row[9]),
                        'dev_casa'         => $num($row[10]),
                        'dias_casa'        => $num($row[11]),
                        'anillo'           => $clean($row[12]) === '-' ? null : $clean($row[12]),
                        'comentario'       => $clean($row[13]) ?: null,
                    ]
                );

                $procesados++;

            } catch (\Exception $e) {
                $this->command->error("Error en legajo " . ($row[3] ?? '???') . ": " . $e->getMessage());
            }
        }

        fclose($file);
        $this->command->info("Carga exitosa: $procesados registros.");
    }
}