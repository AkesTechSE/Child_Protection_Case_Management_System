<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Perpetrator;

class PerpetratorController extends Controller
{
    public function index(Request $request)
    {
        $query = Perpetrator::query()->with([
            'cases:id,case_number,case_title,abuse_type',
            'cases.victims:id,case_id,first_name,last_name',
        ]);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function($q) use ($s) {
                $q->where('first_name','like',"%{$s}%")
                  ->orWhere('last_name','like',"%{$s}%")
                  ->orWhere('contact_number','like',"%{$s}%");
            });
        }

        $perpetrators = $query->orderBy('created_at','desc')->paginate($request->input('per_page', 15));

        return response()->json($perpetrators);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => ['required','string'],
            'last_name' => ['required','string'],
            'gender' => ['required'],
            'age' => ['nullable','integer'],
            'date_of_birth' => ['nullable','date'],
            'contact_number' => ['nullable','string'],
            'address' => ['nullable','string'],
            'region' => ['nullable','string'],
            'occupation' => ['nullable','string'],
            'relationship_to_victim' => ['nullable','string'],
            'fan_number' => ['nullable','string','max:50'],
            'fin_number' => ['nullable','string','max:50'],
            'previous_records' => ['nullable','boolean'],
            'description' => ['nullable','string'],
            'additional_info' => ['nullable','array'],

            // Optional linking to cases via pivot
            'case_id' => ['nullable','integer','exists:abuse_cases,id'],
            'case_ids' => ['nullable','array'],
            'case_ids.*' => ['integer','exists:abuse_cases,id'],
        ]);

        // Avoid mass-assigning non-column attributes (pivot links)
        $caseId = $data['case_id'] ?? $request->input('case_id');
        $caseIds = $data['case_ids'] ?? $request->input('case_ids');
        unset($data['case_id'], $data['case_ids']);

        $perp = Perpetrator::create($data);

        if (is_array($caseIds) && count($caseIds) > 0) {
            $perp->cases()->sync($caseIds);
        } elseif (!empty($caseId)) {
            $perp->cases()->sync([(int) $caseId]);
        }

        return response()->json(
            $perp->load(['cases:id,case_number,case_title,abuse_type', 'cases.victims:id,case_id,first_name,last_name']),
            201
        );
    }

    public function show($id)
    {
        $perp = Perpetrator::with([
            'cases:id,case_number,case_title,abuse_type',
            'cases.victims:id,case_id,first_name,last_name',
        ])->findOrFail($id);
        return response()->json($perp);
    }

    public function update(Request $request, $id)
    {
        $perp = Perpetrator::findOrFail($id);
        $data = $request->validate([
            'first_name' => ['sometimes','string'],
            'last_name' => ['sometimes','string'],
            'gender' => ['sometimes'],
            'age' => ['nullable','integer'],
            'date_of_birth' => ['nullable','date'],
            'contact_number' => ['nullable','string'],
            'address' => ['nullable','string'],
            'region' => ['nullable','string'],
            'occupation' => ['nullable','string'],
            'relationship_to_victim' => ['nullable','string'],
            'fan_number' => ['nullable','string','max:50'],
            'fin_number' => ['nullable','string','max:50'],
            'previous_records' => ['nullable','boolean'],
            'description' => ['nullable','string'],
            'additional_info' => ['nullable','array'],

            // Optional linking to cases via pivot
            'case_id' => ['nullable','integer','exists:abuse_cases,id'],
            'case_ids' => ['nullable','array'],
            'case_ids.*' => ['integer','exists:abuse_cases,id'],
        ]);

        // Avoid mass-assigning non-column attributes (pivot links)
        $caseId = $data['case_id'] ?? $request->input('case_id');
        $caseIds = $data['case_ids'] ?? $request->input('case_ids');
        unset($data['case_id'], $data['case_ids']);

        $perp->update($data);

        // Sync cases if provided
        if ($request->has('case_ids') && is_array($caseIds)) {
            $perp->cases()->sync($caseIds);
        } elseif ($request->has('case_id')) {
            if (!empty($caseId)) {
                $perp->cases()->sync([(int) $caseId]);
            } else {
                $perp->cases()->detach();
            }
        }

        return response()->json($perp->load(['cases:id,case_number,case_title,abuse_type', 'cases.victims:id,case_id,first_name,last_name']));
    }

    public function destroy($id)
    {
        $perp = Perpetrator::findOrFail($id);
        $perp->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function search(Request $request)
    {
        return $this->index($request);
    }
}
