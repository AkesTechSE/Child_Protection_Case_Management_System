<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    private function isSystemOrAdmin(?User $actor): bool
    {
        return in_array($actor?->role, ['system_admin', 'admin'], true);
    }

    private function isDirector(?User $actor): bool
    {
        return $actor?->role === 'director';
    }

    private function forbidUnless(bool $condition)
    {
        if (!$condition) {
            abort(response()->json(['message' => 'Forbidden'], 403));
        }
    }

    public function index(Request $request)
    {
        $actor = $request->user();

        // Only system_admin/admin/director can access user management.
        $this->forbidUnless($this->isSystemOrAdmin($actor) || $this->isDirector($actor));

        $query = User::query();

        // Directors can only see focal persons (plus optionally themselves via /profile).
        if ($this->isDirector($actor)) {
            $query->where('role', 'focal_person');
        }

        if ($request->filled('role')) {
            // Directors are limited to focal_person regardless of requested filter.
            if (!$this->isDirector($actor)) {
                $query->where('role', $request->role);
            }
        }

        $users = $query->paginate($request->input('per_page', 15));
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $actor = $request->user();
        $this->forbidUnless($this->isSystemOrAdmin($actor) || $this->isDirector($actor));

        $data = $request->validate([
            'name' => ['required','string'],
            'email' => ['required','email','unique:users,email'],
            'password' => ['required','min:8','confirmed'],
            'role' => ['nullable', Rule::in(['system_admin','admin','director','focal_person'])],
        ]);

        // Directors can only create focal persons.
        if ($this->isDirector($actor)) {
            $data['role'] = 'focal_person';
        }

        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);

        return response()->json($user, 201);
    }

    public function show($id)
    {
        $actor = request()->user();
        $this->forbidUnless($this->isSystemOrAdmin($actor) || $this->isDirector($actor));

        $user = User::findOrFail($id);

        if ($this->isDirector($actor)) {
            $this->forbidUnless($user->role === 'focal_person');
        }

        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $actor = $request->user();
        $this->forbidUnless($this->isSystemOrAdmin($actor) || $this->isDirector($actor));

        $user = User::findOrFail($id);

        if ($this->isDirector($actor)) {
            $this->forbidUnless($user->role === 'focal_person');
        }

        $data = $request->validate([
            'name' => ['sometimes','string'],
            'email' => ['sometimes','email', Rule::unique('users','email')->ignore($user->id)],
            'role' => ['nullable', Rule::in(['system_admin','admin','director','focal_person'])],
            'is_active' => ['nullable','boolean'],
        ]);

        // Directors can only manage focal persons and cannot change role.
        if ($this->isDirector($actor)) {
            unset($data['role']);
        }

        // Prevent deleting or deactivating yourself via update.
        if ($actor && (int) $actor->id === (int) $user->id) {
            unset($data['is_active']);
            unset($data['role']);
        }

        $user->update($data);
        return response()->json($user);
    }

    public function destroy($id)
    {
        $actor = request()->user();
        $this->forbidUnless($this->isSystemOrAdmin($actor) || $this->isDirector($actor));

        $user = User::findOrFail($id);

        if ($actor && (int) $actor->id === (int) $user->id) {
            return response()->json(['message' => 'You cannot delete your own account'], 422);
        }

        if ($this->isDirector($actor)) {
            $this->forbidUnless($user->role === 'focal_person');
        }

        $user->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function getRoles()
    {
        $actor = request()->user();
        $this->forbidUnless($this->isSystemOrAdmin($actor) || $this->isDirector($actor));

        // Directors can only assign focal_person.
        if ($this->isDirector($actor)) {
            return response()->json(['roles' => ['focal_person']]);
        }

        return response()->json([
            'roles' => ['system_admin','admin','director','focal_person']
        ]);
    }

    public function getFocalPersons()
    {
        $persons = User::where('role', 'focal_person')->where('is_active', true)->get();
        return response()->json($persons);
    }

    public function activateUser($id)
    {
        $actor = request()->user();
        $this->forbidUnless($this->isSystemOrAdmin($actor) || $this->isDirector($actor));

        $user = User::findOrFail($id);
        if ($this->isDirector($actor)) {
            $this->forbidUnless($user->role === 'focal_person');
        }
        $user->is_active = true;
        $user->save();
        return response()->json(['message' => 'Activated', 'user' => $user]);
    }

    public function deactivateUser($id)
    {
        $actor = request()->user();
        $this->forbidUnless($this->isSystemOrAdmin($actor) || $this->isDirector($actor));

        $user = User::findOrFail($id);
        if ($this->isDirector($actor)) {
            $this->forbidUnless($user->role === 'focal_person');
        }
        $user->is_active = false;
        $user->save();
        return response()->json(['message' => 'Deactivated', 'user' => $user]);
    }

    /**
     * Admin: Change another user's password
     */
    public function changeUserPassword(Request $request, $id)
    {
        $actor = $request->user();

        // system_admin/admin can change any user's password.
        // director can only change focal_person passwords.
        $this->forbidUnless(in_array($actor?->role, ['system_admin', 'admin', 'director'], true));

        $data = $request->validate([
            'new_password' => ['required','string','min:8','confirmed'],
        ]);

        $user = User::findOrFail($id);

        if ($this->isDirector($actor)) {
            $this->forbidUnless($user->role === 'focal_person');
        }

        // Let the User model mutator hash the password; avoid double-hashing
        $user->forceFill([
            'password' => $data['new_password'],
        ])->save();

        // Revoke all tokens for the target user so they must re-login
        $user->tokens()->delete();

        return response()->json(['message' => 'Password updated and user notified to re-login.']);
    }
}
