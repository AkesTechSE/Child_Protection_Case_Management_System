<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
        'child_contact',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    public function case()
    {
        return $this->belongsTo(AbuseCase::class, 'case_id');
    }
}
