<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('base_llegada', function (Blueprint $table) {
            $table->id();
            $table->string('fecha');
            $table->string('fecha_pago')->nullable(); 
            $table->unsignedBigInteger('legajo');
            $table->decimal('variable_100', 12, 2)->nullable();
            $table->decimal('pago_porcentaje', 8, 4)->nullable(); // Cambié a 4 decimales para porcentajes más precisos

            $table->decimal('devol_alimen', 12, 2)->nullable();
            $table->decimal('dias_alim', 8, 2)->nullable(); // CAMBIADO: ahora permite decimales            

            $table->decimal('dev_territorio', 12, 2)->nullable();
            $table->decimal('dias_terr', 8, 2)->nullable(); // CAMBIADO: ahora permite decimales

            $table->decimal('dev_casa', 12, 2)->nullable();
            $table->decimal('dias_casa', 8, 2)->nullable(); // CAMBIADO: ahora permite decimales
            
            $table->string('anillo')->nullable();
            $table->text('comentario')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('base_llegada');
    }
};