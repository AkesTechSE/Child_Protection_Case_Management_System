<?php

namespace App\Console\Commands;

use App\Models\AbuseCase;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class ReleaseDeletedCaseNumbers extends Command
{
    protected $signature = 'cases:release-deleted-numbers {--dry-run : Show changes without writing to DB}';

    protected $description = 'Renames case_number for soft-deleted cases to free the original numbers for reuse.';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');

        $cases = AbuseCase::onlyTrashed()
            ->whereNotNull('case_number')
            ->get(['id', 'case_number', 'deleted_at']);

        if ($cases->isEmpty()) {
            $this->info('No soft-deleted cases found.');
            return Command::SUCCESS;
        }

        $updated = 0;
        foreach ($cases as $case) {
            $current = (string) $case->case_number;

            // Skip already-released numbers.
            if (Str::contains($current, '__deleted__')) {
                continue;
            }

            $suffix = $case->deleted_at
                ? $case->deleted_at->format('YmdHis')
                : now()->format('YmdHis');

            $newNumber = $current . '__deleted__' . $case->id . '__' . $suffix;

            if ($dryRun) {
                $this->line("[dry-run] {$case->id}: {$current} -> {$newNumber}");
                continue;
            }

            $case->case_number = $newNumber;
            $case->save();
            $updated++;
        }

        if ($dryRun) {
            $this->info('Dry run complete.');
            return Command::SUCCESS;
        }

        $this->info("Released case numbers for {$updated} soft-deleted case(s).");
        return Command::SUCCESS;
    }
}
