<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $csvFile = database_path('data/usuarios.csv');
        
        if (!file_exists($csvFile)) {
            $this->command->error("Abortado: El archivo CSV no existe en $csvFile");
            return;
        }

        $file = fopen($csvFile, 'r');
        fgetcsv($file, 0, ','); // Saltar la cabecera

        $row = 2;
        $errores = 0;

        while (($data = fgetcsv($file, 0, ',')) !== FALSE) {
            try {
                // Limpiamos espacios y caracteres extraños
                $data = array_map(fn($v) => trim(preg_replace('/[\x00-\x1F\x7F-\xFF]/', '', $v ?? '')), $data);

                // Validación: El email es obligatorio
                if (empty($data[3])) {
                    throw new \Exception("El email está vacío.");
                }

                // Mapeo corregido basado en tu CSV (0 a 6)
                User::create([
                    'region'   => $data[0], // region
                    'legajo'   => $data[1], // legajo
                    'nombre'   => $data[2], // nombre
                    'email'    => $data[3], // email
                    'rol'      => $data[4], // rol
                    'puesto'   => $data[5], // puesto
                    'password' => Hash::make($data[6]), // password (índice final)
                ]);

            } catch (\Exception $e) {
                $errores++;
                $this->command->error("Error en fila $row (Legajo: " . ($data[1] ?? 'N/A') . "): " . $e->getMessage());
            }
            $row++;
        }

        fclose($file);

        if ($errores > 0) {
            $this->command->warn("Seeder finalizado con $errores errores.");
        } else {
            $this->command->info("Seeder ejecutado correctamente.");
        }
    }
}