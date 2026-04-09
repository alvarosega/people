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
            $table->date('periodo_variable'); // Mes actividad (Bonos/Variables)
            $table->date('periodo_salario');  // Mes del sueldo reportado
            $table->date('fecha_pago');       // Día efectivo del depósito
            
            $table->string('legajo');
            $table->foreign('legajo')->references('legajo')->on('users')->onUpdate('cascade')->onDelete('restrict');
            $table->string('territorio')->nullable();

            $table->decimal('variable_100', 12, 2)->nullable();
            $table->decimal('pago_porcentaje', 8, 4)->nullable(); 
            $table->decimal('devol_alimen', 12, 2)->nullable();
            $table->decimal('dias_alim', 8, 2)->nullable(); 
            $table->decimal('dev_territorio', 12, 2)->nullable();
            $table->decimal('dias_terr', 8, 2)->nullable(); 
            $table->decimal('dev_casa', 12, 2)->nullable();
            $table->decimal('dias_casa', 8, 2)->nullable(); 
            
            $table->text('comentario')->nullable();
            $table->timestamps();

            // Índice compuesto para evitar duplicidad de registros en el mismo periodo
            $table->index(['legajo', 'periodo_salario']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('base_llegada');
    }
};