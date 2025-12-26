<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    // List notifications for the authenticated user
    public function index()
    {
        $notifications = Notification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($notifications);
    }

    // Store a new notification
    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|string',
            'data' => 'required|array',
            'user_id' => 'required|exists:users,id',
        ]);
        $notification = Notification::create([
            'user_id' => $data['user_id'],
            'type' => $data['type'],
            'data' => $data['data'],
        ]);
        return response()->json($notification, 201);
    }

    // Mark a notification as read
    public function markAsRead($id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();
        $notification->read_at = now();
        $notification->save();
        return response()->json(['success' => true]);
    }
}
