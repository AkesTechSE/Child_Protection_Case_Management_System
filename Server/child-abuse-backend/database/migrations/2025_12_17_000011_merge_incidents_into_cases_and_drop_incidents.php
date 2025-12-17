<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1) Add incident fields to abuse_cases
        Schema::table('abuse_cases', function (Blueprint $table) {
            if (!Schema::hasColumn('abuse_cases', 'report_datetime')) {
                $table->dateTime('report_datetime')->nullable()->after('reporting_date');
            }
            if (!Schema::hasColumn('abuse_cases', 'incident_datetime')) {
                $table->dateTime('incident_datetime')->nullable()->after('report_datetime');
            }
            if (!Schema::hasColumn('abuse_cases', 'incident_end_datetime')) {
                $table->dateTime('incident_end_datetime')->nullable()->after('incident_datetime');
            }
            if (!Schema::hasColumn('abuse_cases', 'location_type')) {
                $table->enum('location_type', ['home', 'school', 'online', 'public_place', 'other'])->nullable()->after('location');
            }
            if (!Schema::hasColumn('abuse_cases', 'detailed_description')) {
                $table->text('detailed_description')->nullable()->after('case_description');
            }
            if (!Schema::hasColumn('abuse_cases', 'evidence_files')) {
                $table->json('evidence_files')->nullable()->after('additional_info');
            }
            if (!Schema::hasColumn('abuse_cases', 'prior_reports_count')) {
                $table->integer('prior_reports_count')->default(0)->after('evidence_files');
            }
        });

        // 2) Copy incidents -> abuse_cases (use latest incident per case)
        if (Schema::hasTable('incidents')) {
            $latestIncidents = DB::table('incidents')
                ->orderBy('incident_datetime', 'desc')
                ->orderBy('id', 'desc')
                ->get()
                ->groupBy('case_id');

            foreach ($latestIncidents as $caseId => $incidents) {
                $incident = $incidents->first();
                if (!$incident) continue;

                // Only update fields that exist in incidents table.
                DB::table('abuse_cases')
                    ->where('id', $caseId)
                    ->update([
                        'report_datetime' => $incident->report_datetime ?? null,
                        'incident_datetime' => $incident->incident_datetime ?? null,
                        'incident_end_datetime' => $incident->incident_end_datetime ?? null,
                        'location' => $incident->location ?? DB::raw('location'),
                        'location_type' => $incident->location_type ?? null,
                        'abuse_type' => $incident->abuse_type ?? DB::raw('abuse_type'),
                        'detailed_description' => $incident->detailed_description ?? null,
                        'evidence_files' => $incident->evidence_files ?? null,
                        'prior_reports_count' => $incident->prior_reports_count ?? 0,
                        // Best effort: keep the original case dates in sync
                        'incident_date' => $incident->incident_datetime ? substr((string) $incident->incident_datetime, 0, 10) : DB::raw('incident_date'),
                        'reporting_date' => $incident->report_datetime ?? DB::raw('reporting_date'),
                        'updated_at' => now(),
                    ]);
            }

            // 3) Drop incidents table (merged)
            Schema::drop('incidents');
        }
    }

    public function down(): void
    {
        // Recreate incidents table (minimal) - data cannot be perfectly restored.
        if (!Schema::hasTable('incidents')) {
            Schema::create('incidents', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('case_id');
                $table->dateTime('report_datetime');
                $table->dateTime('incident_datetime');
                $table->dateTime('incident_end_datetime')->nullable();
                $table->text('location');
                $table->enum('location_type', ['home', 'school', 'online', 'public_place', 'other']);
                $table->string('abuse_type');
                $table->text('detailed_description');
                $table->json('evidence_files')->nullable();
                $table->integer('prior_reports_count')->default(0);
                $table->timestamps();

                $table->foreign('case_id')->references('id')->on('abuse_cases')->onDelete('cascade');
            });
        }

        // Not removing added columns in abuse_cases on down to avoid data loss.
    }
};
