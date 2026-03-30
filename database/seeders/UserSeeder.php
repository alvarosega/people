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
                // Limpiamos espacios en blanco de los datos
                $data = array_map('trim', $data);

                // Validación preventiva: Si el email es obligatorio en DB, no podemos enviar NULL
                if (empty($data[3])) {
                    throw new \Exception("El email es obligatorio y está vacío en el CSV.");
                }

                User::create([
                    'region'     => $data[0],
                    'legajo'     => $data[1],
                    'nombre'     => $data[2],
                    'email'      => $data[3], // Eliminado el ternario de null
                    'rol'        => $data[4],
                    'territorio' => $data[5] ?: null, // Territorio sí puede ser null según migración
                    'puesto'     => $data[6],
                    'password'   => Hash::make($data[7]),
                ]);

            } catch (\Exception $e) {
                $errores++;
                $this->command->error("Error en la fila $row (Legajo: " . ($data[1] ?? 'N/A') . "): " . $e->getMessage());
            }
            $row++;
        }

        fclose($file);

        if ($errores > 0) {
            $this->command->warn("Seeder finalizado con $errores errores.");
        } else {
            $this->command->info("Seeder ejecutado correctamente sin errores.");
        }
    }
}