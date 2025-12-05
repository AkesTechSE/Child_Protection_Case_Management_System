<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('perpetrators', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('case_id');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('aliases')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->integer('age')->nullable();
            $table->enum('gender', ['male', 'female', 'other']);
            $table->string('race_ethnicity')->nullable();
            $table->text('current_address');
            $table->text('last_known_address')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('email')->nullable();
            $table->enum('relationship_to_child', [
                'parent', 'stepparent', 'grandparent', 'relative', 
                'babysitter', 'teacher', 'stranger', 'other'
            ]);
            $table->string('fan_number')->nullable();
            $table->string('fin_number')->nullable();
            $table->string('occupation')->nullable();
            $table->string('employer')->nullable();
            $table->text('criminal_history')->nullable();
            $table->text('substance_abuse_history')->nullable();
            $table->text('mental_health_history')->nullable();
            $table->boolean('weapons_access')->default(false);
            $table->text('weapons_details')->nullable();
            $table->timestamps();
            
            $table->foreign('case_id')->references('id')->on('abuse_cases')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('perpetrators');
    }
};