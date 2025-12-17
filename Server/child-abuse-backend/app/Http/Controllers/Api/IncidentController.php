<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use App\Models\AbuseCase;

class IncidentController extends Controller
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

    public function index(Request $request)
    {
        $query = Incident::with(['case:id,case_number,case_title']);

        if ($request->filled('case_id')) {
            $query->where('case_id', $request->case_id);
        }

        if ($request->filled('abuse_type')) {
            $query->where('abuse_type', $request->abuse_type);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('location', 'like', "%{$search}%")
                  ->orWhere('detailed_description', 'like', "%{$search}%");
            });
        }

        $incidents = $query->orderBy('incident_datetime', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json($incidents);
    }

    public function show($id)
    {
        $incident = Incident::with(['case:id,case_number,case_title,status'])->find($id);

        if (!$incident) {
            return response()->json(['message' => 'Incident not found'], 404);
        }

        return response()->json($incident);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'case_id' => 'required|exists:abuse_cases,id',
            'report_datetime' => 'required|date',
            'incident_datetime' => 'required|date',
            'incident_end_datetime' => 'nullable|date|after_or_equal:incident_datetime',
            'location' => 'required|string|max:255',
            'location_type' => [
                'required',
                Rule::in(['home', 'school', 'online', 'public_place', 'other'])
            ],
            'abuse_type' => [
                'required',
                Rule::in(self::ABUSE_TYPES)
            ],
            'detailed_description' => 'required|string',
            'prior_reports_count' => 'integer|min:0|max:100',
            'evidence_files.*' => 'file|max:10240', // 10MB
        ]);

        $incident = Incident::create($validated);

        $uploadedFiles = [];
        if ($request->hasFile('evidence_files')) {
            foreach ($request->file('evidence_files') as $file) {
                $filename = time() . "_" . uniqid() . "_" . preg_replace('/[^A-Za-z0-9\-_.]/', '', $file->getClientOriginalName());
                $path = $file->storeAs("incidents/{$incident->id}", $filename, 'private');
                $uploadedFiles[] = [
                    'filename' => $filename,
                    'original_name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'uploaded_at' => now()->toDateTimeString()
                ];
            }
        }

        if (!empty($uploadedFiles)) {
            $incident->evidence_files = $uploadedFiles;
            $incident->save();
        }

        // Update case abuse type if different
        $case = AbuseCase::find($validated['case_id']);
        if ($case && $case->abuse_type !== $validated['abuse_type']) {
            $case->abuse_type = $validated['abuse_type'];
            $case->save();
        }

        return response()->json([
            'message' => 'Incident created successfully',
            'data' => $incident->load('case:id,case_number,case_title')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $incident = Incident::find($id);
        if (!$incident) return response()->json(['message' => 'Incident not found'], 404);

        $validated = $request->validate([
            'case_id' => 'sometimes|exists:abuse_cases,id',
            'report_datetime' => 'sometimes|date',
            'incident_datetime' => 'sometimes|date',
            'incident_end_datetime' => 'nullable|date|after_or_equal:incident_datetime',
            'location' => 'sometimes|required|string|max:255',
            'location_type' => [
                'sometimes',
                Rule::in(['home', 'school', 'online', 'public_place', 'other'])
            ],
            'abuse_type' => [
                'sometimes',
                Rule::in(self::ABUSE_TYPES)
            ],
            'detailed_description' => 'sometimes|string',
            'prior_reports_count' => 'nullable|integer|min:0|max:100',
            'evidence_files.*' => 'file|max:10240', // 10MB
        ]);

        $incident->update($validated);

        // Allow adding evidence files during update (multipart)
        if ($request->hasFile('evidence_files')) {
            $uploaded = [];
            $existing = $incident->evidence_files ?? [];

            foreach ($request->file('evidence_files') as $file) {
                $filename = time() . "_" . uniqid() . "_" . preg_replace('/[^A-Za-z0-9\-_.]/', '', $file->getClientOriginalName());
                $file->storeAs("incidents/{$id}", $filename, 'private');
                $uploaded[] = [
                    'filename' => $filename,
                    'original_name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'uploaded_at' => now()->toDateTimeString()
                ];
            }

            $incident->evidence_files = array_merge($existing, $uploaded);
            $incident->save();
        }

        return response()->json([
            'message' => 'Incident updated successfully',
            'data' => $incident->load('case:id,case_number,case_title')
        ]);
    }

    public function uploadAttachments(Request $request, $id)
    {
        $incident = Incident::find($id);
        if (!$incident) {
            return response()->json(['message' => 'Incident not found'], 404);
        }

        $request->validate([
            'evidence_files.*' => 'required|file|max:10240',
        ]);

        $uploaded = [];
        $existing = $incident->evidence_files ?? [];

        foreach ($request->file('evidence_files') as $file) {
            $filename = time() . "_" . uniqid() . "_" . preg_replace('/[^A-Za-z0-9\-_.]/', '', $file->getClientOriginalName());
            $file->storeAs("incidents/{$id}", $filename, 'private');
            $uploaded[] = [
                'filename' => $filename,
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'uploaded_at' => now()->toDateTimeString()
            ];
        }

        $incident->evidence_files = array_merge($existing, $uploaded);
        $incident->save();

        return response()->json([
            'message' => 'Files uploaded successfully',
            'uploaded' => $uploaded,
            'total_files' => count($incident->evidence_files)
        ]);
    }

    public function removeAttachment(Request $request, $id)
    {
        $incident = Incident::find($id);
        if (!$incident) return response()->json(['message' => 'Incident not found'], 404);

        $request->validate(['filename' => 'required|string']);

        $filename = $request->filename;

        // Remove from array
        $filteredFiles = [];
        foreach (($incident->evidence_files ?? []) as $file) {
            if (is_array($file) && $file['filename'] !== $filename) {
                $filteredFiles[] = $file;
            } elseif (is_string($file) && $file !== $filename) {
                $filteredFiles[] = $file;
            }
        }

        $incident->evidence_files = $filteredFiles;
        $incident->save();

        // Delete physical file
        $path = "incidents/{$id}/{$filename}";
        if (Storage::disk('private')->exists($path)) {
            Storage::disk('private')->delete($path);
        }

        return response()->json([
            'message' => 'File removed successfully',
            'remaining_files' => count($filteredFiles)
        ]);
    }

    public function downloadAttachment(Request $request, $id)
    {
        $request->validate(['filename' => 'required|string']);

        $filename = $request->filename;
        $path = "incidents/{$id}/{$filename}";

        if (!Storage::disk('private')->exists($path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return Storage::disk('private')->download($path);
    }

    public function getAttachments($id)
    {
        $incident = Incident::find($id);
        if (!$incident) return response()->json(['message' => 'Incident not found'], 404);

        return response()->json([
            'incident_id' => $incident->id,
            'files' => $incident->evidence_files ?? []
        ]);
    }

    public function destroy($id)
    {
        $incident = Incident::find($id);

        if (!$incident) {
            return response()->json(['message' => 'Incident not found'], 404);
        }

        // Delete folder containing evidence files
        Storage::disk('private')->deleteDirectory("incidents/{$id}");

        $incident->delete();

        return response()->json(['message' => 'Incident deleted successfully']);
    }

    public function getCaseIncidents($caseId)
    {
        $incidents = Incident::where('case_id', $caseId)
            ->orderBy('incident_datetime', 'desc')
            ->get();

        return response()->json($incidents);
    }
}