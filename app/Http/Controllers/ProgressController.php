<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
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
        if(!$user->progressUser) {
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
}
