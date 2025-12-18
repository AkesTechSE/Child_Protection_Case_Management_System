<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CaseHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'case_id',
        'user_id',
        'action',
        'description',
        'changes',
    ];

    protected $casts = [
        'changes' => 'array',
    ];

    public function case()
    {
        return $this->belongsTo(AbuseCase::class, 'case_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
