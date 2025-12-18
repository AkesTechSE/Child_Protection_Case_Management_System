<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('case_id');
            $table->dateTime('report_datetime');
            $table->dateTime('incident_datetime');
            $table->dateTime('incident_end_datetime')->nullable();
            $table->text('location');
            $table->enum('location_type', ['home', 'school', 'online', 'public_place', 'other']);
            $table->enum('abuse_type', ['sexual_abuse', 'physical_abuse', 'emotional_abuse', 'neglect', 'exploitation', 'other'])->default('other');
            $table->text('detailed_description');
            $table->json('evidence_files')->nullable();
            $table->integer('prior_reports_count')->default(0);
            $table->timestamps();
        });
        
        Schema::table('incidents', function (Blueprint $table) {
            $table->foreign('case_id')->references('id')->on('abuse_cases')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            $table->dropForeign(['case_id']);
        });
        
        Schema::dropIfExists('incidents');
    }
};