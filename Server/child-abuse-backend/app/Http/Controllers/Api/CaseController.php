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
        $cases = AbuseCase::with(['victim', 'perpetrator', 'reporter'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return $this->successResponse($cases, "Cases retrieved successfully");
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "victim_id" => "required|exists:victims,id",
            "perpetrator_id" => "nullable|exists:perpetrators,id",
            "reporter_id" => "required|exists:reporters,id",
            "case_type" => "required|string",
            "severity" => "required|in:low,medium,high,critical",
            "status" => "required|in:open,investigating,closed,resolved",
            "description" => "required|string",
            "location" => "required|string",
            "incident_date" => "required|date"
        ]);

        if ($validator->fails()) {
            return $this->errorResponse("Validation error", $validator->errors(), 422);
        }

        $case = AbuseCase::create($request->all());

        return $this->successResponse($case, "Case created successfully", 201);
    }

    public function update(Request $request, $id)
    {
        $case = AbuseCase::find($id);

        if (!$case) {
            return $this->errorResponse("Case not found", null, 404);
        }

        $validator = Validator::make($request->all(), [
            "case_type" => "sometimes|required|string",
            "severity" => "sometimes|required|in:low,medium,high,critical",
            "status" => "sometimes|required|in:open,investigating,closed,resolved",
            "description" => "sometimes|required|string"
        ]);

        if ($validator->fails()) {
            return $this->errorResponse("Validation error", $validator->errors(), 422);
        }

        $case->update($request->all());

        return $this->successResponse($case, "Case updated successfully");
    }

    public function destroy($id)
    {
        $case = AbuseCase::find($id);

        if (!$case) {
            return $this->errorResponse("Case not found", null, 404);
        }

        $case->delete();

        return $this->successResponse(null, "Case deleted successfully");
    }

    public function addNote(Request $request, $id)
    {
        $case = AbuseCase::find($id);

        if (!$case) {
            return $this->errorResponse("Case not found", null, 404);
        }

        $validator = Validator::make($request->all(), [
            "note" => "required|string",
            "note_type" => "required|in:investigation,medical,legal,psychological,other"
        ]);

        if ($validator->fails()) {
            return $this->errorResponse("Validation error", $validator->errors(), 422);
        }

        // Assuming you have a CaseNote model
        $note = $case->notes()->create([
            "user_id" => $request->user()->id,
            "note" => $request->note,
            "note_type" => $request->note_type
        ]);

        return $this->successResponse($note, "Note added successfully", 201);
    }
}
