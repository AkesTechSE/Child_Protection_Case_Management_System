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

    public function search(Request \)
    {
        \ = Validator::make(\->all(), [
            'name' => 'sometimes|string|min:2',
            'fan_number' => 'sometimes|string',
            'fin_number' => 'sometimes|string',
            'relationship' => 'sometimes|in:parent,stepparent,grandparent,relative,babysitter,teacher,stranger,other'
        ]);

        if (\->fails()) {
            return \->validationError(\->errors());
        }

        \ = Auth::user();
        \ = Perpetrator::with(['case']);

        // Name search
        if (\->has('name') && \->name) {
            \ = \->name;
            \->where(function(\) use (\) {
                \->where('first_name', 'like', \"%{\}%\")
                  ->orWhere('last_name', 'like', \"%{\}%\")
                  ->orWhere('aliases', 'like', \"%{\}%\");
            });
        }

        // FAN/FIN number search
        if (\->has('fan_number') && \->fan_number) {
            \->where('fan_number', 'like', \"%{\->fan_number}%\");
        }

        if (\->has('fin_number') && \->fin_number) {
            \->where('fin_number', 'like', \"%{\->fin_number}%\");
        }

        // Relationship filter
        if (\->has('relationship')) {
            \->where('relationship_to_child', \->relationship);
        }

        // For focal persons, only show perpetrators from their cases
        if (\->isFocalPerson()) {
            \->whereHas('case', function(\) use (\) {
                \->where('reported_by', \->id);
            });
        }

        \ = \->per_page ?? 20;
        \ = \->orderBy('created_at', 'desc')->paginate(\);

        return \->success(\, 'Perpetrators search results');
    }
}
