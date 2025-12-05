<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    use HasFactory;

    protected $fillable = [
        'case_id',
        'report_datetime',
        'incident_datetime',
        'incident_end_datetime',
        'location',
        'location_type',
        'abuse_type',
        'detailed_description',
        'evidence_files',
        'prior_reports_count'
    ];

    protected $casts = [
        'report_datetime' => 'datetime',
        'incident_datetime' => 'datetime',
        'incident_end_datetime' => 'datetime',
        'evidence_files' => 'array'
    ];

    public function case()
    {
        return $this->belongsTo(AbuseCase::class);
    }
}