<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            // MySQL specific syntax
            // incidents.location is a TEXT column. Make it nullable so the UI can omit it.
             DB::statement('ALTER TABLE incidents MODIFY location TEXT NULL');
        } elseif (DB::getDriverName() === 'pgsql') {
            // PostgreSQL specific syntax
        } else {
            // SQLite or other DBMS - handle accordingly
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
               // Revert to NOT NULL (existing nulls would fail). We set nulls to empty string first.
                DB::statement("UPDATE incidents SET location = '' WHERE location IS NULL");
                DB::statement('ALTER TABLE incidents MODIFY location TEXT NOT NULL');
        }

    }
};
