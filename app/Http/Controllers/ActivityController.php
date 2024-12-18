<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ERDUser;
use App\Models\Materi;
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

        if ($activity->duration) {
            // If there was any duration from previous stop, add it to the new duration
            $totalDuration += $activity->duration;
        }

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
        $erdUsers = ERDUser::all();
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
        // Muat relasi 'table' saat mengambil data ERDUser
        $erdUser = ERDUser::where('user_id', $id)->with('table')->get();
        $erdRelation = Relasi::where('materi_id', $erdUser->first()->materi_id)->get();

        // Sertakan nama tabel dalam respons
        $erdUser = $erdUser->map(function ($user) {
            return [
                'id' => $user->id,
                'materi_id' => $user->materi_id,
                'table_id' => $user->table_id,
                'user_id' => $user->user_id,
                'attributes' => $user->attributes,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'table_name' => $user->table->name, // Asumsikan kolom nama tabel adalah 'name'
            ];
        });

        return Inertia::render('Monitoring/ERD/Show', [
            'erdUser' => $erdUser,
            'erdRelation' => $erdRelation,
        ]);
    }
}
