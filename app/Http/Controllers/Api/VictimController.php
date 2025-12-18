<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Victim;

class VictimController extends Controller
{
    private function normalizeAdditionalInfo($value)
    {
        if ($value === null) return null;

        if (is_array($value)) return $value;

        // Laravel may give stdClass for decoded JSON in some cases
        if (is_object($value)) return (array) $value;

        if (is_string($value)) {
            $trimmed = trim($value);
            if ($trimmed === '') return null;

            $decoded = json_decode($trimmed, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return $decoded;
            }

            return ['notes' => $trimmed];
        }

        return null;
    }

    public function index(Request $request)
    {
        $query = Victim::query()->with('case:id,case_number,case_title');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('first_name','like',"%{$s}%")
                  ->orWhere('last_name','like',"%{$s}%")
                  ->orWhere('contact_number','like',"%{$s}%");
            });
        }

        $victims = $query->orderBy('created_at','desc')->paginate($request->input('per_page', 15));
        return response()->json($victims);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'case_id' => ['required','exists:abuse_cases,id'],
            'first_name' => ['required','string'],
            'middle_name' => ['nullable','string'],
            'last_name' => ['required','string'],
            'gender' => ['required'],
            'age' => ['nullable','integer'],
            'date_of_birth' => ['nullable','date'],
            'contact_number' => ['nullable','string'],
            'child_contact' => ['nullable','string'],
            'address' => ['nullable','string'],
            'current_address' => ['nullable','string'],
            'address_history' => ['nullable','string'],
            'guardian_phone' => ['nullable','string'],
            'guardian_email' => ['nullable','email'],
            'relationship_to_perpetrator' => ['nullable','string'],
            'description' => ['nullable','string'],
            // Accept either array or string (JSON/text) from older clients.
            'additional_info' => ['nullable'],
        ]);

        if ($request->has('additional_info')) {
            $data['additional_info'] = $this->normalizeAdditionalInfo($request->input('additional_info'));
        }

        $victim = Victim::create($data);

        return response()->json($victim, 201);
    }

    public function show($id)
    {
        $victim = Victim::with('case')->findOrFail($id);
        return response()->json($victim);
    }

    public function update(Request $request, $id)
    {
        $victim = Victim::findOrFail($id);
        $data = $request->validate([
            'first_name' => ['sometimes','string'],
            'middle_name' => ['nullable','string'],
            'last_name' => ['sometimes','string'],
            'gender' => ['sometimes'],
            'age' => ['nullable','integer'],
            'date_of_birth' => ['nullable','date'],
            'contact_number' => ['nullable','string'],
            'child_contact' => ['nullable','string'],
            'address' => ['nullable','string'],
            'current_address' => ['nullable','string'],
            'address_history' => ['nullable','string'],
            'guardian_phone' => ['nullable','string'],
            'guardian_email' => ['nullable','email'],
            'relationship_to_perpetrator' => ['nullable','string'],
            'description' => ['nullable','string'],
            // Accept either array or string (JSON/text) from older clients.
            'additional_info' => ['nullable'],
        ]);

        if ($request->has('additional_info')) {
            $data['additional_info'] = $this->normalizeAdditionalInfo($request->input('additional_info'));
        }
        $victim->update($data);
        return response()->json($victim);
    }

    public function destroy($id)
    {
        $victim = Victim::findOrFail($id);
        $victim->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function search(Request $request)
    {
        return $this->index($request);
    }
}
