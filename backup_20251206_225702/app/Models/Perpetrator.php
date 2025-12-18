<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Perpetrator extends Model
{
    use HasFactory;

    protected $fillable = [
        'case_id',
        'first_name',
        'middle_name',
        'last_name',
        'aliases',
        'date_of_birth',
        'age',
        'gender',
        'race_ethnicity',
        'current_address',
        'last_known_address',
        'phone_number',
        'email',
        'relationship_to_child',
        'fan_number',
        'fin_number',
        'occupation',
        'employer',
        'criminal_history',
        'substance_abuse_history',
        'mental_health_history',
        'weapons_access',
        'weapons_details'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'weapons_access' => 'boolean'
    ];

    public function case()
    {
        return $this->belongsTo(AbuseCase::class);
    }

    public function getFullNameAttribute()
    {
        $names = [$this->first_name];
        
        if ($this->middle_name) {
            $names[] = $this->middle_name;
        }
        
        $names[] = $this->last_name;
        
        return implode(' ', $names);
    }
}