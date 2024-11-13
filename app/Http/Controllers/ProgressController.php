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
}
