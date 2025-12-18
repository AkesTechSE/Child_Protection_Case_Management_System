<?php

namespace App\Exceptions;

use Illuminate\Database\QueryException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Log;
use PDOException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->renderable(function (QueryException $e, $request) {
            if (!$request->expectsJson()) {
                return null;
            }

            Log::error('Database query error', [
                'exception' => get_class($e),
                'message' => $e->getMessage(),
                'url' => $request->fullUrl(),
            ]);

            return response()->json([
                'message' => 'Service temporarily unavailable. Please try again later.',
            ], 503);
        });

        $this->renderable(function (PDOException $e, $request) {
            if (!$request->expectsJson()) {
                return null;
            }

            Log::error('Database connection error', [
                'exception' => get_class($e),
                'message' => $e->getMessage(),
                'url' => $request->fullUrl(),
            ]);

            return response()->json([
                'message' => 'Service temporarily unavailable. Please try again later.',
            ], 503);
        });

        $this->renderable(function (Throwable $e, $request) {
            if (!$request->expectsJson()) {
                return null;
            }

            // Fallback: mask raw DB details if they leak through other exception types.
            $msg = $e->getMessage() ?? '';
            if (is_string($msg) && (str_contains($msg, 'SQLSTATE') || str_contains(strtolower($msg), 'mysql'))) {
                Log::error('Masked database-related exception', [
                    'exception' => get_class($e),
                    'message' => $msg,
                    'url' => $request->fullUrl(),
                ]);

                return response()->json([
                    'message' => 'Service temporarily unavailable. Please try again later.',
                ], 503);
            }

            return null;
        });
    }
}
