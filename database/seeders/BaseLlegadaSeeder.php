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
        
        // 1. Forzamos el delimitador de punto y coma [;]
        fgetcsv($file, 0, ';'); // Saltar cabecera

        $procesados = 0;
        $omitidos = 0;

        while (($row = fgetcsv($file, 0, ';')) !== FALSE) {
            // Saltamos filas vacías
            if (empty($row) || count($row) < 4) continue;

            try {
                // Helper de limpieza
                $clean = fn($v) => trim(preg_replace('/[\x00-\x1F\x7F-\xFF]/', '', $v ?? ''));
                
                $legajo = $clean($row[3]);

                // 2. Validación de existencia de usuario
                if (!User::where('legajo', $legajo)->withTrashed()->exists()) {
                    $omitidos++;
                    continue;
                }

                // 3. Parseo de Fechas (Formato: 202512 y 1/2/2026)
                $pVariable = Carbon::createFromFormat('Ym', substr($clean($row[0]), 0, 6))->startOfMonth()->format('Y-m-d');
                $pSalario  = Carbon::createFromFormat('Ym', substr($clean($row[1]), 0, 6))->startOfMonth()->format('Y-m-d');
                
                // fecha_pago viene como d/m/Y (1/2/2026)
                $fPago = Carbon::parse(str_replace('/', '-', $clean($row[2])))->format('Y-m-d');

                // 4. Helper Numérico (Convierte 1,02 a 1.02)
                $num = function($v) use ($clean) {
                    $val = str_replace(',', '.', $clean($v));
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
                        'anillo'           => $clean($row[12]) === '0' ? null : $clean($row[12]),
                        'comentario'       => $clean($row[13]) ?: null,
                    ]
                );

                $procesados++;

            } catch (\Exception $e) {
                $this->command->error("Error en legajo " . ($row[3] ?? '???') . ": " . $e->getMessage());
            }
        }

        fclose($file);
        $this->command->info("Carga exitosa: $procesados registros. (Omitidos por legajo inexistente: $omitidos)");
    }
}