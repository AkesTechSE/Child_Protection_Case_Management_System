<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AbuseCase;
use App\Models\Perpetrator;
use App\Models\CaseNote;
use App\Models\CaseHistory;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class CaseController extends Controller
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

    // list / filter / paginate
    public function index(Request $request)
    {
        $query = AbuseCase::query()->with(['assignedTo:id,name,email']);

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }
        if ($request->filled('abuse_type')) {
            $query->where('abuse_type', $request->input('abuse_type'));
        }
        if ($request->filled('assigned_to')) {
            $query->where('assigned_to', $request->input('assigned_to'));
        }
        if ($request->filled('search')) {
            $s = $request->input('search');
            $query->where(function($q) use ($s) {
                $q->where('case_title', 'like', "%{$s}%")
                  ->orWhere('case_number', 'like', "%{$s}%")
                  ->orWhere('case_description', 'like', "%{$s}%");
            });
        }

        $perPage = $request->input('per_page', 15);
        $cases = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($cases);
    }

    public function store(Request $request)
    {
        $rules = [
            'case_number' => ['nullable', 'string', 'max:255', 'unique:abuse_cases,case_number'],
            'case_title' => ['required','string','max:255'],
            'case_description' => ['nullable','string'],
            'abuse_type' => ['required', Rule::in(self::ABUSE_TYPES)],
            'priority' => ['sometimes', Rule::in(['low','medium','high','critical'])],
            'severity' => ['sometimes', Rule::in(['low','medium','high','critical'])],
            'location' => ['nullable','string'],
            'incident_date' => ['nullable','date'],
            // Merged incident fields (1 incident per case)
            'report_datetime' => ['nullable','date'],
            'incident_datetime' => ['nullable','date'],
            'incident_end_datetime' => ['nullable','date','after_or_equal:incident_datetime'],
            'location_type' => ['nullable', Rule::in(['home', 'school', 'online', 'public_place', 'other'])],
            'detailed_description' => ['nullable','string'],
            'prior_reports_count' => ['nullable','integer','min:0','max:100'],
            'status' => ['sometimes', Rule::in(['reported','assigned','under_investigation','investigation','resolved','closed','reopened'])],
            'assigned_to' => ['nullable','exists:users,id'],
            'additional_info' => ['nullable','array'],
            'perpetrator_ids' => ['nullable','array'],
            'perpetrator_ids.*' => ['integer','exists:perpetrators,id'],
        ];

        $data = $request->validate($rules);

        // Generate unique case number if not provided
        if (empty($data['case_number'])) {
            $attempts = 0;
            do {
                $attempts++;
                $candidate = 'C-' . strtoupper(Str::random(8));
            } while ($attempts < 5 && AbuseCase::where('case_number', $candidate)->exists());

            $data['case_number'] = $candidate;
        }

        try {
            $case = AbuseCase::create($data);
        } catch (QueryException $e) {
            // MySQL duplicate key error: 1062 (SQLSTATE 23000)
            $driverErrorCode = $e->errorInfo[1] ?? null;
            if ($driverErrorCode === 1062) {
                return response()->json([
                    'message' => 'Case number already exists. Please use a different case number.',
                ], 409);
            }

            throw $e;
        }

        // attach perpetrators if present
        if (!empty($data['perpetrator_ids'])) {
            $case->perpetrators()->sync($data['perpetrator_ids']);
        }

        // create history
        CaseHistory::create([
            'case_id' => $case->id,
            'user_id' => $request->user()->id,
            'action' => 'created',
            'description' => 'Case created',
            'changes' => $case->toArray(),
        ]);

        return response()->json($case, 201);
    }

    public function show($id)
    {
        $case = AbuseCase::with(['victims','perpetrators','notes.user','assignedTo'])->findOrFail($id);
        return response()->json($case);
    }

    public function update(Request $request, $id)
    {
        $case = AbuseCase::findOrFail($id);

        $rules = [
            'case_title' => ['sometimes','string','max:255'],
            'case_description' => ['nullable','string'],
            'abuse_type' => [Rule::in(self::ABUSE_TYPES)],
            'priority' => [Rule::in(['low','medium','high','critical'])],
            'severity' => [Rule::in(['low','medium','high','critical'])],
            'location' => ['nullable','string'],
            'incident_date' => ['nullable','date'],
            // Merged incident fields (1 incident per case)
            'report_datetime' => ['nullable','date'],
            'incident_datetime' => ['nullable','date'],
            'incident_end_datetime' => ['nullable','date','after_or_equal:incident_datetime'],
            'location_type' => ['nullable', Rule::in(['home', 'school', 'online', 'public_place', 'other'])],
            'detailed_description' => ['nullable','string'],
            'prior_reports_count' => ['nullable','integer','min:0','max:100'],
            'status' => [Rule::in(['reported','assigned','under_investigation','investigation','resolved','closed','reopened'])],
            'assigned_to' => ['nullable','exists:users,id'],
            'resolution_details' => ['nullable','string'],
            'additional_info' => ['nullable','array'],
            'perpetrator_ids' => ['nullable','array'],
            'perpetrator_ids.*' => ['integer','exists:perpetrators,id'],
        ];

        $data = $request->validate($rules);

        $before = $case->getChanges();
        $case->update($data);

        if (array_key_exists('perpetrator_ids', $data)) {
            $case->perpetrators()->sync($data['perpetrator_ids'] ?? []);
        }

        CaseHistory::create([
            'case_id' => $case->id,
            'user_id' => $request->user()->id,
            'action' => 'updated',
            'description' => 'Case updated',
            'changes' => $case->getChanges(),
        ]);

        return response()->json($case);
    }

    public function destroy(Request $request, $id)
    {
        $case = AbuseCase::findOrFail($id);

        // AbuseCase uses SoftDeletes + case_number has a unique index.
        // If we only soft-delete, the old record still holds the case_number and prevents reuse.
        // So we first "release" the case_number by changing it to a unique archived value,
        // then soft-delete.
        DB::transaction(function () use ($case) {
            $original = $case->case_number;
            $released = $original
                ? ($original . '__deleted__' . $case->id . '__' . now()->format('YmdHis'))
                : ('DELETED__' . $case->id . '__' . now()->format('YmdHis'));

            $case->case_number = $released;
            $case->save();

            $case->delete();
        });

        CaseHistory::create([
            'case_id' => $id,
            'user_id' => $request->user()->id,
            'action' => 'deleted',
            'description' => 'Case deleted',
        ]);

        return response()->json(['message' => 'Deleted']);
    }

    public function stats($id)
    {
        $case = AbuseCase::withCount(['victims','perpetrators'])->findOrFail($id);
        return response()->json([
            'id' => $case->id,
            'case_number' => $case->case_number,
            'victims_count' => $case->victims_count,
            'perpetrators_count' => $case->perpetrators_count,
            'has_incident' => !empty($case->incident_datetime) || !empty($case->incident_date),
        ]);
    }

    // Notes
    public function getNotes($id)
    {
        $case = AbuseCase::findOrFail($id);
        $notes = $case->notes()->with('user:id,name')->orderBy('created_at','desc')->get();
        return response()->json($notes);
    }

    public function addNote(Request $request, $id)
    {
        $case = AbuseCase::findOrFail($id);

        $data = $request->validate([
            'content' => ['required','string'],
            'note_type' => ['nullable','string'],
            'is_private' => ['nullable','boolean'],
        ]);

        $note = CaseNote::create([
            'case_id' => $case->id,
            'user_id' => $request->user()->id,
            'content' => $data['content'],
            'note_type' => $data['note_type'] ?? 'general',
            'is_private' => $data['is_private'] ?? false,
        ]);

        CaseHistory::create([
            'case_id' => $case->id,
            'user_id' => $request->user()->id,
            'action' => 'note_added',
            'description' => 'Note added',
            'changes' => ['note_id' => $note->id],
        ]);

        return response()->json($note, 201);
    }

    public function deleteNote(Request $request, $caseId, $noteId)
    {
        $note = CaseNote::where('case_id', $caseId)->where('id', $noteId)->firstOrFail();
        $this->authorizeNoteDeletion($request->user(), $note); // small internal check
        $note->delete();

        CaseHistory::create([
            'case_id' => $caseId,
            'user_id' => $request->user()->id,
            'action' => 'note_deleted',
            'description' => 'Note deleted',
            'changes' => ['note_id' => $noteId],
        ]);

        return response()->json(['message' => 'Note deleted']);
    }

    // Evidence attachments (merged from incidents)
    public function getAttachments($id)
    {
        $case = AbuseCase::findOrFail($id);

        return response()->json([
            'case_id' => $case->id,
            'files' => $case->evidence_files ?? [],
        ]);
    }

    public function uploadAttachments(Request $request, $id)
    {
        $case = AbuseCase::findOrFail($id);

        $request->validate([
            'evidence_files.*' => 'required|file|max:10240',
        ]);

        $uploaded = [];
        $existing = $case->evidence_files ?? [];

        foreach ($request->file('evidence_files', []) as $file) {
            $filename = time() . '_' . uniqid() . '_' . preg_replace('/[^A-Za-z0-9\-_.]/', '', $file->getClientOriginalName());
            $file->storeAs("cases/{$id}", $filename, 'private');
            $uploaded[] = [
                'filename' => $filename,
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'uploaded_at' => now()->toDateTimeString(),
            ];
        }

        $case->evidence_files = array_merge($existing, $uploaded);
        $case->save();

        return response()->json([
            'message' => 'Files uploaded successfully',
            'uploaded' => $uploaded,
            'total_files' => count($case->evidence_files),
        ]);
    }

    public function removeAttachment(Request $request, $id)
    {
        $case = AbuseCase::findOrFail($id);

        $request->validate(['filename' => 'required|string']);
        $filename = $request->filename;

        $filteredFiles = [];
        foreach (($case->evidence_files ?? []) as $file) {
            if (is_array($file) && ($file['filename'] ?? null) !== $filename) {
                $filteredFiles[] = $file;
            } elseif (is_string($file) && $file !== $filename) {
                $filteredFiles[] = $file;
            }
        }

        $case->evidence_files = $filteredFiles;
        $case->save();

        $path = "cases/{$id}/{$filename}";
        if (Storage::disk('private')->exists($path)) {
            Storage::disk('private')->delete($path);
        }

        return response()->json([
            'message' => 'File removed successfully',
            'remaining_files' => count($filteredFiles),
        ]);
    }

    public function downloadAttachment(Request $request, $id)
    {
        $request->validate(['filename' => 'required|string']);
        $filename = $request->filename;
        $path = "cases/{$id}/{$filename}";

        if (!Storage::disk('private')->exists($path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return Storage::disk('private')->download($path);
    }

    protected function authorizeNoteDeletion($user, $note)
    {
        // Basic rule: note owner or system_admin can delete
        if ($user->id !== $note->user_id && $user->role !== 'system_admin') {
            abort(403, 'Forbidden');
        }
    }
}
