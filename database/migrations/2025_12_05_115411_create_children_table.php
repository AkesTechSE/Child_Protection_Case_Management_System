<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('children', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('case_id')->nullable(); // Made nullable temporarily
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->date('date_of_birth');
            $table->enum('gender', ['male', 'female', 'other', 'prefer_not_to_disclose']);
            $table->text('current_address');
            $table->text('address_history')->nullable();
            $table->string('guardian_phone')->nullable();
            $table->string('guardian_email')->nullable();
            $table->string('child_contact')->nullable();
            $table->timestamps();
        });
        
        // Add foreign key constraint after table is created
        Schema::table('children', function (Blueprint $table) {
            $table->foreign('case_id')->references('id')->on('abuse_cases')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('children', function (Blueprint $table) {
            $table->dropForeign(['case_id']);
        });
        
        Schema::dropIfExists('children');
    }
};