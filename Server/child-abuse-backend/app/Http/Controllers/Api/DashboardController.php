<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\AbuseCase;
use App\Models\User;
use App\Models\Victim;
use App\Models\Perpetrator;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    use ApiResponse;

    public function getStats(Request $request)
    {
        $totalCases = AbuseCase::count();
        $openCases = AbuseCase::where("status", "open")->count();
        $closedCases = AbuseCase::where("status", "closed")->orWhere("status", "resolved")->count();
        
        $totalVictims = Victim::count();
        $totalPerpetrators = Perpetrator::count();
        
        // Cases by severity
        $casesBySeverity = AbuseCase::select("severity", DB::raw("count(*) as count"))
            ->groupBy("severity")
            ->get();
            
        // Cases by type
        $casesByType = AbuseCase::select("case_type", DB::raw("count(*) as count"))
            ->groupBy("case_type")
            ->get();
            
        // Recent cases
        $recentCases = AbuseCase::with(["victim", "perpetrator"])
            ->orderBy("created_at", "desc")
            ->limit(5)
            ->get();

        return $this->successResponse([
            "total_cases" => $totalCases,
            "open_cases" => $openCases,
            "closed_cases" => $closedCases,
            "total_victims" => $totalVictims,
            "total_perpetrators" => $totalPerpetrators,
            "cases_by_severity" => $casesBySeverity,
            "cases_by_type" => $casesByType,
            "recent_cases" => $recentCases,
            "chart_data" => [
                "labels" => ["Open", "Closed", "Investigating"],
                "data" => [
                    AbuseCase::where("status", "open")->count(),
                    AbuseCase::whereIn("status", ["closed", "resolved"])->count(),
                    AbuseCase::where("status", "investigating")->count()
                ]
            ]
        ], "Dashboard statistics retrieved successfully");
    }
}
