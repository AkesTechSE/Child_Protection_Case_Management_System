<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CaseController;
use App\Http\Controllers\Api\DashboardController;

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
});
