<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AbuseCase;
use App\Models\Victim;
use App\Models\Perpetrator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function generateReport(Request $request)
    {
        $start = $request->input('start_date', now()->subYear()->toDateString());
        $end = $request->input('end_date', now()->toDateString());

        $cases = AbuseCase::whereDate('created_at', '>=', $start)
            ->whereDate('created_at', '<=', $end)
            ->with(['victims','perpetrators', 'assignedTo'])
            ->get();

        $summary = [
            'total_cases' => $cases->count(),
            'by_type' => $cases->groupBy('abuse_type')->map->count(),
            'by_status' => $cases->groupBy('status')->map->count(),
            'by_priority' => $cases->groupBy('priority')->map->count(),
            'period' => [
                'start_date' => $start,
                'end_date' => $end
            ]
        ];

        return response()->json([
            'summary' => $summary, 
            'cases' => $cases,
            'generated_at' => now()->toDateTimeString()
        ]);
    }

    public function casesReport(Request $request)
    {
        $request->validate([
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'status' => 'sometimes|string',
            'abuse_type' => 'sometimes|string',
            'priority' => 'sometimes|string',
            'assigned_to' => 'sometimes|exists:users,id',
        ]);

        $start = $request->input('start_date', now()->subMonth()->toDateString());
        $end = $request->input('end_date', now()->toDateString());

        $query = AbuseCase::whereDate('created_at', '>=', $start)
            ->whereDate('created_at', '<=', $end);

        // Apply filters if provided
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('abuse_type')) {
            $query->where('abuse_type', $request->abuse_type);
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }
        if ($request->filled('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        $cases = $query->with(['victims', 'perpetrators', 'assignedTo:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Statistics
        $totalCases = $cases->count();
        $openCases = $cases->whereNotIn('status', ['resolved', 'closed'])->count();
        $closedCases = $cases->whereIn('status', ['resolved', 'closed'])->count();
        
        $abuseTypeStats = $cases->groupBy('abuse_type')->map(function ($group) use ($totalCases) {
            return [
                'count' => $group->count(),
                'percentage' => $group->count() > 0 ? round(($group->count() / $totalCases) * 100, 2) : 0
            ];
        });

        $statusStats = $cases->groupBy('status')->map(function ($group) use ($totalCases) {
            return [
                'count' => $group->count(),
                'percentage' => $group->count() > 0 ? round(($group->count() / $totalCases) * 100, 2) : 0
            ];
        });

        $priorityStats = $cases->groupBy('priority')->map(function ($group) use ($totalCases) {
            return [
                'count' => $group->count(),
                'percentage' => $group->count() > 0 ? round(($group->count() / $totalCases) * 100, 2) : 0
            ];
        });

        // Monthly trend for the selected period
        $monthlyTrend = [];
        $startDate = Carbon::parse($start);
        $endDate = Carbon::parse($end);
        
        while ($startDate <= $endDate) {
            $month = $startDate->format('Y-m');
            $monthName = $startDate->format('F Y');
            
            $monthlyCases = $cases->filter(function ($case) use ($month) {
                return Carbon::parse($case->created_at)->format('Y-m') === $month;
            });
            
            $monthlyTrend[] = [
                'month' => $month,
                'month_name' => $monthName,
                'count' => $monthlyCases->count(),
                'abuse_types' => $monthlyCases->groupBy('abuse_type')->map->count()
            ];
            
            $startDate->addMonth();
        }

        return response()->json([
            'report_period' => [
                'start_date' => $start,
                'end_date' => $end,
                'duration_days' => Carbon::parse($start)->diffInDays(Carbon::parse($end))
            ],
            'summary' => [
                'total_cases' => $totalCases,
                'open_cases' => $openCases,
                'closed_cases' => $closedCases,
                'closure_rate' => $totalCases > 0 ? round(($closedCases / $totalCases) * 100, 2) : 0,
                'average_victims_per_case' => $cases->sum(function ($case) {
                    return $case->victims->count();
                }) / max($totalCases, 1),
                'average_perpetrators_per_case' => $cases->sum(function ($case) {
                    return $case->perpetrators->count();
                }) / max($totalCases, 1)
            ],
            'statistics' => [
                'by_abuse_type' => $abuseTypeStats,
                'by_status' => $statusStats,
                'by_priority' => $priorityStats
            ],
            'monthly_trend' => $monthlyTrend,
            'cases' => $cases->map(function ($case) {
                $incidentDate = null;

                if ($case->incident_date) {
                    // Casted to Carbon via model, normalize to YYYY-MM-DD
                    $incidentDate = $case->incident_date->toDateString();
                } elseif ($case->incident_datetime) {
                    $incidentDate = Carbon::parse($case->incident_datetime)->toDateString();
                } elseif ($case->report_datetime) {
                    $incidentDate = Carbon::parse($case->report_datetime)->toDateString();
                }

                return [
                    'id' => $case->id,
                    'case_number' => $case->case_number,
                    'case_title' => $case->case_title,
                    'abuse_type' => $case->abuse_type,
                    'status' => $case->status,
                    'priority' => $case->priority,
                    'severity' => $case->severity,
                    'assigned_to' => $case->assignedTo ? [
                        'id' => $case->assignedTo->id,
                        'name' => $case->assignedTo->name,
                        'email' => $case->assignedTo->email
                    ] : null,
                    'victims_count' => $case->victims->count(),
                    'perpetrators_count' => $case->perpetrators->count(),
                    'incidents_count' => ($case->incident_datetime || $case->incident_date || $case->report_datetime) ? 1 : 0,
                    'created_at' => $case->created_at->toDateTimeString(),
                    'incident_date' => $incidentDate,
                    'location' => $case->location
                ];
            }),
            'generated_at' => now()->toDateTimeString(),
            'filters_applied' => $request->only(['status', 'abuse_type', 'priority', 'assigned_to'])
        ]);
    }

    public function victimsReport(Request $request)
    {
        $request->validate([
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
        ]);

        $start = $request->input('start_date', now()->subYear()->toDateString());
        $end = $request->input('end_date', now()->toDateString());

        $victims = Victim::whereHas('case', function ($query) use ($start, $end) {
                $query->whereDate('created_at', '>=', $start)
                      ->whereDate('created_at', '<=', $end);
            })
            ->with(['case:id,case_number,case_title,abuse_type,status'])
            ->get();

        $summary = [
            'total_victims' => $victims->count(),
            'by_gender' => $victims->groupBy('gender')->map->count(),
            'age_groups' => [
                '0-5' => $victims->where('age', '>=', 0)->where('age', '<=', 5)->count(),
                '6-12' => $victims->where('age', '>=', 6)->where('age', '<=', 12)->count(),
                '13-17' => $victims->where('age', '>=', 13)->where('age', '<=', 17)->count(),
                '18+' => $victims->where('age', '>=', 18)->count(),
                'unknown' => $victims->whereNull('age')->count(),
            ],
            'by_abuse_type' => $victims->groupBy('case.abuse_type')->map->count(),
        ];

        return response()->json([
            'summary' => $summary,
            'victims' => $victims,
            'period' => ['start_date' => $start, 'end_date' => $end],
            'generated_at' => now()->toDateTimeString()
        ]);
    }

    public function perpetratorsReport(Request $request)
    {
        $request->validate([
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'summary' => 'sometimes|boolean',
        ]);

        $start = $request->input('start_date', now()->subYear()->toDateString());
        $end = $request->input('end_date', now()->toDateString());
        $includeSummary = filter_var($request->input('summary', true), FILTER_VALIDATE_BOOLEAN);

        $perpetrators = Perpetrator::whereHas('cases', function ($query) use ($start, $end) {
                $query->whereDate('abuse_cases.created_at', '>=', $start)
                      ->whereDate('abuse_cases.created_at', '<=', $end);
            })
            ->select(['id','first_name','last_name','gender','age'])
            ->with(['cases' => function ($q) {
                $q->select('abuse_cases.id','case_number','abuse_type');
            }])
            ->get();

        $summary = null;
        if ($includeSummary) {
            $summary = [
                'total_perpetrators' => $perpetrators->count(),
                'by_gender' => $perpetrators->groupBy('gender')->map->count(),
                'by_age_group' => [
                    '18-25' => $perpetrators->where('age', '>=', 18)->where('age', '<=', 25)->count(),
                    '26-35' => $perpetrators->where('age', '>=', 26)->where('age', '<=', 35)->count(),
                    '36-50' => $perpetrators->where('age', '>=', 36)->where('age', '<=', 50)->count(),
                    '51+' => $perpetrators->where('age', '>=', 51)->count(),
                    'unknown' => $perpetrators->whereNull('age')->count(),
                ],
                // Note: previous_records/occupation/relationship fields not selected to reduce payload.
                // If needed for summary, fetch via separate lightweight queries.
            ];
        }

        $response = [
            'perpetrators' => $perpetrators,
            'period' => ['start_date' => $start, 'end_date' => $end],
            'generated_at' => now()->toDateTimeString()
        ];

        if ($includeSummary) {
            $response['summary'] = $summary;
        }

        return response()->json($response);
    }

    public function incidentReport(Request $request)
    {
        $request->validate([
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
        ]);

        $start = $request->input('start_date', now()->subYear()->toDateString());
        $end = $request->input('end_date', now()->toDateString());

        $cases = AbuseCase::where(function ($q) use ($start, $end) {
                $q->whereNotNull('incident_datetime')
                  ->whereDate('incident_datetime', '>=', $start)
                  ->whereDate('incident_datetime', '<=', $end);
            })
            ->orWhere(function ($q) use ($start, $end) {
                $q->whereNotNull('incident_date')
                  ->whereDate('incident_date', '>=', $start)
                  ->whereDate('incident_date', '<=', $end);
            })
            ->with(['assignedTo:id,name,email'])
            ->orderByRaw('COALESCE(incident_datetime, incident_date, created_at) desc')
            ->get();

        $incidents = $cases->map(function ($case) {
            return [
                'case_id' => $case->id,
                'case_number' => $case->case_number,
                'case_title' => $case->case_title,
                'status' => $case->status,
                'abuse_type' => $case->abuse_type,
                'report_datetime' => $case->report_datetime ? Carbon::parse($case->report_datetime)->toDateTimeString() : null,
                'incident_datetime' => $case->incident_datetime ? Carbon::parse($case->incident_datetime)->toDateTimeString() : null,
                'incident_end_datetime' => $case->incident_end_datetime ? Carbon::parse($case->incident_end_datetime)->toDateTimeString() : null,
                'location' => $case->location,
                'location_type' => $case->location_type,
                'detailed_description' => $case->detailed_description,
                'prior_reports_count' => $case->prior_reports_count,
                'evidence_files' => $case->evidence_files ?? [],
            ];
        });

        $summary = [
            'total_incidents' => $incidents->count(),
            'by_abuse_type' => $incidents->groupBy('abuse_type')->map->count(),
            'by_location_type' => $incidents->groupBy('location_type')->map->count(),
            'time_of_day' => [
                'morning' => $incidents->filter(function ($i) {
                    if (empty($i['incident_datetime'])) return false;
                    $h = Carbon::parse($i['incident_datetime'])->hour;
                    return $h >= 6 && $h < 12;
                })->count(),
                'afternoon' => $incidents->filter(function ($i) {
                    if (empty($i['incident_datetime'])) return false;
                    $h = Carbon::parse($i['incident_datetime'])->hour;
                    return $h >= 12 && $h < 18;
                })->count(),
                'evening' => $incidents->filter(function ($i) {
                    if (empty($i['incident_datetime'])) return false;
                    $h = Carbon::parse($i['incident_datetime'])->hour;
                    return $h >= 18 && $h < 22;
                })->count(),
                'night' => $incidents->filter(function ($i) {
                    if (empty($i['incident_datetime'])) return false;
                    $h = Carbon::parse($i['incident_datetime'])->hour;
                    return $h >= 22 || $h < 6;
                })->count(),
            ],
            'average_reports_count' => $incidents->avg('prior_reports_count') ?? 0,
        ];

        return response()->json([
            'summary' => $summary,
            'incidents' => $incidents,
            'period' => ['start_date' => $start, 'end_date' => $end],
            'generated_at' => now()->toDateTimeString()
        ]);
    }

    public function comprehensiveReport(Request $request)
    {
        $start = $request->input('start_date', now()->subYear()->toDateString());
        $end = $request->input('end_date', now()->toDateString());

        $cases = AbuseCase::whereDate('created_at', '>=', $start)
            ->whereDate('created_at', '<=', $end)
            ->with(['victims', 'perpetrators', 'assignedTo'])
            ->get();

        $victims = Victim::whereHas('case', function ($query) use ($start, $end) {
            $query->whereDate('abuse_cases.created_at', '>=', $start)
                  ->whereDate('abuse_cases.created_at', '<=', $end);
        })->get();

        $perpetrators = Perpetrator::whereHas('cases', function ($query) use ($start, $end) {
            // Fully qualify to avoid ambiguity when the relationship joins pivot tables with timestamps.
            $query->whereDate('abuse_cases.created_at', '>=', $start)
                  ->whereDate('abuse_cases.created_at', '<=', $end);
        })->get();

                $incidentCases = AbuseCase::where(function ($q) use ($start, $end) {
                                $q->whereNotNull('incident_datetime')
                                    ->whereDate('incident_datetime', '>=', $start)
                                    ->whereDate('incident_datetime', '<=', $end);
                        })
                        ->orWhere(function ($q) use ($start, $end) {
                                $q->whereNotNull('incident_date')
                                    ->whereDate('incident_date', '>=', $start)
                                    ->whereDate('incident_date', '<=', $end);
                        })
                        ->get();

        $summary = [
            'period' => ['start_date' => $start, 'end_date' => $end],
            'cases' => [
                'total' => $cases->count(),
                'open' => $cases->whereNotIn('status', ['resolved', 'closed'])->count(),
                'closed' => $cases->whereIn('status', ['resolved', 'closed'])->count(),
                'by_type' => $cases->groupBy('abuse_type')->map->count(),
                'by_status' => $cases->groupBy('status')->map->count(),
                'by_priority' => $cases->groupBy('priority')->map->count(),
            ],
            'victims' => [
                'total' => $victims->count(),
                'by_gender' => $victims->groupBy('gender')->map->count(),
                'average_age' => $victims->whereNotNull('age')->avg('age'),
            ],
            'perpetrators' => [
                'total' => $perpetrators->count(),
                'by_gender' => $perpetrators->groupBy('gender')->map->count(),
                'with_previous_records' => $perpetrators->where('previous_records', true)->count(),
                'by_relationship' => $perpetrators->groupBy('relationship_to_victim')->map->count(),
            ],
            'incidents' => [
                'total' => $incidentCases->count(),
                'by_type' => $incidentCases->groupBy('abuse_type')->map->count(),
                'by_location' => $incidentCases->groupBy('location_type')->map->count(),
            ],
            'timeline' => [
                'cases_by_month' => $cases->groupBy(function ($case) {
                    return Carbon::parse($case->created_at)->format('Y-m');
                })->map->count(),
            ]
        ];

        return response()->json([
            'report_type' => 'comprehensive',
            'summary' => $summary,
            'generated_at' => now()->toDateTimeString(),
            'period_covered' => Carbon::parse($start)->diffForHumans(Carbon::parse($end))
        ]);
    }
}