<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\CaseController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ReportController; // Add this

// Test endpoint
Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API connected successfully!',
        'timestamp' => now()->toDateTimeString(),
        'version' => '1.0.0'
    ]);
});

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    
    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'getStats']);
        Route::get('/yearly-stats', [DashboardController::class, 'getYearlyStats']);
        Route::get('/monthly-stats', [DashboardController::class, 'getMonthlyStats']);
        Route::get('/abuse-type-stats', [DashboardController::class, 'getAbuseTypeStats']);
        Route::get('/recent-cases', [DashboardController::class, 'getRecentCases']);
    });
    
    // Cases
    Route::prefix('cases')->group(function () {
        Route::get('/', [CaseController::class, 'index']);
        Route::post('/', [CaseController::class, 'store']);
        Route::get('/{id}', [CaseController::class, 'show']);
        Route::put('/{id}', [CaseController::class, 'update']);
        Route::delete('/{id}', [CaseController::class, 'destroy']);
        Route::post('/{id}/notes', [CaseController::class, 'addNote']);
    });
    
    // Users (Admin only)
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
        Route::get('/roles', [UserController::class, 'getRoles']);
    });

    // Reports
    Route::prefix('reports')->group(function () {
        Route::get('/', [ReportController::class, 'generateReport']); // Generate report
    });
});
