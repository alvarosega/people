<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_calendar', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique(); // No puede haber dos estados para el mismo día
            $table->enum('type', ['holiday', 'non_worked', 'sunday']); 
            $table->string('description')->nullable(); // Ej: "Día de la Independencia"
            
            // Auditoría básica
            $table->string('last_updated_by')->nullable();
            $table->foreign('last_updated_by')
                  ->references('legajo')
                  ->on('users')
                  ->onDelete('set null');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_calendar');
    }
};