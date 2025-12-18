<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel Framework Service Providers
    |--------------------------------------------------------------------------
    |
    | These providers are loaded by default for Laravel 10. Do not modify
    | them unless you know what you are doing.
    |
    */

    Illuminate\Auth\AuthServiceProvider::class,
    Illuminate\Broadcasting\BroadcastServiceProvider::class,
    Illuminate\Bus\BusServiceProvider::class,
    Illuminate\Cache\CacheServiceProvider::class,
    Illuminate\Foundation\Providers\ConsoleSupportServiceProvider::class,
    Illuminate\Hashing\HashServiceProvider::class,
    Illuminate\Mail\MailServiceProvider::class,
    Illuminate\Notifications\NotificationServiceProvider::class,
    Illuminate\Pagination\PaginationServiceProvider::class,
    Illuminate\Pipeline\PipelineServiceProvider::class,
    Illuminate\Queue\QueueServiceProvider::class,
    Illuminate\Redis\RedisServiceProvider::class,
    Illuminate\Auth\Passwords\PasswordResetServiceProvider::class,
    Illuminate\Session\SessionServiceProvider::class,
    Illuminate\Translation\TranslationServiceProvider::class,
    Illuminate\Validation\ValidationServiceProvider::class,
    Illuminate\View\ViewServiceProvider::class,

    /*
    |--------------------------------------------------------------------------
    | Application Service Providers
    |--------------------------------------------------------------------------
    |
    | These providers are specific to your application.
    |
    */

    App\Providers\AppServiceProvider::class,
    App\Providers\AuthServiceProvider::class,
    // App\Providers\BroadcastServiceProvider::class, // Uncomment if using broadcasting
    App\Providers\EventServiceProvider::class,
    App\Providers\RouteServiceProvider::class,

];
