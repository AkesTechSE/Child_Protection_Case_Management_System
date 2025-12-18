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
        'phone_number',
        'address',
        'department',
        'position',
        'is_active',
        'last_login_at',
        'profile_image'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
        'last_login_at' => 'datetime'
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

    public function caseNotes()
    {
        return $this->hasMany(CaseNote::class);
    }

    public function caseEvidence()
    {
        return $this->hasMany(CaseEvidence::class);
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

    // Permission checks
    public function canManageUsers()
    {
        return $this->isSystemAdmin();
    }

    public function canManageCases()
    {
        return $this->isSystemAdmin() || $this->isDirector() || $this->isFocalPerson();
    }

    public function canViewDashboard()
    {
        return true;
    }
}