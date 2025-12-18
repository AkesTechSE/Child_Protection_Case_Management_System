<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AbuseCase extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'case_number',
        'case_title',
        'case_description',
        'abuse_type',
        'status',
        'severity',
        'priority',
        'location',
        'incident_date',
        'reporting_date',
        'reported_by',
        'assigned_to',
        'follow_up_date',
        'resolution_date',
        'resolution_details',
        'notes',
        'additional_info'
    ];

    protected $casts = [
        'incident_date' => 'date',
        'reporting_date' => 'datetime',
        'follow_up_date' => 'date',
        'resolution_date' => 'date',
        'additional_info' => 'json'
    ];

    // Relationships
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function victims()
    {
        return $this->hasMany(Victim::class);
    }

    public function perpetrators()
    {
        return $this->hasMany(Perpetrator::class);
    }

    public function notes()
    {
        return $this->hasMany(CaseNote::class);
    }

    public function evidence()
    {
        return $this->hasMany(CaseEvidence::class);
    }

    // Helper methods
    public function getStatusLabel()
    {
        return match($this->status) {
            'reported' => 'Reported',
            'assigned' => 'Assigned',
            'investigation' => 'Under Investigation',
            'resolved' => 'Resolved',
            'closed' => 'Closed',
            default => ucfirst($this->status),
        };
    }

    public function getAbuseTypeLabel()
    {
        return match($this->abuse_type) {
            'sexual_abuse' => 'Sexual Abuse',
            'physical_abuse' => 'Physical Abuse',
            'emotional_abuse' => 'Emotional Abuse',
            'neglect' => 'Neglect',
            'exploitation' => 'Exploitation',
            'other' => 'Other',
            default => ucfirst($this->abuse_type),
        };
    }

    public function getSeverityLabel()
    {
        return match($this->severity) {
            'low' => 'Low',
            'medium' => 'Medium',
            'high' => 'High',
            'critical' => 'Critical',
            default => 'Unknown',
        };
    }

    public function getPriorityLabel()
    {
        return match($this->priority) {
            'low' => 'Low',
            'medium' => 'Medium',
            'high' => 'High',
            'critical' => 'Critical',
            default => 'Unknown',
        };
    }
}