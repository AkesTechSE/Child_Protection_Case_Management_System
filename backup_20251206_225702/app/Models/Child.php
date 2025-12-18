<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Child extends Model
{
    use HasFactory;

    protected $fillable = [
        'case_id',
        'first_name',
        'middle_name',
        'last_name',
        'date_of_birth',
        'gender',
        'current_address',
        'address_history',
        'guardian_phone',
        'guardian_email',
        'child_contact'
    ];

    protected $casts = [
        'date_of_birth' => 'date'
    ];

    public function case()
    {
        return $this->belongsTo(AbuseCase::class);
    }

    // Accessor for full name
    public function getFullNameAttribute()
    {
        $names = [$this->first_name];
        
        if ($this->middle_name) {
            $names[] = $this->middle_name;
        }
        
        $names[] = $this->last_name;
        
        return implode(' ', $names);
    }

    // Accessor for age
    public function getAgeAttribute()
    {
        return now()->diffInYears($this->date_of_birth);
    }
}