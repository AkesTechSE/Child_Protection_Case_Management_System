<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1) Expand victims table to hold child fields
        Schema::table('victims', function (Blueprint $table) {
            // Allow registering without a case (children allowed this)
            $table->unsignedBigInteger('case_id')->nullable()->change();

            if (!Schema::hasColumn('victims', 'middle_name')) {
                $table->string('middle_name')->nullable()->after('first_name');
            }
            if (!Schema::hasColumn('victims', 'current_address')) {
                $table->text('current_address')->nullable()->after('date_of_birth');
            }
            if (!Schema::hasColumn('victims', 'address_history')) {
                $table->text('address_history')->nullable()->after('current_address');
            }
            if (!Schema::hasColumn('victims', 'guardian_phone')) {
                $table->string('guardian_phone')->nullable()->after('address_history');
            }
            if (!Schema::hasColumn('victims', 'guardian_email')) {
                $table->string('guardian_email')->nullable()->after('guardian_phone');
            }
            if (!Schema::hasColumn('victims', 'child_contact')) {
                $table->string('child_contact')->nullable()->after('guardian_email');
            }
        });

        // 2) Migrate data from children -> victims (best effort)
        if (Schema::hasTable('children')) {
            $children = DB::table('children')->get();

            foreach ($children as $child) {
                DB::table('victims')->insert([
                    'case_id' => $child->case_id,
                    'first_name' => $child->first_name,
                    'middle_name' => $child->middle_name,
                    'last_name' => $child->last_name,
                    'gender' => $child->gender,
                    // Victims table allows null DOB, but child requires it.
                    'date_of_birth' => $child->date_of_birth,
                    // Preserve child address in both fields for compatibility
                    'address' => $child->current_address,
                    'current_address' => $child->current_address,
                    'address_history' => $child->address_history,
                    'guardian_phone' => $child->guardian_phone,
                    'guardian_email' => $child->guardian_email,
                    'child_contact' => $child->child_contact,
                    'contact_number' => $child->child_contact,
                    'created_at' => $child->created_at ?? now(),
                    'updated_at' => $child->updated_at ?? now(),
                ]);
            }

            // 3) Drop children table (merged)
            Schema::drop('children');
        }
    }

    public function down(): void
    {
        // Recreate children table (minimal) - data cannot be perfectly restored.
        if (!Schema::hasTable('children')) {
            Schema::create('children', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('case_id')->nullable();
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

                $table->foreign('case_id')->references('id')->on('abuse_cases')->onDelete('cascade');
            });
        }

        // Make victims.case_id required again is risky; leave nullable.
    }
};
