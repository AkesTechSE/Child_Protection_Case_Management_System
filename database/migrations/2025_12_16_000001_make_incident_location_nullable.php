<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE incidents MODIFY location TEXT NULL');
        } elseif (DB::getDriverName() === 'sqlite') {
            // SQLite doesn't support MODIFY, need to recreate table
            // Or skip since this is just for testing
            Schema::table('incidents', function (Blueprint $table) {
                // For SQLite, we can't easily modify columns
                // This is a limitation - consider using a different approach
            });
        } else {
            // PostgreSQL, SQL Server, etc.
            DB::statement('ALTER TABLE incidents ALTER COLUMN location DROP NOT NULL');
        }
    }

    public function down()
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE incidents MODIFY location TEXT NOT NULL');
        } elseif (DB::getDriverName() === 'sqlite') {
            // Skip
        } else {
            DB::statement('ALTER TABLE incidents ALTER COLUMN location SET NOT NULL');
        }
    }
};