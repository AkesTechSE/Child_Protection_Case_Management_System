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
            DB::statement('ALTER TABLE incidents MODIFY location TEXT NOT NULL');
        } elseif (DB::getDriverName() === 'sqlite') {
            // SQLite doesn't support MODIFY
            // Skip or handle differently
        } else {
            DB::statement('ALTER TABLE incidents ALTER COLUMN location SET NOT NULL');
        }
    }

    public function down()
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE incidents MODIFY location TEXT NULL');
        } elseif (DB::getDriverName() === 'sqlite') {
            // Skip
        } else {
            DB::statement('ALTER TABLE incidents ALTER COLUMN location DROP NOT NULL');
        }
    }
};