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

    public function startScreenShare(Request $request)
    {
        $studentId = $request->input('studentId');
        $peerId = $request->input('peerId'); // Use a unique identifier for the stream
        $name = $request->input('name');
        
        // Broadcast the event to notify the teacher
        event(new TestingEvent($studentId, $peerId, $name));

        return response()->json(['message' => 'Screen share started']);
    }

    public function stopScreenShare(Request $request)
    {
        $studentId = $request->input('studentId');
        
        // Broadcast event untuk memberitahukan guru bahwa stream dihentikan
        event(new TestingEvent($studentId, null, null)); // Kirimkan null jika stream dihentikan

        return response()->json(['message' => 'Screen share stopped']);
    }
}
