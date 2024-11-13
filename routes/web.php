<?php

use App\Http\Controllers\GroupsController;
use App\Http\Controllers\MateriController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TestController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/diagram', function () {
        return Inertia::render('DrawIo/Index');
    })->name('diagram');

    Route::get('/kelompok', [GroupsController::class, 'index'])->name('group.index');
    Route::post('/kelompok/storeMany', [GroupsController::class, 'storeMany'])->name('group.storeMany');
    Route::post('/kelompok/randomize', [GroupsController::class, 'randomize'])->name('group.randomize');
    Route::post('/kelompok/{group}/update-drawio-link', [GroupsController::class, 'updateDrawioLink'])->name('group.updateDrawioLink');
    Route::get('/diagram', [GroupsController::class, 'indexDiagram'])->name('diagram');
    
    Route::get('/materi', [MateriController::class, 'index'])->name('materi.index');
    Route::get('/materi/{materi}', [MateriController::class, 'show'])->name('materi.show');

    Route::get('/test', [TestController::class, 'index'])->name('test.index');
    Route::get('/test/{test}', [TestController::class, 'show'])->name('test.show');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
