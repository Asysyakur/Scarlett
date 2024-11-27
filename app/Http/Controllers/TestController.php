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

    public function capture(Request $request)
    {
        $stream = $request->getContent(); // Capture the incoming request data
        // Broadcast the test data
        event(new testingEvent($stream, 1));

        return 'Test data captured and broadcasted successfully!';
    }

    public function startScreenShare(Request $request)
    {
        $studentId = $request->input('studentId');
        $peerId = $request->input('peerId'); // Use a unique identifier for the stream

        // Broadcast the event to notify the teacher
        event(new TestingEvent($studentId, $peerId));

        return response()->json(['message' => 'Screen share started']);
    }
}
