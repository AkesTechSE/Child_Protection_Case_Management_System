<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Perpetrator extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'gender',
        'age',
        'date_of_birth',
        'contact_number',
        'address',
        'region',
        'occupation',
        'relationship_to_victim',
        'fan_number',    // Added
        'fin_number',    // Added
        'previous_records',
        'description',
        'additional_info',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'previous_records' => 'boolean',
        'additional_info' => 'array',
    ];

    public function cases()
    {
        return $this->belongsToMany(AbuseCase::class, 'case_perpetrator', 'perpetrator_id', 'case_id');
    }
}