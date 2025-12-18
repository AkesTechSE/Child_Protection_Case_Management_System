<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_perpetrator', function (Blueprint $table) {
            $table->id();
            $table->foreignId('case_id')->constrained('abuse_cases')->onDelete('cascade');
            $table->foreignId('perpetrator_id')->constrained('perpetrators')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_perpetrator');
    }
};