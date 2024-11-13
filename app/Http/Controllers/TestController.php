<?php


namespace App\Http\Controllers;

use App\Models\Test;
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
}
