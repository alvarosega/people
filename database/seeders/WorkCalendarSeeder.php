<?php

namespace Database\Seeders;

use App\Models\WorkCalendar;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

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
        fgetcsv($file, 0, ';'); // Saltar cabecera

        $count = 0;
        while (($row = fgetcsv($file, 0, ';')) !== FALSE) {
            try {
                // Limpiamos la cadena de la fecha
                $fechaRaw = trim($row[0]);
                
                // Forzamos el parseo con el formato día/mes/año
                $fechaFinal = Carbon::createFromFormat('j/n/Y', $fechaRaw)->format('Y-m-d');

                WorkCalendar::updateOrCreate(
                    ['date' => $fechaFinal],
                    [
                        'type'            => trim($row[1]),
                        'description'     => isset($row[2]) ? trim($row[2]) : null,
                        'last_updated_by' => null, // Mantener null para evitar error de FK
                    ]
                );
                $count++;
            } catch (\Exception $e) {
                // Si falla j/n/Y, intentamos d/m/Y por si acaso
                try {
                    $fechaFinal = Carbon::createFromFormat('d/m/Y', trim($row[0]))->format('Y-m-d');
                    WorkCalendar::updateOrCreate(
                        ['date' => $fechaFinal],
                        [
                            'type'            => trim($row[1]),
                            'description'     => isset($row[2]) ? trim($row[2]) : null,
                            'last_updated_by' => null,
                        ]
                    );
                    $count++;
                } catch (\Exception $e2) {
                    $this->command->error("Fallo crítico en fecha '{$row[0]}': " . $e2->getMessage());
                }
            }
        }
        fclose($file);
        $this->command->info("Seeder finalizado: $count días procesados correctamente.");
    }
}