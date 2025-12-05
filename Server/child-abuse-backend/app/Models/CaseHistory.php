<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'case_id',
        'user_id',
        'action',
        'description',
        'changes'
    ];

    protected $casts = [
        'changes' => 'array'
    ];

    public function case()
    {
        return $this->belongsTo(AbuseCase::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}