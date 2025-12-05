<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponse;

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "email" => "required|email",
            "password" => "required"
        ]);

        if ($validator->fails()) {
            return $this->errorResponse("Validation error", $validator->errors(), 422);
        }

        $credentials = $request->only("email", "password");

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken("auth_token")->plainTextToken;

            return $this->successResponse([
                "user" => $user,
                "token" => $token,
                "token_type" => "Bearer"
            ], "Login successful");
        }

        return $this->errorResponse("Invalid credentials", null, 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(null, "Logged out successfully");
    }

    public function profile(Request $request)
    {
        return $this->successResponse($request->user(), "Profile retrieved successfully");
    }
}
