<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE case_histories MODIFY COLUMN action ENUM('created','updated','assigned','status_changed','note_added','deleted')");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE case_histories MODIFY COLUMN action ENUM('created','updated','assigned','status_changed','note_added')");
    }
};
