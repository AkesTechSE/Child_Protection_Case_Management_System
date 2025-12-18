<?php
// debug_simple.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== SIMPLE LARAVEL DEBUG ===\n\n";

// 1. Check if we can load the autoloader
echo "1. Loading autoloader...\n";
require __DIR__ . '/vendor/autoload.php';
echo "   ✓ Autoloader loaded\n\n";

// 2. Check bootstrap/app.php
echo "2. Checking bootstrap/app.php...\n";
if (!file_exists(__DIR__ . '/bootstrap/app.php')) {
    die("   ❌ bootstrap/app.php not found!\n");
}

// 3. Load the app
echo "3. Creating application instance...\n";
$app = require_once __DIR__ . '/bootstrap/app.php';
echo "   ✓ Application created\n\n";

// 4. Check configuration
echo "4. Getting configuration...\n";
try {
    $config = $app->make('config');
    echo "   ✓ Configuration loaded\n\n";
    
    // 5. Check providers
    echo "5. Checking providers...\n";
    $providers = $config->get('app.providers');
    
    if (!is_array($providers)) {
        die("   ❌ Providers is not an array! Type: " . gettype($providers) . "\n");
    }
    
    echo "   Found " . count($providers) . " providers\n\n";
    
    foreach ($providers as $index => $provider) {
        echo "   Provider #{$index}: ";
        
        if (is_array($provider)) {
            echo "❌ ARRAY FOUND!\n";
            echo "   Contents: ";
            print_r($provider);
            die("\n\nFound the problem! Provider #{$index} is an array.\n");
        } elseif (is_string($provider)) {
            echo "✓ String: {$provider}\n";
        } else {
            echo "⚠ Type: " . gettype($provider) . "\n";
            var_dump($provider);
        }
    }
    
    echo "\n✓ All providers in config are strings.\n";
    
} catch (Exception $e) {
    echo "   ❌ Error: " . $e->getMessage() . "\n";
    echo "   File: " . $e->getFile() . "\n";
    echo "   Line: " . $e->getLine() . "\n";
}