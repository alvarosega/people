<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vacation extends Model
{
    use HasFactory;

    protected $table = 'vacaciones';

    protected $fillable = [
        'legajo',
        'fecha_inicio',
        'fecha_fin',
        'dias',
        'estado',
        'comentario',
    ];

    /**
     * Relación con usuario (por legajo).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'legajo', 'legajo');
    }
}
