<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

// Controllers
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\CaseController;
use App\Http\Controllers\Api\VictimController;
use App\Http\Controllers\Api\PerpetratorController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ReportController;

/*
|--------------------------------------------------------------------------
| Health Check (Public)
|--------------------------------------------------------------------------
*/
Route::get('/health', function () {
    try {
        $tables = DB::select('SHOW TABLES');

        return response()->json([
            'status' => 'healthy',
            'message' => 'Child Abuse Case Management System API',
            'database' => 'connected',
            'tables_count' => count($tables),
            'timestamp' => now(),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'unhealthy',
            'message' => 'Database connection failed',
            'database' => 'disconnected',
            'timestamp' => now(),
        ], 503);
    }
});

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    /*
    |------------------------ Auth ------------------------
    */
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    /*
    |--------------------- Dashboard ----------------------
    */
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'getStats']);
        Route::get('/abuse-type-stats', [DashboardController::class, 'getAbuseTypeStats']);
        Route::get('/recent-cases', [DashboardController::class, 'getRecentCases']);
        Route::get('/yearly-stats', [DashboardController::class, 'getYearlyStats']);
        Route::get('/monthly-stats', [DashboardController::class, 'getMonthlyStats']);
        Route::get('/priority-stats', [DashboardController::class, 'getPriorityStats']);
    });

    /*
    |----------------------- Cases ------------------------
    */
    Route::prefix('cases')->group(function () {
        Route::get('/', [CaseController::class, 'index']);
        Route::post('/', [CaseController::class, 'store']);
        Route::get('/{id}', [CaseController::class, 'show']);
        Route::put('/{id}', [CaseController::class, 'update']);
        Route::delete('/{id}', [CaseController::class, 'destroy']);
        Route::get('/{id}/stats', [CaseController::class, 'stats']);
        Route::get('/{id}/notes', [CaseController::class, 'getNotes']);
        Route::post('/{id}/notes', [CaseController::class, 'addNote']);
        Route::delete('/{id}/notes/{noteId}', [CaseController::class, 'deleteNote']);

        // Evidence attachments (merged from incidents)
        Route::get('/{id}/attachments', [CaseController::class, 'getAttachments']);
        Route::post('/{id}/attachments', [CaseController::class, 'uploadAttachments']);
        Route::delete('/{id}/attachments', [CaseController::class, 'removeAttachment']);
        Route::get('/{id}/attachments/download', [CaseController::class, 'downloadAttachment']);
    });

    /*
    |----------------------- Victims ----------------------
    */
    Route::prefix('victims')->group(function () {
        Route::get('/', [VictimController::class, 'index']);
        Route::post('/', [VictimController::class, 'store']);
        Route::get('/{id}', [VictimController::class, 'show']);
        Route::put('/{id}', [VictimController::class, 'update']);
        Route::delete('/{id}', [VictimController::class, 'destroy']);
        Route::get('/search', [VictimController::class, 'search']);
    });

    /*
    |--------------------- Perpetrators -------------------
    */
    Route::prefix('perpetrators')->group(function () {
        Route::get('/', [PerpetratorController::class, 'index']);
        Route::get('/search', [PerpetratorController::class, 'search']);
        Route::post('/', [PerpetratorController::class, 'store']);
        Route::get('/{id}', [PerpetratorController::class, 'show']);
        Route::put('/{id}', [PerpetratorController::class, 'update']);
        Route::delete('/{id}', [PerpetratorController::class, 'destroy']);
    });

    /*
    |------------------------ Users ------------------------
    */
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
        Route::get('/roles', [UserController::class, 'getRoles']);
        Route::get('/focal-persons', [UserController::class, 'getFocalPersons']);
        Route::post('/{id}/activate', [UserController::class, 'activateUser']);
        Route::post('/{id}/deactivate', [UserController::class, 'deactivateUser']);
        // Admin: change another user's password
        Route::post('/{id}/change-password', [UserController::class, 'changeUserPassword']);
    });

    /*
    |----------------------- Reports -----------------------
    */
    Route::prefix('reports')->group(function () {
        Route::get('/generate', [ReportController::class, 'generateReport']);
        Route::get('/cases', [ReportController::class, 'casesReport']);
        Route::get('/victims', [ReportController::class, 'victimsReport']);
        Route::get('/perpetrators', [ReportController::class, 'perpetratorsReport']);
        Route::get('/incidents', [ReportController::class, 'incidentReport']);
        Route::get('/comprehensive', [ReportController::class, 'comprehensiveReport']);
    });
});