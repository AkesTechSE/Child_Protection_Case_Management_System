<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Fix abuse_cases assigned_to foreign key
        if (Schema::hasTable('abuse_cases') && Schema::hasTable('users') && Schema::hasColumn('abuse_cases', 'assigned_to')) {
            try {
                Schema::table('abuse_cases', function (Blueprint $table) {
                    // Drop existing foreign key if any (to avoid errors)
                    $table->dropForeign(['assigned_to']);
                });
            } catch (\Exception $e) {
                // Foreign key doesn't exist, continue
            }
            
            // Add foreign key constraint
            Schema::table('abuse_cases', function (Blueprint $table) {
                $table->foreign('assigned_to')->references('id')->on('users')->nullOnDelete();
            });
        }
        
        // Ensure all other foreign keys exist
        $tablesWithCaseId = ['children', 'victims', 'incidents', 'case_histories'];
        
        foreach ($tablesWithCaseId as $tableName) {
            if (Schema::hasTable($tableName) && Schema::hasTable('abuse_cases') && Schema::hasColumn($tableName, 'case_id')) {
                try {
                    Schema::table($tableName, function (Blueprint $table) {
                        $table->dropForeign(['case_id']);
                    });
                } catch (\Exception $e) {
                    // Foreign key doesn't exist, continue
                }
                
                // Add foreign key constraint
                Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                    $table->foreign('case_id')->references('id')->on('abuse_cases')->onDelete('cascade');
                });
            }
        }
    }

    public function down(): void
    {
        // Optional: Remove foreign keys if you want to rollback
        // But usually we keep them
    }
};