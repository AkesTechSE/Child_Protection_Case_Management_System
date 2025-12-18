<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $users = User::all()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_active' => $user->is_active,
                'phone_number' => $user->phone_number,
                'department' => $user->department,
                'position' => $user->position,
                'created_at' => $user->created_at->format('Y-m-d H:i'),
            ];
        });

        return $this->successResponse($users, 'Users retrieved successfully');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:system_admin,director,focal_person',
            'phone_number' => 'nullable|string|max:20',
            'department' => 'nullable|string|max:100',
            'position' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', $validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'phone_number' => $request->phone_number,
            'department' => $request->department,
            'position' => $request->position,
            'is_active' => true,
        ]);

        return $this->successResponse([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_active' => $user->is_active,
        ], 'User created successfully');
    }

    public function show($id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return $this->errorResponse('User not found', null, 404);
        }

        return $this->successResponse([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_active' => $user->is_active,
            'phone_number' => $user->phone_number,
            'address' => $user->address,
            'department' => $user->department,
            'position' => $user->position,
            'profile_image' => $user->profile_image,
            'created_at' => $user->created_at->format('Y-m-d H:i'),
        ], 'User retrieved successfully');
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return $this->errorResponse('User not found', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'role' => 'sometimes|in:system_admin,director,focal_person',
            'is_active' => 'sometimes|boolean',
            'phone_number' => 'nullable|string|max:20',
            'department' => 'nullable|string|max:100',
            'position' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation error', $validator->errors(), 422);
        }

        $user->update($request->only(['name', 'email', 'role', 'is_active', 'phone_number', 'department', 'position']));

        return $this->successResponse([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_active' => $user->is_active,
        ], 'User updated successfully');
    }

    public function destroy($id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return $this->errorResponse('User not found', null, 404);
        }

        // Prevent self-deletion
        if ($user->id === auth()->id()) {
            return $this->errorResponse('Cannot delete your own account', null, 403);
        }

        $user->delete();

        return $this->successResponse(null, 'User deleted successfully');
    }

    public function getRoles()
    {
        $roles = [
            ['value' => 'system_admin', 'label' => 'System Administrator'],
            ['value' => 'director', 'label' => 'Director'],
            ['value' => 'focal_person', 'label' => 'Focal Person'],
        ];

        return $this->successResponse($roles, 'Roles retrieved successfully');
    }
}