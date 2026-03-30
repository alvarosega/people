<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BaseLlegada extends Model
{
    protected $table = 'base_llegada';

    protected $fillable = [
        'periodo_variable', 'periodo_salario', 'fecha_pago', 'legajo', 
        'variable_100', 'pago_porcentaje', 'devol_alimen', 'dias_alim', 
        'dev_territorio', 'dias_terr', 'dev_casa', 'dias_casa', 
        'anillo', 'comentario'
    ];

    protected $casts = [
        'periodo_variable' => 'date',
        'periodo_salario'  => 'date',
        'fecha_pago'       => 'date',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'legajo', 'legajo')->withTrashed();
    }
}