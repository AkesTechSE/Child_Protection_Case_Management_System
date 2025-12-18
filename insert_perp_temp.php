<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

App\Models\Perpetrator::create([
    'first_name' => 'Aklilu',
    'last_name' => 'Abera',
    'gender' => 'male',
    'age' => 0,
    'date_of_birth' => '1900-01-01',
    'contact_number' => '0909630346',
    'address' => 'Arba Minch University Main Campus',
    'occupation' => 'N/A',
    'relationship_to_victim' => 'N/A',
    'fan_number' => 'N/A',
    'fin_number' => 'N/A',
    'previous_records' => false,
    'description' => 'dshfa  f',
    'additional_info' => [
        'case' => 'Unassigned',
        'victim' => 'N/A',
        'abuse_type' => 'N/A'
    ],
]);

echo "Inserted perpetrator Aklilu Abera\n";
