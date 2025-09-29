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
        Schema::create('vacaciones', function (Blueprint $table) {
            $table->id();

            // Relación con users.legajo
            $table->string('legajo');
            $table->foreign('legajo')->references('legajo')->on('users')->onDelete('cascade');

            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->integer('dias');
            $table->string('estado')->default('pendiente'); // pendiente, aprobada, rechazada
            $table->text('comentario')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vacaciones');
    }
};
