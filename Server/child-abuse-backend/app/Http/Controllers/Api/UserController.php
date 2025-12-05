<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    use ApiResponse;

    public function index(Request \)
    {
        \ = Auth::user();
        
        // Only system admin can view all users
        if (!\->isSystemAdmin()) {
            return \->forbidden('Only system administrators can view users');
        }

        \ = User::query();

        if (\->has('role')) {
            \->where('role', \->role);
        }

        if (\->has('is_active')) {
            \->where('is_active', \->is_active);
        }

        \ = \->per_page ?? 20;
        \ = \->orderBy('created_at', 'desc')->paginate(\);

        return \->success(\, 'Users retrieved successfully');
    }

    public function store(Request \)
    {
        \ = Auth::user();
        
        // Only system admin can create users
        if (!\->isSystemAdmin()) {
            return \->forbidden('Only system administrators can create users');
        }

        \ = Validator::make(\->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:system_admin,director,focal_person'
        ]);

        if (\->fails()) {
            return \->validationError(\->errors());
        }

        \ = User::create([
            'name' => \->name,
            'email' => \->email,
            'password' => Hash::make(\->password),
            'role' => \->role,
            'is_active' => true
        ]);

        return \->success(\, 'User created successfully', 201);
    }

    public function show(\)
    {
        \ = Auth::user();
        
        // Only system admin can view user details
        if (!\->isSystemAdmin()) {
            return \->forbidden('Only system administrators can view user details');
        }

        \ = User::find(\);

        if (!\) {
            return \->notFound('User not found');
        }

        return \->success(\, 'User details retrieved');
    }

    public function update(Request \, \)
    {
        \ = Auth::user();
        
        // Only system admin can update users
        if (!\->isSystemAdmin()) {
            return \->forbidden('Only system administrators can update users');
        }

        \ = User::find(\);

        if (!\) {
            return \->notFound('User not found');
        }

        \ = Validator::make(\->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . \,
            'role' => 'sometimes|in:system_admin,director,focal_person',
            'is_active' => 'sometimes|boolean'
        ]);

        if (\->fails()) {
            return \->validationError(\->errors());
        }

        \->update(\->only(['name', 'email', 'role', 'is_active']));

        return \->success(\, 'User updated successfully');
    }

    public function destroy(\)
    {
        \ = Auth::user();
        
        // Only system admin can delete users
        if (!\->isSystemAdmin()) {
            return \->forbidden('Only system administrators can delete users');
        }

        \ = User::find(\);

        if (!\) {
            return \->notFound('User not found');
        }

        // Don't allow self-deletion
        if (\->id === \->id) {
            return \->error('Cannot delete your own account', 400);
        }

        \->delete();

        return \->success(null, 'User deleted successfully');
    }

    public function toggleStatus(\)
    {
        \ = Auth::user();
        
        // Only system admin can toggle user status
        if (!\->isSystemAdmin()) {
            return \->forbidden('Only system administrators can toggle user status');
        }

        \ = User::find(\);

        if (!\) {
            return \->notFound('User not found');
        }

        // Don't allow deactivating self
        if (\->id === \->id) {
            return \->error('Cannot deactivate your own account', 400);
        }

        \->is_active = !\->is_active;
        \->save();

        \ = \->is_active ? 'activated' : 'deactivated';

        return \->success(\, \"User {\} successfully\");
    }
}
