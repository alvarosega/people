<?php

namespace Database\Seeders;

use App\Models\WorkCalendar;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class WorkCalendarSeeder extends Seeder
{
    public function run(): void
    {
        $csvFile = database_path('data/calendar_data.csv');

        if (!file_exists($csvFile)) {
            $this->command->error("Archivo calendar_data.csv no encontrado.");
            return;
        }

        $file = fopen($csvFile, 'r');
        
        // Cambiamos el delimitador a ';' según tu ejemplo de datos
        fgetcsv($file, 0, ';'); 

        $count = 0;

        while (($row = fgetcsv($file, 0, ';')) !== FALSE) {
            if (empty($row[0])) continue;

            try {
                $clean = fn($v) => trim(preg_replace('/[\x00-\x1F\x7F-\xFF]/', '', $v ?? ''));
                
                // Helper de Fecha: Maneja Serial de Excel (46054) o formatos d/m/Y - j/n/Y
                $parseDate = function($val) use ($clean) {
                    $v = $clean($val);
                    
                    // Si Excel lo convirtió a número
                    if (is_numeric($v) && strlen($v) < 7) {
                        return Carbon::create(1899, 12, 30)->addDays((int)$v);
                    }

                    // Intentar formatos comunes de entrada manual
                    try {
                        return Carbon::parse(str_replace('/', '-', $v));
                    } catch (\Exception $e) {
                        // Fallback por si el formato es muy específico
                        return Carbon::createFromFormat('d-m-Y', str_replace('/', '-', $v));
                    }
                };

                $fechaFinal = $parseDate($row[0])->format('Y-m-d');

                WorkCalendar::updateOrCreate(
                    ['date' => $fechaFinal],
                    [
                        'type'            => $clean($row[1]),
                        'description'     => isset($row[2]) ? $clean($row[2]) : null,
                        'last_updated_by' => null, 
                    ]
                );
                
                $count++;

            } catch (\Exception $e) {
                $this->command->error("Error en fecha " . ($row[0] ?? '???') . ": " . $e->getMessage());
            }
        }

        fclose($file);
        $this->command->info("Seeder finalizado: $count días procesados correctamente.");
    }
}