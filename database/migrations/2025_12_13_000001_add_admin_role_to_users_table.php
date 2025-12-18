<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // users.role is an ENUM created in an earlier migration.
        // To add 'admin' safely, we alter the column (MySQL) via raw SQL.
        if (!Schema::hasColumn('users', 'role')) {
            return;
        }

        $driver = DB::getDriverName();
        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE `users` MODIFY COLUMN `role` ENUM('system_admin','admin','director','focal_person') NOT NULL DEFAULT 'focal_person'");
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('users', 'role')) {
            return;
        }

        $driver = DB::getDriverName();
        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE `users` MODIFY COLUMN `role` ENUM('system_admin','director','focal_person') NOT NULL DEFAULT 'focal_person'");
        }
    }
};
