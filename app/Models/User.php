<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Automatically hash password when it is set
     */
    public function setPasswordAttribute($value)
    {
        if ($value && strlen($value) < 60) {
            // Hash only if not already hashed
            $this->attributes['password'] = bcrypt($value);
        } else {
            // Keep original if it's already a hashed value
            $this->attributes['password'] = $value;
        }
    }

    // relationships
    public function assignedCases(): HasMany
    {
        return $this->hasMany(AbuseCase::class, 'assigned_to');
    }

    public function caseHistories(): HasMany
    {
        return $this->hasMany(CaseHistory::class, 'user_id');
    }
}
