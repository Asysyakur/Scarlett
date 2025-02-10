<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\NilaiERD;
use App\Models\NilaiERDGroup;
use Illuminate\Http\Request;

class NilaiController extends Controller
{
    public function storeNilaiERD(Request $request, $id)
    {
        $request->validate([
            'materi_id' => 'integer',
            'catatan' => 'string',
            'nilai' => 'string',
        ]);

        $data = $request->only(['materi_id', 'catatan', 'nilai']);
        $data['user_id'] = $id;

        // Create the new NilaiERD
        NilaiERD::create($data);

        return response()->json(['message' => 'Nilai ERD berhasil disimpan'], 201);
    }

    public function editNilaiERD(Request $request, $id)
    {
        $request->validate([
            'materi_id' => 'integer',
            'catatan' => 'string',
            'nilai' => 'string',
        ]);

        $data = $request->only(['materi_id', 'catatan', 'nilai']);
        $data['user_id'] = $id;

        $nilai = NilaiERD::where('user_id', $id)
            ->where('materi_id', $data['materi_id'])
            ->first();

        if (!$nilai) {
            return response()->json(['message' => 'Nilai ERD tidak ditemukan'], 404);
        }

        $nilai->update($data);

        return response()->json(['message' => 'Nilai ERD berhasil diubah'], 200);
    }

    public function storeERDGroup(Request $request, $id)
    {
        $request->validate([
            'nilai' => 'string',
            'catatan' => 'string',
        ]);

        $data = $request->only(['nilai', 'catatan']);
        $data['group_id'] = $id;

        // Create the new NilaiERDGroup
        NilaiERDGroup::create($data);

        return response()->json(['message' => 'Nilai ERD Group berhasil disimpan'], 201);
    }

    public function editERDGroup(Request $request, $id)
    {
        $request->validate([
            'nilai' => 'string',
            'catatan' => 'string',
        ]);

        $data = $request->only(['nilai', 'catatan']);
        $data['group_id'] = $id;

        $nilai = NilaiERDGroup::where('group_id', $id)->first();

        if (!$nilai) {
            return response()->json(['message' => 'Nilai ERD Group tidak ditemukan'], 404);
        }

        $nilai->update($data);

        return response()->json(['message' => 'Nilai ERD Group berhasil diubah'], 200);
    }
}
