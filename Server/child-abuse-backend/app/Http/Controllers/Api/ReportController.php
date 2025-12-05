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

    public function generateReport(Request \)
    {
        \ = Validator::make(\->all(), [
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'report_type' => 'sometimes|in:cases_summary,abuse_types,perpetrators,monthly_trend',
            'format' => 'sometimes|in:json,pdf,csv'
        ]);

        if (\->fails()) {
            return \->validationError(\->errors());
        }

        \ = Auth::user();
        
        // Only director and system admin can generate reports
        if (!\->isDirector() && !\->isSystemAdmin()) {
            return \->forbidden('Only directors and system administrators can generate reports');
        }

        \ = \->start_date ? Carbon::parse(\->start_date) : Carbon::now()->subYear();
        \ = \->end_date ? Carbon::parse(\->end_date) : Carbon::now();
        \ = \->report_type ?? 'cases_summary';

        \ = [];

        switch (\) {
            case 'cases_summary':
                \ = \->generateCasesSummaryReport(\, \);
                break;

            case 'abuse_types':
                \ = \->generateAbuseTypesReport(\, \);
                break;

            case 'perpetrators':
                \ = \->generatePerpetratorsReport(\, \);
                break;

            case 'monthly_trend':
                \ = \->generateMonthlyTrendReport(\, \);
                break;
        }

        \['report_info'] = [
            'generated_by' => \->name,
            'generated_at' => now()->toDateTimeString(),
            'period' => \->format('Y-m-d') . ' to ' . \->format('Y-m-d'),
            'report_type' => \
        ];

        return \->success(\, 'Report generated successfully');
    }

    private function generateCasesSummaryReport(\, \)
    {
        \ = AbuseCase::whereBetween('created_at', [\, \])->count();
        
        \ = AbuseCase::selectRaw('status, COUNT(*) as count')
            ->whereBetween('created_at', [\, \])
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        \ = AbuseCase::selectRaw('priority, COUNT(*) as count')
            ->whereBetween('created_at', [\, \])
            ->groupBy('priority')
            ->get()
            ->pluck('count', 'priority');

        \ = AbuseCase::selectRaw('users.name as focal_person, COUNT(abuse_cases.id) as case_count')
            ->join('users', 'abuse_cases.reported_by', '=', 'users.id')
            ->where('users.role', 'focal_person')
            ->whereBetween('abuse_cases.created_at', [\, \])
            ->groupBy('users.id', 'users.name')
            ->orderBy('case_count', 'desc')
            ->get();

        return [
            'total_cases' => \,
            'cases_by_status' => \,
            'cases_by_priority' => \,
            'cases_by_focal_person' => \,
            'average_cases_per_day' => \->calculateAverageCasesPerDay(\, \, \)
        ];
    }

    private function generateAbuseTypesReport(\, \)
    {
        \ = Incident::selectRaw('abuse_type, COUNT(*) as count')
            ->join('abuse_cases', 'incidents.case_id', '=', 'abuse_cases.id')
            ->whereBetween('abuse_cases.created_at', [\, \])
            ->groupBy('abuse_type')
            ->get()
            ->pluck('count', 'abuse_type');

        \ = Incident::selectRaw('location_type, COUNT(*) as count')
            ->join('abuse_cases', 'incidents.case_id', '=', 'abuse_cases.id')
            ->whereBetween('abuse_cases.created_at', [\, \])
            ->groupBy('location_type')
            ->get()
            ->pluck('count', 'location_type');

        \ = DB::table('children')
            ->join('abuse_cases', 'children.case_id', '=', 'abuse_cases.id')
            ->selectRaw('children.gender, COUNT(*) as count')
            ->whereBetween('abuse_cases.created_at', [\, \])
            ->groupBy('children.gender')
            ->get()
            ->pluck('count', 'gender');

        return [
            'abuse_types_distribution' => \,
            'abuse_by_location' => \,
            'child_gender_distribution' => \
        ];
    }

    private function generatePerpetratorsReport(\, \)
    {
        \ = DB::table('perpetrators')
            ->join('abuse_cases', 'perpetrators.case_id', '=', 'abuse_cases.id')
            ->selectRaw('relationship_to_child, COUNT(*) as count')
            ->whereBetween('abuse_cases.created_at', [\, \])
            ->groupBy('relationship_to_child')
            ->get()
            ->pluck('count', 'relationship_to_child');

        \ = DB::table('perpetrators')
            ->join('abuse_cases', 'perpetrators.case_id', '=', 'abuse_cases.id')
            ->selectRaw('gender, COUNT(*) as count')
            ->whereBetween('abuse_cases.created_at', [\, \])
            ->groupBy('gender')
            ->get()
            ->pluck('count', 'gender');

        \ = DB::table('perpetrators')
            ->selectRaw('CONCAT(first_name, \" \", last_name) as full_name, COUNT(*) as case_count')
            ->whereIn('case_id', function(\) use (\, \) {
                \->select('id')
                    ->from('abuse_cases')
                    ->whereBetween('created_at', [\, \]);
            })
            ->groupBy('first_name', 'last_name')
            ->having('case_count', '>', 1)
            ->orderBy('case_count', 'desc')
            ->get();

        return [
            'perpetrators_by_relationship' => \,
            'perpetrators_by_gender' => \,
            'repeat_perpetrators' => \,
            'total_unique_perpetrators' => DB::table('perpetrators')
                ->whereIn('case_id', function(\) use (\, \) {
                    \->select('id')
                        ->from('abuse_cases')
                        ->whereBetween('created_at', [\, \]);
                })
                ->distinct()
                ->count(['first_name', 'last_name', 'date_of_birth'])
        ];
    }

    private function generateMonthlyTrendReport(\, \)
    {
        \ = AbuseCase::selectRaw('
                YEAR(created_at) as year,
                MONTH(created_at) as month,
                COUNT(*) as total_cases,
                SUM(CASE WHEN status = \"closed\" THEN 1 ELSE 0 END) as closed_cases,
                SUM(CASE WHEN priority = \"high\" OR priority = \"critical\" THEN 1 ELSE 0 END) as high_priority_cases
            ')
            ->whereBetween('created_at', [\, \])
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();

        \ = DB::table('incidents')
            ->join('abuse_cases', 'incidents.case_id', '=', 'abuse_cases.id')
            ->selectRaw('
                YEAR(abuse_cases.created_at) as year,
                MONTH(abuse_cases.created_at) as month,
                abuse_type,
                COUNT(*) as count
            ')
            ->whereBetween('abuse_cases.created_at', [\, \])
            ->groupBy('year', 'month', 'abuse_type')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();

        return [
            'monthly_trend' => \,
            'monthly_abuse_types' => \
        ];
    }

    private function calculateAverageCasesPerDay(\, \, \)
    {
        \ = \->diffInDays(\) + 1;
        return \ > 0 ? round(\ / \, 2) : 0;
    }

    public function exportReport(Request \)
    {
        \ = Validator::make(\->all(), [
            'report_type' => 'required|in:cases_summary,abuse_types,perpetrators',
            'format' => 'required|in:csv,excel'
        ]);

        if (\->fails()) {
            return \->validationError(\->errors());
        }

        \ = Auth::user();
        
        if (!\->isDirector() && !\->isSystemAdmin()) {
            return \->forbidden('Only directors and system administrators can export reports');
        }

        // This is a simplified version - you can implement CSV/Excel export here
        // For now, we'll return the report data in JSON format
        \ = \->generateReport(\)->getData()->data;

        return \->success([
            'report_data' => \,
            'download_url' => null, // You can implement file generation and return URL here
            'message' => 'Export feature coming soon. Currently showing report data.'
        ], 'Report data for export');
    }
}
