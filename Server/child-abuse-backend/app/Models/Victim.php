<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Victim extends Model
{
    use HasFactory;

    protected $fillable = [
        'case_id',
        'first_name',
        'middle_name',
        'last_name',
        'gender',
        'age',
        'date_of_birth',
        'contact_number',
        'child_contact',
        'address',
        'current_address',
        'address_history',
        'guardian_phone',
        'guardian_email',
        'relationship_to_perpetrator',
        'description',
        'additional_info',
    ];

    protected $casts = [
        'additional_info' => 'array',
        'date_of_birth' => 'date',
    ];

    public function case(): BelongsTo
    {
        return $this->belongsTo(AbuseCase::class, 'case_id');
    }
}
