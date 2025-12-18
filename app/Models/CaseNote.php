<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CaseNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'case_id',
        'user_id',
        'content',
        'note_type',
        'is_private',
    ];

    protected $casts = [
        'is_private' => 'boolean',
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
