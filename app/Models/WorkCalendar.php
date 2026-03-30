<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkCalendar extends Model
{
    protected $table = 'work_calendar';

    protected $fillable = [
        'date',
        'type',
        'description',
        'last_updated_by'
    ];

    protected $casts = [
        'date' => 'date',
    ];
}