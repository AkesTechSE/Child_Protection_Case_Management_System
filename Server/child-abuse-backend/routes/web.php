<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/health', function () {
    try {
        $tables = DB::select('SHOW TABLES');
        $users = DB::table('users')->count();
        
        return response()->json([
            'status' => 'healthy',
            'message' => 'Child Abuse Case Management System API',
            'database' => 'connected',
            'tables_count' => count($tables),
            'users_count' => $users,
            'endpoints' => [
                'POST /api/login' => 'User authentication',
                'GET /api/dashboard/stats' => 'Dashboard statistics',
                'GET /api/cases' => 'List all cases',
                'POST /api/cases' => 'Create new case',
                'GET /api/perpetrators/search' => 'Search perpetrators'
            ],
            'timestamp' => now()
        ]);
    } catch (Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
});
