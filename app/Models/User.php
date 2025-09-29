<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable; 
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

use Illuminate\Support\Facades\Mail;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
        /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'region',
        'legajo',
        'nombre',
        'email',
        'rol',
        'territorio',
        'puesto',
        'password',
        'last_updated_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];


    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function vacaciones()
    {
        return $this->hasMany(Vacation::class, 'legajo', 'legajo');
    }
    public function getEmailForPasswordReset()
    {
        return $this->email; // Asegúrate de usar el campo correcto
    }
    public function sendPasswordResetNotification($token)
    {
        $url = url(route('password.reset', [
            'token' => $token,
            'email' => $this->email,
        ], false));
    
        // Enviar directamente usando Mail en lugar de Notification
        Mail::send('emails.reset-password', ['url' => $url], function ($message) {
            $message->to($this->email)
                    ->subject('Restablecer contraseña');
        });
    }
    // en la clase User
    public function getNameAttribute()
    {
        return $this->nombre;
    }

    public function getUsernameAttribute()
    {
        return $this->legajo;
    }
    
}
