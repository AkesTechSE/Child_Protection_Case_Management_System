<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Just create ONE user to test
        try {
            User::create([
                'name' => 'Test Admin',
                'email' => 'admin@test.com',
                'password' => Hash::make('password123'),
                'role' => 'system_admin',
                'is_active' => true,
            ]);
            echo "✓ User created successfully!\n";
        } catch (\Exception $e) {
            echo "✗ Error: " . $e->getMessage() . "\n";
            
            // Try with different role
            try {
                User::create([
                    'name' => 'admin',
                    'email' => 'admin@example.com',
                    'password' => Hash::make('password'),
                    'role' => 'admin', // Try 'admin' instead
                    'is_active' => true,
                ]);
                echo "✓ User created with role 'admin'!\n";
            } catch (\Exception $e2) {
                echo "✗ Also failed with 'admin': " . $e2->getMessage() . "\n";
            }
        }
    }
} 