<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\GroupUser;
use App\Models\User;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    public function storePresensi(Request $request)
    {
        $request->validate([
            'presensi' => 'required|boolean',
        ]);

        $request->user()->progress()->update([
            'presensi' => $request->presensi,
        ]);

        return redirect(route('presensi', absolute: false));
    }

    public function updateProgress(Request $request)
    {
        $request->validate([
            'progress' => 'required|integer|min:0',
        ]);

        $user = $request->user();
        if (!$user->progressUser) {
            $user->progressUser()->create([
                'progress' => $request->progress,
            ]);
            return;
        }
        $currentProgress = $user->progressUser->progress;

        // Check if the requested progress is less than the current progress
        if ($request->progress > $currentProgress) {
            // Update the progress for the authenticated user
            $user->progressUser()->updateOrCreate(
                ['user_id' => $user->id],
                ['progress' => $request->progress]
            );
        }
    }

    public function updateProgressId(Request $request, $groupId)
    {
        $request->validate([
            'progress' => 'required|integer|min:0',
        ]);

        $users = GroupUser::where('group_id', $groupId)->get();

        foreach ($users as $user) {
            $user = User::find($user->user_id);
            if (!$user->progressUser) {
                $user->progressUser()->create([
                    'progress' => $request->progress,
                ]);
            } else {
                $currentProgress = $user->progressUser->progress;

                // Check if the requested progress is greater than the current progress
                if ($request->progress > $currentProgress) {
                    // Update the progress for the user
                    $user->progressUser()->updateOrCreate(
                        ['user_id' => $user->id],
                        ['progress' => $request->progress]
                    );
                }
            }
        }

        return response()->json(['message' => 'Progress updated successfully for all users in the group.']);
    }
}
