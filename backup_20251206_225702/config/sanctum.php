<?php

return [

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', '')),

    'guard' => ['web'],

    // API tokens will never expire by default
    'expiration' => null,

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    // No middleware needed for token-based auth
    'middleware' => [],
];
