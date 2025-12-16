<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Safely revert incidents.location to NOT NULL.
        // First, replace any NULLs with empty string.
        DB::statement("UPDATE incidents SET location = '' WHERE location IS NULL");
        DB::statement('ALTER TABLE incidents MODIFY location TEXT NOT NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE incidents MODIFY location TEXT NULL');
    }
};
