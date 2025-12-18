<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('abuse_cases', function (Blueprint $table) {
            $table->id();
            $table->string('case_number')->unique();
            $table->string('case_title');
            $table->text('case_description')->nullable();
            $table->enum('abuse_type', ['sexual_abuse', 'physical_abuse', 'emotional_abuse', 'neglect', 'exploitation', 'other'])->default('other');
            $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->string('location')->nullable();
            $table->date('incident_date')->nullable();
            $table->timestamp('reporting_date')->nullable();
            $table->enum('status', ['reported', 'assigned', 'under_investigation', 'investigation', 'resolved', 'closed', 'reopened'])->default('reported');
            $table->unsignedBigInteger('assigned_to')->nullable(); // Use unsignedBigInteger
            $table->date('follow_up_date')->nullable();
            $table->date('resolution_date')->nullable();
            $table->text('resolution_details')->nullable();
            $table->text('notes')->nullable();
            $table->json('additional_info')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('abuse_cases');
    }
};