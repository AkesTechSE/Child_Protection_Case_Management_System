<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AbuseCase extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'abuse_cases';

    protected $fillable = [
        'case_number',
        'case_title',
        'case_description',
        'abuse_type',
        'priority',
        'severity',
        'location',
        'incident_date',
        'reporting_date',
        'report_datetime',
        'incident_datetime',
        'incident_end_datetime',
        'status',
        'assigned_to',
        'follow_up_date',
        'resolution_date',
        'resolution_details',
        'notes',
        'additional_info',
        'location_type',
        'detailed_description',
        'evidence_files',
        'prior_reports_count',
    ];

    protected $casts = [
        'incident_date' => 'date',
        'reporting_date' => 'datetime',
        'report_datetime' => 'datetime',
        'incident_datetime' => 'datetime',
        'incident_end_datetime' => 'datetime',
        'follow_up_date' => 'date',
        'resolution_date' => 'date',
        'additional_info' => 'array',
        'evidence_files' => 'array',
    ];

    // relations
    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function victims(): HasMany
    {
        return $this->hasMany(Victim::class, 'case_id');
    }

    public function perpetrators(): BelongsToMany
    {
        return $this->belongsToMany(Perpetrator::class, 'case_perpetrator', 'case_id', 'perpetrator_id')->withTimestamps();
    }

    public function notes(): HasMany
    {
        return $this->hasMany(CaseNote::class, 'case_id');
    }

    public function histories(): HasMany
    {
        return $this->hasMany(CaseHistory::class, 'case_id');
    }
}
