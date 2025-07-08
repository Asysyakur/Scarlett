<?php


namespace App\Http\Controllers;

use App\Events\testingEvent;
use App\Models\Test;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestController extends Controller
{
    public function index()
    {
        $tests = Test::all(); // Fetch all tests from the database

        return Inertia::render('Test/Index', [
            'tests' => $tests,
        ]);
    }

    public function show(Test $test)
    {
        // Pass the selected test instance to the view
        return Inertia::render('Test/Show', [
            'test' => $test,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'link' => 'nullable|url',
        ]);

        $data = $request->only(['name', 'description', 'link']);

        // Create the new Materi
        Test::create($data);
    }

    public function destroy($id)
    {
        try {
            $test = Test::findOrFail($id); // Pastikan test ada
            $test->delete(); // Hapus test dari database

            return response()->json(['message' => 'Test berhasil dihapus'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan saat menghapus test'], 500);
        }
    }

    public function edit(Request $request, $id)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'link' => 'required|url',
        ]);

        // Temukan test berdasarkan ID
        $test = Test::findOrFail($id);

        // Update data test
        $test->update($validated);

        return response()->json($test);
    }


    public function startScreenShare(Request $request)
    {
        $studentId = $request->input('studentId');
        $peerId = $request->input('peerId'); // Use a unique identifier for the stream
        $name = $request->input('name');
        $from = $request->input('from'); // Optional, if you want to include the source of the event

        // Broadcast the event to notify the teacher
        event(new TestingEvent($studentId, $peerId, $name, $from));

        return response()->json(['message' => 'Screen share started']);
    }

    public function stopScreenShare(Request $request)
    {
        $studentId = $request->input('studentId');

        // Broadcast event untuk memberitahukan guru bahwa stream dihentikan
        event(new TestingEvent($studentId, null, null, null)); // Kirimkan null jika stream dihentikan

        return response()->json(['message' => 'Screen share stopped']);
    }

    public function pretest()
    {   
        // Cari test dengan nama 'pretest'
        $test = Test::where('name', 'Pretest')->first();
        
        // Jika test ditemukan, arahkan ke metode show dengan ID tersebut
        if ($test) {
            return $this->show($test);
        }

        // Jika tidak ditemukan, ambil test pertama dari tabel
        $firstTest = Test::first();

        // Jika test pertama ditemukan, arahkan ke metode show
        if ($firstTest) {
            return $this->show($firstTest);
        }
        
        // Jika tabel test kosong, kembalikan respons error
        return response()->json(['message' => 'Tidak ada test yang tersedia'], 404);
    }
}
