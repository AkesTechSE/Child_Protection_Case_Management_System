<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('victims', function (Blueprint $table) {
            $table->id();
            $table->foreignId('case_id')->constrained('abuse_cases')->onDelete('cascade');
            $table->string('first_name');
            $table->string('last_name');
            $table->enum('gender', ['male', 'female', 'other', 'prefer_not_to_disclose']);
            $table->integer('age')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('contact_number')->nullable();
            $table->text('address')->nullable();
            $table->string('relationship_to_perpetrator')->nullable();
            $table->text('description')->nullable();
            $table->json('additional_info')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('victims');
    }
};