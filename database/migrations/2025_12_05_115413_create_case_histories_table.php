<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('case_id');
            $table->unsignedBigInteger('user_id');
            $table->enum('action', ['created', 'updated', 'assigned', 'status_changed', 'note_added']);
            $table->text('description');
            $table->json('changes')->nullable();
            $table->timestamps();
        });
        
        Schema::table('case_histories', function (Blueprint $table) {
            $table->foreign('case_id')->references('id')->on('abuse_cases')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::table('case_histories', function (Blueprint $table) {
            $table->dropForeign(['case_id']);
            $table->dropForeign(['user_id']);
        });
        
        Schema::dropIfExists('case_histories');
    }
};