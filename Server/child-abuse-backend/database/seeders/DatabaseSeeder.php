<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Clear users table first
        DB::table('users')->delete();
        
        // System Administrator
        DB::table('users')->insert([
            'name' => 'System Administrator',
            'email' => 'admin@childabuse.org',
            'password' => Hash::make('Admin@123'),
            'role' => 'system_admin',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Director
        DB::table('users')->insert([
            'name' => 'Director',
            'email' => 'director@childabuse.org',
            'password' => Hash::make('Director@123'),
            'role' => 'director',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        // Focal Person
        DB::table('users')->insert([
            'name' => 'Focal Person',
            'email' => 'focal@childabuse.org',
            'password' => Hash::make('Focal@123'),
            'role' => 'focal_person',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $this->command->info('✅ Default users created successfully!');
    }
}