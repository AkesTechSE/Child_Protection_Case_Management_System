<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Perpetrator;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PerpetratorController extends Controller
{
    use ApiResponse;

    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|min:2',
            'fan_number' => 'sometimes|string',
            'fin_number' => 'sometimes|string',
            'relationship' => 'sometimes|in:parent,stepparent,grandparent,relative,babysitter,teacher,stranger,other'
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', $validator->errors(), 422);
        }

        $user = Auth::user();
        $query = Perpetrator::with(['case']);

        if ($request->has('name') && $request->name) {
            $name = $request->name;
            $query->where(function ($q) use ($name) {
                $q->where('first_name', 'like', "%{$name}%")
                  ->orWhere('last_name', 'like', "%{$name}%")
                  ->orWhere('aliases', 'like', "%{$name}%");
            });
        }

        if ($request->has('fan_number') && $request->fan_number) {
            $query->where('fan_number', 'like', "%{$request->fan_number}%");
        }

        if ($request->has('fin_number') && $request->fin_number) {
            $query->where('fin_number', 'like', "%{$request->fin_number}%");
        }

        if ($request->has('relationship')) {
            $query->where('relationship_to_child', $request->relationship);
        }

        if ($user->role === 'focal_person') {
            $query->whereHas('case', function ($q) use ($user) {
                $q->where('reported_by', $user->id);
            });
        }

        $perPage = $request->per_page ?? 20;
        $results = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return $this->successResponse($results, 'Perpetrators search results');
    }
}
