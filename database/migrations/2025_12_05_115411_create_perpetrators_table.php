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
            $table->string('first_name');
            $table->string('last_name');
            $table->enum('gender', ['male', 'female', 'other', 'prefer_not_to_disclose']);
            $table->integer('age')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('contact_number')->nullable();
            $table->text('address')->nullable();
            $table->string('occupation')->nullable();
            $table->string('relationship_to_victim')->nullable();
            $table->string('fan_number', 50)->nullable(); // Added
            $table->string('fin_number', 50)->nullable(); // Added
            $table->boolean('previous_records')->default(false);
            $table->text('description')->nullable();
            $table->json('additional_info')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('perpetrators');
    }
};