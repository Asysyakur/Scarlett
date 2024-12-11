<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Dashboard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $data = Dashboard::get()->first();
        
        return Inertia::render('Dashboard', [
            'data' => $data
        ]);
    }

    public function update(Request $request){
        $request->validate([
            'link_presensi' => 'required|string|max:255',
            'capaian_pembelajaran' => 'required|string',
            'tujuan_pembelajaran' => 'required|string',
            'identitas_pembelajaran' => 'required|string',
        ]);

        $data = Dashboard::get()->first();

        $data->link_presensi = $request->link_presensi;
        $data->capaian_pembelajaran = $request->capaian_pembelajaran;
        $data->tujuan_pembelajaran = $request->tujuan_pembelajaran;
        $data->identitas_pembelajaran = $request->identitas_pembelajaran;

        $data->save();
    }
}
