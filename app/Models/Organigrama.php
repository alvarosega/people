<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Organigrama extends Model
{
    protected $table = 'organigrama';

    protected $fillable = [
        'legajo',
        'parent_id',
        'banda',
        'nivel_jerarquico',
        'orden',
        'vacante',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'legajo', 'legajo');
    }
    public function children()
    {
        return $this->hasMany(Organigrama::class, 'parent_id');
    }
}
