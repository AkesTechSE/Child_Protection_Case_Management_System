<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CaseController;
use App\Http\Controllers\Api\DashboardController;

// Public routes
Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API connected successfully!',
        'data' => [
            'api_version' => '1.0.0',
            'timestamp' => now(),
            'endpoints' => [
                '/api/login' => 'POST - User authentication',
                '/api/dashboard/stats' => 'GET - Dashboard statistics',
                '/api/cases' => 'GET - List all cases',
                '/api/cases' => 'POST - Create new case',
            ]
        ]
    ]);
});

Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    
    Route::prefix('cases')->group(function () {
        Route::get('/', [CaseController::class, 'index']);
        Route::post('/', [CaseController::class, 'store']);
        Route::put('/{id}', [CaseController::class, 'update']);
        Route::delete('/{id}', [CaseController::class, 'destroy']);
        Route::post('/{id}/notes', [CaseController::class, 'addNote']);
    });
});