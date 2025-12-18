<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\AbuseCase;
use App\Models\Victim;
use App\Models\Perpetrator;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'System Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role' => 'system_admin',
            'is_active' => true,
        ]);

        // Create director
        $director = User::create([
            'name' => 'Director',
            'email' => 'director@example.com',
            'password' => Hash::make('password123'),
            'role' => 'director',
            'is_active' => true,
        ]);

        // Create focal persons
        $focalPersons = [];
        for ($i = 1; $i <= 3; $i++) {
            $focalPersons[] = User::create([
                'name' => 'Focal Person ' . $i,
                'email' => 'focal' . $i . '@example.com',
                'password' => Hash::make('password123'),
                'role' => 'focal_person',
                'is_active' => true,
            ]);
        }

        // Create abuse cases
        $abuseTypes = ['sexual_abuse', 'physical_abuse', 'emotional_abuse', 'neglect', 'exploitation'];
        $statuses = ['reported', 'assigned', 'under_investigation', 'resolved', 'closed'];
        $severities = ['low', 'medium', 'high', 'critical'];
        $priorities = ['low', 'medium', 'high', 'critical'];

        for ($i = 1; $i <= 50; $i++) {
            $case = AbuseCase::create([
                'case_number' => 'CASE-' . date('Y') . '-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'case_title' => 'Case ' . $i . ' - ' . ucfirst(str_replace('_', ' ', $abuseTypes[array_rand($abuseTypes)])),
                'case_description' => 'Description for case ' . $i,
                'abuse_type' => $abuseTypes[array_rand($abuseTypes)],
                'status' => $statuses[array_rand($statuses)],
                'severity' => $severities[array_rand($severities)],
                'priority' => $priorities[array_rand($priorities)],
                'location' => 'Location ' . $i,
                'incident_date' => now()->subDays(rand(1, 365)),
                'reported_by' => $admin->id,
                'assigned_to' => $focalPersons[array_rand($focalPersons)]->id,
                'notes' => 'Notes for case ' . $i,
            ]);

            // Create victim for each case
            Victim::create([
                'case_id' => $case->id,
                'first_name' => 'Victim',
                'last_name' => $i,
                'gender' => ['male', 'female'][array_rand(['male', 'female'])],
                'age' => rand(5, 17),
            ]);

            // Create perpetrator for each case
            Perpetrator::create([
                'case_id' => $case->id,
                'first_name' => 'Perpetrator',
                'last_name' => $i,
                'gender' => ['male', 'female'][array_rand(['male', 'female'])],
                'age' => rand(18, 65),
            ]);
        }
    }
}