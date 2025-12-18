<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Victim extends Model
{
    use HasFactory;

    protected $fillable = [
        'case_id',
        'first_name',
        'middle_name',
        'last_name',
        'date_of_birth',
        'age',
        'gender',
        'race_ethnicity',
        'current_address',
        'phone_number',
        'email',
        'school',
        'grade_level',
        'parent_guardian_name',
        'parent_guardian_phone',
        'parent_guardian_email',
        'relationship_to_perpetrator',
        'vulnerability_factors',
        'special_needs',
        'medical_history',
        'previous_reports',
        'additional_info'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'age' => 'integer',
        'previous_reports' => 'boolean'
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