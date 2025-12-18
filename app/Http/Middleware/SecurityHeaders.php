<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    /**
     * Handle an incoming request and add security-related headers.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        // Clickjacking protection
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        // Referrer policy
        $response->headers->set('Referrer-Policy', 'no-referrer-when-downgrade');
        // Basic Content Security Policy (adjust as needed)
        $csp = "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline';";
        $response->headers->set('Content-Security-Policy', $csp);
        // Strict Transport Security (enable only behind HTTPS)
        if ($request->isSecure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        return $response;
    }
}
