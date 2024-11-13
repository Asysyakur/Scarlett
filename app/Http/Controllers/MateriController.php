<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Materi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MateriController extends Controller
{
    public function index()
    {
        $materis = Materi::all();
        return Inertia::render('Materi/Index', [
            'materis' => $materis,
        ]);
    }

    public function show(Materi $materi)
    {
        return Inertia::render('Materi/Show', [
            'materi' => $materi,
        ]);
    }
}
