<?php

$rawOrigins = trim((string) env('CORS_ALLOWED_ORIGINS', ''));
$originsFromEnv = array_filter(array_map('trim', explode(',', $rawOrigins)));

// Defaults to prevent confusing "Network Error" when env isn't set.
// In production, you should ALWAYS set CORS_ALLOWED_ORIGINS explicitly.
$isLocal = (bool) env('APP_DEBUG', false)
    || in_array(env('APP_ENV', 'production'), ['local', 'development', 'dev'], true);
$defaultDevOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // Common LAN dev host example (your current origin)
    'http://10.144.59.128:3000',
];

$allowedOrigins = (!empty($originsFromEnv))
    ? $originsFromEnv
    : $defaultDevOrigins;

// If you're serving the React dev server on a LAN IP (e.g. http://10.x.x.x:3000)
// and you don't want to hardcode it into CORS_ALLOWED_ORIGINS, allow private-network
// origins in local/dev only via patterns.
$allowedOriginPatterns = [];
if (empty($originsFromEnv)) {
    // Allow localhost + private network origins (LAN dev). If you don't want this,
    // set CORS_ALLOWED_ORIGINS explicitly in .env.
    $allowedOriginPatterns[] = '#^http://(localhost|127\.0\.0\.1):\d+$#';
    $allowedOriginPatterns[] = '#^http://10\.\d+\.\d+\.\d+:\d+$#';
    $allowedOriginPatterns[] = '#^http://192\.168\.\d+\.\d+:\d+$#';
    $allowedOriginPatterns[] = '#^http://172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+:\d+$#';
}

return [
    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    // Restrict origins via environment variable, comma-separated
    // Example: CORS_ALLOWED_ORIGINS=https://app.example.com,https://admin.example.com
    'allowed_origins' => $allowedOrigins,

    'allowed_origins_patterns' => $allowedOriginPatterns,

    'allowed_headers' => ['Content-Type', 'X-Requested-With', 'Authorization', 'Accept', 'Origin'],

    'exposed_headers' => ['Authorization'],

    'max_age' => 3600,

    // Allow credentials for cookie-based auth (Sanctum).
    // If you are not using cookies, you can set CORS_SUPPORTS_CREDENTIALS=false.
        // Allow credentials (cookies) for Sanctum stateful auth.
        // In local/dev we force this to true to avoid confusing browser "Network Error".
        // In production, enable it explicitly via CORS_SUPPORTS_CREDENTIALS=true.
        'supports_credentials' => $isLocal ? true : (bool) env('CORS_SUPPORTS_CREDENTIALS', false),
];
