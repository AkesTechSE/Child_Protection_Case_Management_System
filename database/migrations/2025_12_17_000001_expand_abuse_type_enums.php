<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const ABUSE_TYPES = [
        'sexual_abuse',
        'physical_abuse',
        'emotional_abuse',
        'psychological_abuse',
        'neglect',
        'exploitation',
        'abduction',
        'early_marriage',
        'child_labour',
        'trafficking',
        'abandonment',
        'forced_recruitment',
        'medical_neglect',
        'educational_neglect',
        'emotional_neglect',
        'other',
    ];

    private const ORIGINAL_ABUSE_TYPES = [
        'sexual_abuse',
        'physical_abuse',
        'emotional_abuse',
        'neglect',
        'exploitation',
        'other',
    ];

    private function enumSql(array $values): string
    {
        $quoted = array_map(fn ($v) => "'" . str_replace("'", "''", $v) . "'", $values);
        return 'ENUM(' . implode(',', $quoted) . ')';
    }

    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver !== 'mysql') {
            return;
        }

        $enum = $this->enumSql(self::ABUSE_TYPES);

        DB::statement("ALTER TABLE `abuse_cases` MODIFY `abuse_type` {$enum} NOT NULL DEFAULT 'other'");
        DB::statement("ALTER TABLE `incidents` MODIFY `abuse_type` {$enum} NOT NULL DEFAULT 'other'");
    }

    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver !== 'mysql') {
            return;
        }

        $allowedList = implode(",", array_map(fn ($v) => "'" . str_replace("'", "''", $v) . "'", self::ORIGINAL_ABUSE_TYPES));

        DB::statement("UPDATE `abuse_cases` SET `abuse_type`='other' WHERE `abuse_type` NOT IN ({$allowedList})");
        DB::statement("UPDATE `incidents` SET `abuse_type`='other' WHERE `abuse_type` NOT IN ({$allowedList})");

        $enum = $this->enumSql(self::ORIGINAL_ABUSE_TYPES);

        DB::statement("ALTER TABLE `abuse_cases` MODIFY `abuse_type` {$enum} NOT NULL DEFAULT 'other'");
        DB::statement("ALTER TABLE `incidents` MODIFY `abuse_type` {$enum} NOT NULL DEFAULT 'other'");
    }
};
