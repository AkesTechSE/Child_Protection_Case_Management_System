<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // incidents.location is a TEXT column. Make it nullable so the UI can omit it.
        DB::statement('ALTER TABLE incidents MODIFY location TEXT NULL');
    }

    public function down(): void
    {
        // Revert to NOT NULL (existing nulls would fail). We set nulls to empty string first.
        DB::statement("UPDATE incidents SET location = '' WHERE location IS NULL");
        DB::statement('ALTER TABLE incidents MODIFY location TEXT NOT NULL');
    }
};
