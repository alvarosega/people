<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class BaseLlegada extends Model
{
    use HasFactory;

    protected $table = 'base_llegada';

    protected $fillable = [
        'fecha',
        'fecha_pago',
        'legajo',
        'variable_100',
        'pago_porcentaje',
        'devol_alimen',
        'dias_alim',
        'dev_territorio',
        'dias_terr',
        'dev_casa',
        'dias_casa',
        'anillo',
        'comentario',
    ];

    protected $casts = [
        'fecha'           => 'string',
        'fecha_pago'      => 'string',
        'legajo'          => 'integer',
        'variable_100'    => 'decimal:2',
        'pago_porcentaje' => 'decimal:2',
        'devol_alimen'    => 'decimal:2',
        'dias_alim'       => 'integer',
        'dev_territorio'  => 'decimal:2',
        'dias_terr'       => 'integer',
        'dev_casa'        => 'decimal:2',
        'dias_casa'       => 'integer',
        'anillo'          => 'string',
        'comentario'      => 'string',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'legajo', 'legajo');
    }
    public function getFechaDisplayAttribute()
    {
        return $this->fecha 
            ? Carbon::createFromFormat('m-Y', $this->fecha)->translatedFormat('M Y')
            : null;
    }
    
    public function getFechaPagoDisplayAttribute()
    {
        return $this->fecha_pago 
            ? Carbon::createFromFormat('d-m-Y', $this->fecha_pago)->translatedFormat('d M Y')
            : null;
    }
}
