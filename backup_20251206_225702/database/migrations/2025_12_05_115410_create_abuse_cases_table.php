<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('abuse_cases', function (Blueprint $table) {
            // Add missing columns if they don't exist
            if (!Schema::hasColumn('abuse_cases', 'case_title')) {
                $table->string('case_title')->after('case_number');
            }
            
            if (!Schema::hasColumn('abuse_cases', 'case_description')) {
                $table->text('case_description')->nullable()->after('case_title');
            }
            
            if (!Schema::hasColumn('abuse_cases', 'abuse_type')) {
                $table->enum('abuse_type', ['sexual_abuse', 'physical_abuse', 'emotional_abuse', 'neglect', 'exploitation', 'other'])
                      ->default('other')
                      ->after('case_description');
            }
            
            if (!Schema::hasColumn('abuse_cases', 'severity')) {
                $table->enum('severity', ['low', 'medium', 'high', 'critical'])
                      ->default('medium')
                      ->after('priority');
            }
            
            if (!Schema::hasColumn('abuse_cases', 'location')) {
                $table->string('location')->nullable()->after('severity');
            }
            
            if (!Schema::hasColumn('abuse_cases', 'incident_date')) {
                $table->date('incident_date')->nullable()->after('location');
            }
            
            if (!Schema::hasColumn('abuse_cases', 'reporting_date')) {
                $table->timestamp('reporting_date')->nullable()->after('incident_date');
            }
            
            if (!Schema::hasColumn('abuse_cases', 'follow_up_date')) {
                $table->date('follow_up_date')->nullable()->after('assigned_to');
            }
            
            if (!Schema::hasColumn('abuse_cases', 'resolution_date')) {
                $table->date('resolution_date')->nullable()->after('follow_up_date');
            }
            
            if (!Schema::hasColumn('abuse_cases', 'resolution_details')) {
                $table->text('resolution_details')->nullable()->after('resolution_date');
            }
            
            if (!Schema::hasColumn('abuse_cases', 'additional_info')) {
                $table->json('additional_info')->nullable()->after('notes');
            }
            
            // Update status enum if it exists
            if (Schema::hasColumn('abuse_cases', 'status')) {
                Schema::table('abuse_cases', function (Blueprint $table) {
                    $table->enum('status', ['reported', 'assigned', 'under_investigation', 'investigation', 'resolved', 'closed', 'reopened'])
                          ->default('reported')
                          ->change();
                });
            }
        });
    }

    public function down(): void
    {
        Schema::table('abuse_cases', function (Blueprint $table) {
            // Remove added columns
            $columnsToDrop = [
                'case_title',
                'case_description',
                'abuse_type',
                'severity',
                'location',
                'incident_date',
                'reporting_date',
                'follow_up_date',
                'resolution_date',
                'resolution_details',
                'additional_info'
            ];
            
            foreach ($columnsToDrop as $column) {
                if (Schema::hasColumn('abuse_cases', $column)) {
                    $table->dropColumn($column);
                }
            }
            
            // Revert status enum
            if (Schema::hasColumn('abuse_cases', 'status')) {
                Schema::table('abuse_cases', function (Blueprint $table) {
                    $table->enum('status', ['reported', 'assigned', 'investigation', 'closed'])
                          ->default('reported')
                          ->change();
                });
            }
        });
    }
};