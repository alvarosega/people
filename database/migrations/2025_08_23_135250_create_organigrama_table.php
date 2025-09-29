<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('organigrama', function (Blueprint $table) {
            $table->id();
            $table->string('legajo')->nullable()->unique(); // ahora puede ser NULL
            // COLUMNA DEPARTAMENTO ELIMINADA
            $table->string('banda')->nullable();
            $table->integer('nivel_jerarquico');
            $table->unsignedBigInteger('parent_id')->nullable(); // jefe directo (NULL si es jefe máximo)
            $table->integer('orden')->default(0);
            $table->boolean('vacante')->default(false);
            $table->timestamps();
            
            // FK opcional a users (solo si legajo existe en users)
            $table->foreign('legajo')
                ->references('legajo')
                ->on('users')
                ->onDelete('cascade')
                ->nullOnDelete(); // Permite que sea NULL

            // Relación recursiva consigo mismo
            $table->foreign('parent_id')
                ->references('id')
                ->on('organigrama')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organigrama');
    }
};