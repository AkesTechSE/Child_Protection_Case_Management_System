<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('perpetrators', function (Blueprint $table) {
            if (!Schema::hasColumn('perpetrators', 'region')) {
                $table->string('region')->nullable()->after('address');
            }
        });
    }

    public function down(): void
    {
        Schema::table('perpetrators', function (Blueprint $table) {
            if (Schema::hasColumn('perpetrators', 'region')) {
                $table->dropColumn('region');
            }
        });
    }
};
