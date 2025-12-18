<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AbuseCase;
use App\Models\Incident;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ReportController extends Controller
{
    use ApiResponse;

    public function generateReport(Request $request)
    {
        // Validation
        $validator = Validator::make($request->all(), [
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'report_type' => 'sometimes|in:cases_summary,abuse_types,perpetrators,monthly_trend',
            'format' => 'sometimes|in:json,pdf,csv'
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', $validator->errors(), 422);
        }

        $user = Auth::user();

        // Only allow directors or system admins
        if (!in_array($user->role, ['director', 'system_admin'])) {
            return $this->errorResponse('Only directors and system administrators can generate reports', null, 403);
        }

        $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::now()->subYear();
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::now();
        $reportType = $request->report_type ?? 'cases_summary';

        $reportData = [];

        switch ($reportType) {
            case 'cases_summary':
                $reportData = $this->generateCasesSummaryReport($startDate, $endDate);
                break;

            case 'abuse_types':
                $reportData = $this->generateAbuseTypesReport($startDate, $endDate);
                break;

            case 'perpetrators':
                $reportData = $this->generatePerpetratorsReport($startDate, $endDate);
                break;

            case 'monthly_trend':
                $reportData = $this->generateMonthlyTrendReport($startDate, $endDate);
                break;
        }

        $reportData['report_info'] = [
            'generated_by' => $user->name,
            'generated_at' => now()->toDateTimeString(),
            'period' => $startDate->format('Y-m-d') . ' to ' . $endDate->format('Y-m-d'),
            'report_type' => $reportType
        ];

        return $this->successResponse($reportData, 'Report generated successfully');
    }

    // Cases Summary
    private function generateCasesSummaryReport($startDate, $endDate)
    {
        $totalCases = AbuseCase::whereBetween('created_at', [$startDate, $endDate])->count();

        $casesByStatus = AbuseCase::selectRaw('status, COUNT(*) as count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        $casesByPriority = AbuseCase::selectRaw('priority, COUNT(*) as count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('priority')
            ->get()
            ->pluck('count', 'priority');

        $casesByFocalPerson = AbuseCase::selectRaw('users.name as focal_person, COUNT(abuse_cases.id) as case_count')
            ->join('users', 'abuse_cases.reported_by', '=', 'users.id')
            ->where('users.role', 'focal_person')
            ->whereBetween('abuse_cases.created_at', [$startDate, $endDate])
            ->groupBy('users.id', 'users.name')
            ->orderBy('case_count', 'desc')
            ->get();

        return [
            'total_cases' => $totalCases,
            'cases_by_status' => $casesByStatus,
            'cases_by_priority' => $casesByPriority,
            'cases_by_focal_person' => $casesByFocalPerson,
            'average_cases_per_day' => $this->calculateAverageCasesPerDay($startDate, $endDate, $totalCases),
        ];
    }

    private function calculateAverageCasesPerDay($startDate, $endDate, $totalCases)
    {
        $days = $startDate->diffInDays($endDate) + 1;
        return $days > 0 ? round($totalCases / $days, 2) : 0;
    }

    // Abuse Types Report
    private function generateAbuseTypesReport($startDate, $endDate)
    {
        $types = AbuseCase::selectRaw('abuse_type, COUNT(*) as count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('abuse_type')
            ->orderBy('count', 'desc')
            ->get();

        return [
            'total_types' => $types->count(),
            'types_summary' => $types
        ];
    }

    // Perpetrators Report
    private function generatePerpetratorsReport($startDate, $endDate)
    {
        $perpetrators = AbuseCase::selectRaw('perpetrator_name, COUNT(*) as case_count')
            ->whereNotNull('perpetrator_name')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('perpetrator_name')
            ->orderBy('case_count', 'desc')
            ->get();

        return [
            'total_perpetrators' => $perpetrators->count(),
            'perpetrators_summary' => $perpetrators
        ];
    }

    // Monthly Trend Report
    private function generateMonthlyTrendReport($startDate, $endDate)
    {
        $monthly = AbuseCase::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Format data for easier charting
        $trend = [];
        foreach ($monthly as $m) {
            $trend[] = [
                'year' => $m->year,
                'month' => $m->month,
                'cases' => $m->count
            ];
        }

        return [
            'monthly_trend' => $trend
        ];
    }
}
