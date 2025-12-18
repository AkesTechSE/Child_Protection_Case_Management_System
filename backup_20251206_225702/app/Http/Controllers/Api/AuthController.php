<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Login user and create personal access token
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "email" => "required|email",
            "password" => "required|string",
        ]);

        if ($validator->fails()) {
            return $this->errorResponse("Validation error", $validator->errors(), 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->errorResponse("Invalid credentials", null, 401);
        }

        // Check if user is active
        if (property_exists($user, 'is_active') && !$user->is_active) {
            return $this->errorResponse("Account is deactivated", null, 403);
        }

        // Create token
        $token = $user->createToken($request->input('device_name', 'api-token'))->plainTextToken;

        return $this->successResponse([
            "user" => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_active' => $user->is_active,
                'department' => $user->department,
                'position' => $user->position,
            ],
            "token" => $token,
            "token_type" => "Bearer",
        ], "Login successful");
    }

    /**
     * Logout user and revoke current token
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return $this->successResponse(null, "Logged out successfully");
    }

    /**
     * Get current user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user();

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
            'last_login_at' => $user->last_login_at,
            'created_at' => $user->created_at,
        ], "Profile retrieved successfully");
    }

    /**
     * Update profile details
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'phone_number' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:500',
            'department' => 'sometimes|string|max:255',
            'position' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse("Validation error", $validator->errors(), 422);
        }

        $user->update($request->only([
            'name', 'email', 'phone_number', 'address', 'department', 'position'
        ]));

        return $this->successResponse($user, "Profile updated successfully");
    }

    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse("Validation error", $validator->errors(), 422);
        }

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return $this->errorResponse("Current password is incorrect", null, 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return $this->successResponse(null, "Password changed successfully");
    }
}
