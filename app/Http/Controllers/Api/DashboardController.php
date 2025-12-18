<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AbuseCase;
use Carbon\Carbon;
use App\Models\User;

class DashboardController extends Controller
{
    public function getStats()
    {
        $totalCases = AbuseCase::count();
        $openCases = AbuseCase::whereNotIn('status', ['resolved', 'closed'])->count();
        $closedCases = AbuseCase::whereIn('status', ['resolved', 'closed'])->count();

        $newThisWeek = AbuseCase::where('created_at', '>=', now()->subDays(7))->count();

        // Pending Review: treat 'under_investigation' as pending review (per UI requirement).
        $pendingReview = AbuseCase::whereIn('status', ['under_investigation'])->count();

        // Best-effort: count distinct non-empty locations as zones covered.
        $zonesCovered = AbuseCase::whereNotNull('location')
            ->where('location', '<>', '')
            ->distinct('location')
            ->count('location');

        // Average resolution time in days for resolved/closed cases when dates exist.
        $avgResolutionTime = (float) AbuseCase::whereIn('status', ['resolved', 'closed'])
            ->whereNotNull('resolution_date')
            ->selectRaw('AVG(DATEDIFF(resolution_date, DATE(created_at))) as avg_days')
            ->value('avg_days');

        $byType = AbuseCase::selectRaw('abuse_type, count(*) as total')
            ->groupBy('abuse_type')
            ->get();
        
        $recentCases = AbuseCase::with('assignedTo:id,name')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($case) {
                return [
                    'id' => $case->id,
                    'case_number' => $case->case_number,
                    'case_title' => $case->case_title,
                    'status' => $case->status,
                    'priority' => $case->priority,
                    'severity' => $case->severity,
                    'abuse_type' => $case->abuse_type,
                    'created_at' => $case->created_at->format('Y-m-d H:i:s'),
                    'assigned_to' => $case->assignedTo ? [
                        'id' => $case->assignedTo->id,
                        'name' => $case->assignedTo->name
                    ] : null
                ];
            });

        $currentYear = Carbon::now()->year;
        $monthlyStats = AbuseCase::whereYear('created_at', $currentYear)
            ->selectRaw('MONTH(created_at) as month, count(*) as total')
            ->groupByRaw('MONTH(created_at)')
            ->orderByRaw('MONTH(created_at)')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::create()->month($item->month)->format('F'),
                    'total' => $item->total
                ];
            });

        // Get assignment stats
        $assignmentStats = User::whereIn('role', ['director', 'focal_person'])
            ->where('is_active', true)
            ->withCount(['assignedCases as open_cases_count' => function ($query) {
                $query->whereNotIn('status', ['resolved', 'closed']);
            }])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role,
                    'open_cases' => $user->open_cases_count
                ];
            });

        return response()->json([
            // Keys expected by the frontend DashboardPage
            'total_cases' => $totalCases,
            'active_cases' => $openCases,
            'resolved_cases' => $closedCases,
            'new_this_week' => $newThisWeek,
            'pending_review' => $pendingReview,
            'zones_covered' => $zonesCovered,
            'avg_resolution_time' => round($avgResolutionTime ?: 0, 1),

            // Backward-compatible/legacy keys
            'open_cases' => $openCases,
            'closed_cases' => $closedCases,
            'by_type' => $byType,
            'recent_cases' => $recentCases,
            'monthly_stats' => $monthlyStats,
            'assignment_stats' => $assignmentStats,
            'timestamp' => now()->toDateTimeString()
        ]);
    }

    public function getYearlyStats(Request $request)
    {
        $year = $request->input('year', now()->year);
        $counts = AbuseCase::whereYear('created_at', $year)
            ->selectRaw('MONTH(created_at) as month, count(*) as total')
            ->groupByRaw('MONTH(created_at)')
            ->orderByRaw('MONTH(created_at)')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'month_name' => Carbon::create()->month($item->month)->format('F'),
                    'total' => $item->total
                ];
            });

        return response()->json([
            'year' => $year, 
            'monthly_counts' => $counts
        ]);
    }

    public function getMonthlyStats(Request $request)
    {
        $year = $request->input('year', now()->year);
        $month = $request->input('month', now()->month);
        
        $stats = AbuseCase::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get();

        $total = $stats->sum('count');

        return response()->json([
            'year' => $year, 
            'month' => $month,
            'month_name' => Carbon::create()->month($month)->format('F'),
            'total_cases' => $total,
            'by_status' => $stats,
            'generated_at' => now()->toDateTimeString()
        ]);
    }

    public function getAbuseTypeStats()
    {
        $byType = AbuseCase::selectRaw('abuse_type, count(*) as total, 
            AVG(CASE WHEN priority = "critical" THEN 1 ELSE 0 END) * 100 as critical_percentage')
            ->groupBy('abuse_type')
            ->get();
        
        return response()->json($byType);
    }

    public function getRecentCases()
    {
        $cases = AbuseCase::with(['assignedTo:id,name', 'victims', 'perpetrators'])
            ->orderBy('created_at', 'desc')
            ->limit(15)
            ->get()
            ->map(function ($case) {
                return [
                    'id' => $case->id,
                    'case_number' => $case->case_number,
                    'case_title' => $case->case_title,
                    'status' => $case->status,
                    'priority' => $case->priority,
                    'abuse_type' => $case->abuse_type,
                    'incident_date' => $case->incident_date,
                    'created_at' => $case->created_at->format('Y-m-d H:i:s'),
                    'assigned_to' => $case->assignedTo ? $case->assignedTo->name : 'Unassigned',
                    'victims_count' => $case->victims->count(),
                    'perpetrators_count' => $case->perpetrators->count()
                ];
            });
            
        return response()->json($cases);
    }

    public function getPriorityStats()
    {
        $stats = AbuseCase::selectRaw('priority, count(*) as total, 
            AVG(CASE WHEN status IN ("resolved", "closed") THEN 1 ELSE 0 END) * 100 as resolution_rate')
            ->groupBy('priority')
            ->orderByRaw("FIELD(priority, 'critical', 'high', 'medium', 'low')")
            ->get();

        return response()->json($stats);
    }
}