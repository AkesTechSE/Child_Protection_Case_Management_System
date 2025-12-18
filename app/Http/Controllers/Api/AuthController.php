<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required','email'],
            'password' => ['required']
        ]);

        $user = User::where('email', $data['email'])->first();
        if (! $user || ! Hash::check($data['password'], $user->password)) {
            // Return a generic error message without indicating which field failed
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        if (! $user->is_active) {
            // Do not reveal account status details to anonymous actors
            return response()->json(['message' => 'Access denied'], 403);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user->only(['id','name','email','role']),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => ['sometimes','string','max:255'],
            'email' => ['sometimes','email','max:255','unique:users,email,'.$user->id],
        ]);
        $user->update($data);
        return response()->json($user);
    }

    public function changePassword(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'current_password' => ['required'],
            'new_password' => ['required','min:8','confirmed'],
        ]);

        if (! \Hash::check($data['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password incorrect'], 422);
        }

        // Update password and invalidate existing tokens so old credentials/tokens cannot be reused
        $user->forceFill([
            'password' => Hash::make($data['new_password']),
        ])->save();

        // Revoke all tokens (including current) to enforce re-login with the new password
        $user->tokens()->delete();

        return response()->json(['message' => 'Password changed. Please log in again with your new password.']);
    }
}
