<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean'
    ];

    // Relationships
    public function reportedCases()
    {
        return $this->hasMany(AbuseCase::class, 'reported_by');
    }

    public function assignedCases()
    {
        return $this->hasMany(AbuseCase::class, 'assigned_to');
    }

    public function caseHistories()
    {
        return $this->hasMany(CaseHistory::class);
    }

    // Methods for role checking
    public function isSystemAdmin()
    {
        return $this->role === 'system_admin';
    }

    public function isDirector()
    {
        return $this->role === 'director';
    }

    public function isFocalPerson()
    {
        return $this->role === 'focal_person';
    }
}