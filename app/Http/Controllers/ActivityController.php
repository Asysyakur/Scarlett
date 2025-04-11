<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Comment;
use App\Models\ERDUsers;
use App\Models\Materi;
use App\Models\NilaiERD;
use App\Models\Relasi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ActivityController extends Controller
{

    public function startActivity(Request $request)
    {
        // Get the authenticated user's ID
        $userId = Auth::id();  // Use Auth::id() to get the authenticated user's ID

        // Check if there's already an activity running for the same path
        $existingActivity = Activity::where('path', $request->path)
            ->where('user_id', $userId)  // Ensure we're checking for the authenticated user
            ->first();

        if ($existingActivity === null) {
            // Start a new activity if none exists for the path and user
            $activity = Activity::create([
                'user_id' => $userId,  // Use authenticated user's ID
                'path' => $request->path,
                'start_time' => now(),  // Set start time when activity starts
                'end_time' => null,
                'duration' => 0,  // Initialize duration as 0
            ]);
            return response()->json($activity);
        }

        // If an activity already exists and the user wants to resume it
        // Resume the activity by updating the start_time
        $existingActivity->start_time = now();  // Update start_time to now (resuming activity)
        $existingActivity->end_time = null;    // Clear end_time to allow for resumption
        $existingActivity->save();

        return response()->json($existingActivity);
    }


    public function stopActivity(Request $request)
    {
        $path = $request->path;
        // Find the ongoing activity based on the path (use first to get a single result)
        $activity = Activity::where('path', $path)
            ->where('user_id', Auth::id())  // Ensure we're checking for the authenticated user
            ->first();

        if (!$activity) {
            // If no active activity is found, return an error
            return response()->json(['message' => 'No active activity found for this path'], 404);
        }

        // Calculate the total duration by considering any previous duration
        // and the time difference from the start to end time
        $totalDuration = now()->diffInSeconds($activity->start_time);  // Time from start to now
        $totalDuration = abs($totalDuration);

        if ($activity->duration) {
            // If there was any duration from previous stop, add it to the new duration
            $totalDuration += $activity->duration;
        }

        // Round the total duration to the nearest integer
        $totalDuration = round($totalDuration);

        // Set end time and update duration
        $activity->end_time = now(); // Set the end time when the activity stops
        $activity->duration = $totalDuration;  // Set the final duration

        $activity->save();

        return response()->json($activity);
    }

    public function index()
    {
        // Retrieve all activities and load user relationships
        $activities = Activity::with('user')->get();

        // Group activities by user_id and sum the duration for each user
        $groupedActivities = $activities->groupBy('user_id')->map(function ($activities) {
            $user = $activities->first()->user; // Retrieve user data
            return [
                'user_id' => $user->id,
                'user_name' => $user->name, // Include user name
                'total_duration' => $activities->sum('duration'), // Sum the duration for each user
                'activities' => $activities, // Optionally, include the individual activities if needed
            ];
        });

        return Inertia::render('Monitoring/AktivitasSiswa/Index', [
            'activities' => $groupedActivities->values(), // Convert to array for easier use in frontend
        ]);
    }


    public function userIndex()
    {
        // Retrieve all users
        $users = User::where('role_id', '!=', 1)->get(); // Exclude admin users

        return Inertia::render('Monitoring/UserList/Index', [
            'users' => $users,
        ]);
    }

    public function updateUser(Request $request, $id)
    {
        // Validate the request data
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
        ]);

        // Find the user and update their details
        $user = User::findOrFail($id);
        if($request->filled('password')) {
            $user->update($request->only('name', 'email', 'password'));
        }else{
            $user->update($request->only('name', 'email'));
        }

        return response()->json(['message' => 'User updated successfully']);
    }

    public function deleteUser($id)
    {
        // Find the user
        $user = User::findOrFail($id);

        // Delete related activities manually
        Activity::where('user_id', $id)->delete();

        // Delete the user
        $user->delete();

        return response()->json(['message' => 'User and related activities deleted successfully']);
    }

    public function show($userId)
    {
        // Find the user and their activities
        $user = User::findOrFail($userId);
        $activities = Activity::where('user_id', $userId)->get();

        return Inertia::render('Monitoring/AktivitasSiswa/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email, // Include more user details if needed
            ],
            'activities' => $activities,
        ]);
    }

    public function erdIndex()
    {
        // Ambil semua pengguna dari tabel users
        $allUsers = User::all();

        // Ambil semua pengguna dari tabel ERDUser
        $erdUsers = ERDUsers::all();
        $usersInERD = $erdUsers->map(function ($erdUser) use ($allUsers) {
            $user = $allUsers->firstWhere('id', $erdUser->user_id);
            $material = Materi::find($erdUser->materi_id); // Ambil objek material berdasarkan materi_id
            return [
                'id' => $user->id,
                'name' => $user->name,
                'materi' => $material, // Sertakan objek material
            ];
        })->unique('id')->values();

        return Inertia::render('Monitoring/ERD/Index', [
            'usersInErd' => $usersInERD->toArray(), // Convert to array
        ]);
    }

    public function erdShow($id)
    {
        // Load the 'table' relationship when fetching ERDUser data
        $erdUser = ERDUsers::where('user_id', $id)->with('table')->get();
        $erdRelation = Relasi::where('materi_id', $erdUser->first()->materi_id)->get();
        $erdNilai = NilaiERD::where('user_id', $id)->first();
        $commentUser = Comment::with('user')->whereIn('erd_user_id', $erdUser->pluck('id'))->get();

        // Include table name in the response
        $erdUser = $erdUser->map(function ($user) {
            return [
                'id' => $user->id,
                'materi_id' => $user->materi_id,
                'table_id' => $user->table_id,
                'user_id' => $user->user_id,
                'attributes' => $user->attributes,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'table_name' => $user->table->name, // Assuming the table name column is 'name'
            ];
        });

        return Inertia::render('Monitoring/ERD/Show', [
            'erdUser' => $erdUser,
            'erdRelation' => $erdRelation,
            'erdNilai' => $erdNilai,
            'commentUser' => $commentUser,
        ]);
    }

    public function uploadScreenshot(Request $request)
    {
        if ($request->hasFile('screenshot')) {
            $file = $request->file('screenshot');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('storage/screenshots'), $fileName);

            return response()->json(['fileName' => $fileName], 200);
        }

        return response()->json(['error' => 'No file uploaded'], 400);
    }

    public function comment(Request $request)
    {
        $request->validate([
            'comment' => 'required|string',
            'erd_user_id' => 'required|exists:erd_users,id',
        ]);
        $user = Auth::user();
        $comment = Comment::create([
            'comment' => $request->comment,
            'user_id' => $user->id,
            'erd_user_id' => $request->erd_user_id,
        ]);

        return response()->json($comment);
    }

    public function deleteComment($commentId)
    {
        $comment = Comment::find($commentId);
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully'], 200);
    }
}
