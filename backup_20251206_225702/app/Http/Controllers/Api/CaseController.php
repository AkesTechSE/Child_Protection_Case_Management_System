<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\AbuseCase;
use Illuminate\Support\Facades\Validator;

class CaseController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        try {
            $cases = AbuseCase::with(['reporter', 'assignee', 'victims', 'perpetrators'])
                ->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 15));

            return $this->successResponse($cases, 'Cases retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to retrieve cases', $e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'case_title' => 'required|string|max:255',
            'case_description' => 'nullable|string',
            'abuse_type' => 'required|in:sexual_abuse,physical_abuse,emotional_abuse,neglect,exploitation,other',
            'severity' => 'required|in:low,medium,high,critical',
            'priority' => 'required|in:low,medium,high,critical',
            'location' => 'nullable|string|max:255',
            'incident_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', $validator->errors(), 422);
        }

        try {
            // Generate case number
            $lastCase = AbuseCase::orderBy('id', 'desc')->first();
            $caseNumber = 'CASE-' . date('Y') . '-' . str_pad(($lastCase->id ?? 0) + 1, 4, '0', STR_PAD_LEFT);

            $case = AbuseCase::create([
                'case_number' => $caseNumber,
                'case_title' => $request->case_title,
                'case_description' => $request->case_description,
                'abuse_type' => $request->abuse_type,
                'status' => 'reported',
                'severity' => $request->severity,
                'priority' => $request->priority,
                'location' => $request->location,
                'incident_date' => $request->incident_date,
                'reporting_date' => now(),
                'reported_by' => auth()->id(),
                'assigned_to' => $request->assigned_to,
            ]);

            return $this->successResponse($case, 'Case created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create case', $e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $case = AbuseCase::with(['reporter', 'assignee', 'victims', 'perpetrators', 'notes', 'evidence'])
                ->findOrFail($id);

            return $this->successResponse($case, 'Case retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Case not found', null, 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'case_title' => 'sometimes|string|max:255',
            'case_description' => 'nullable|string',
            'abuse_type' => 'sometimes|in:sexual_abuse,physical_abuse,emotional_abuse,neglect,exploitation,other',
            'status' => 'sometimes|in:reported,assigned,investigation,resolved,closed',
            'severity' => 'sometimes|in:low,medium,high,critical',
            'priority' => 'sometimes|in:low,medium,high,critical',
            'location' => 'nullable|string|max:255',
            'assigned_to' => 'nullable|exists:users,id',
            'resolution_details' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', $validator->errors(), 422);
        }

        try {
            $case = AbuseCase::findOrFail($id);
            
            // Update status specific logic
            if ($request->has('status') && $request->status === 'resolved') {
                $request->merge(['resolution_date' => now()]);
            }

            $case->update($request->all());

            return $this->successResponse($case, 'Case updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update case', $e->getMessage(), 500);
        }
    }

    public function destroy($id)
    {
        try {
            $case = AbuseCase::findOrFail($id);
            $case->delete();

            return $this->successResponse(null, 'Case deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete case', $e->getMessage(), 500);
        }
    }

    public function addNote(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'note_type' => 'nullable|string|max:50',
            'is_private' => 'boolean',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', $validator->errors(), 422);
        }

        try {
            $case = AbuseCase::findOrFail($id);
            
            $note = $case->notes()->create([
                'user_id' => auth()->id(),
                'content' => $request->content,
                'note_type' => $request->note_type ?? 'general',
                'is_private' => $request->is_private ?? false,
            ]);

            return $this->successResponse($note, 'Note added successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to add note', $e->getMessage(), 500);
        }
    }
}