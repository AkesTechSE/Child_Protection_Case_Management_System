<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // You can bind interfaces to implementations here
        // Example:
        // $this->app->bind(ExampleInterface::class, ExampleImplementation::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Fix for older MySQL versions to avoid index length issues
        Schema::defaultStringLength(191);

        // You can also register global helpers, macros, or events here
        // Example:
        // \Illuminate\Support\Facades\Response::macro('success', function ($data) {
        //     return response()->json(['status' => 'success', 'data' => $data]);
        // });
    }
}
