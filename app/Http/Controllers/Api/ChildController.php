<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Child;

class ChildController extends Controller
{
    public function index(Request $request)
    {
        $query = Child::with('case');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where('first_name','like',"%{$s}%")
                  ->orWhere('last_name','like',"%{$s}%");
        }

        $children = $query->paginate($request->input('per_page', 15));
        return response()->json($children);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'case_id' => ['nullable','exists:abuse_cases,id'],
            'first_name' => ['required','string'],
            'middle_name' => ['nullable','string'],
            'last_name' => ['required','string'],
            'date_of_birth' => ['required','date'],
            'gender' => ['required'],
            'current_address' => ['required','string'],
            'address_history' => ['nullable','string'],
            'guardian_phone' => ['nullable','string'],
            'guardian_email' => ['nullable','email'],
            'child_contact' => ['nullable','string'],
        ]);

        $child = Child::create($data);
        return response()->json($child, 201);
    }

    public function show($id)
    {
        $child = Child::with('case')->findOrFail($id);
        return response()->json($child);
    }

    public function update(Request $request, $id)
    {
        $child = Child::findOrFail($id);

        $data = $request->validate([
            'first_name' => ['sometimes','string'],
            'middle_name' => ['nullable','string'],
            'last_name' => ['sometimes','string'],
            'date_of_birth' => ['nullable','date'],
            'gender' => ['sometimes'],
            'current_address' => ['nullable','string'],
            'address_history' => ['nullable','string'],
            'guardian_phone' => ['nullable','string'],
            'guardian_email' => ['nullable','email'],
            'child_contact' => ['nullable','string'],
        ]);

        $child->update($data);
        return response()->json($child);
    }

    public function destroy($id)
    {
        $child = Child::findOrFail($id);
        $child->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
