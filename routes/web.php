<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\GroupsController;
use App\Http\Controllers\MateriController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\TestController;
use App\Http\Middleware\AdminMiddleware;
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

Route::middleware(['auth', AdminMiddleware::class])->group(function () {
    Route::get('/monitoring', function () {
        return Inertia::render('Monitoring/Index');
    })->name('monitoring');

    Route::get('/monitoring/aktivitas-siswa', [ActivityController::class, 'index'])->name('monitoring.activity');
    Route::get('/monitoring/aktivitas-siswa/{userId}', [ActivityController::class, 'show'])->name('monitoring.detail');

    Route::get('/monitoring/monitoring-test', function () {
        return Inertia::render('Monitoring/MonitoringTest/Index');
    })->name('monitoring.monitoringTest');

    Route::post('/kelompok/storeMany', [GroupsController::class, 'storeMany'])->name('group.storeMany');
    Route::post('/kelompok/randomize', [GroupsController::class, 'randomize'])->name('group.randomize');
    Route::post('/kelompok/{group}/update-drawio-link', [GroupsController::class, 'updateDrawioLink'])->name('group.updateDrawioLink');

    Route::post('/test/{test}', [TestController::class, 'edit'])->name('test.edit');
    Route::post('/test', [TestController::class, 'store'])->name('test.store');
    Route::delete('/test/{id}', [TestController::class, 'destroy'])->name('test.destroy');

    Route::post('/materi', [MateriController::class, 'store'])->name('materi.store');
    Route::post('/materi/{materi}', [MateriController::class, 'update'])->name('materi.update');
    Route::delete('/materi/{materi}', [MateriController::class, 'destroy'])->name('materi.destroy');

    Route::post('/materi/{id}/drag-and-drop/attribute', [MateriController::class, 'editAttribute'])->name('dnd.attribute.edit');
    Route::post('/materi/{id}/drag-and-drop/table', [MateriController::class, 'editTable'])->name('dnd.table.edit');
    Route::post('/materi/{id}/drag-and-drop/relation', [MateriController::class, 'editRelation'])->name('dnd.relation.edit');
    
    Route::delete('/materi/drag-and-drop/attribute/{attid}', [MateriController::class, 'destroyAttribute'])->name('dnd.attribute.destroy');
    Route::delete('/materi/drag-and-drop/table/{attid}', [MateriController::class, 'destroyTable'])->name('dnd.table.destroy');
    Route::delete('/materi/drag-and-drop/relation/{attid}', [MateriController::class, 'destroyRelation'])->name('dnd.relation.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/diagram', function () {
        return Inertia::render('DrawIo/Index');
    })->name('diagram');

    Route::post('/start-screen-share', [TestController::class, 'startScreenShare']);
    Route::post('/stop-screen-share', [TestController::class, 'stopScreenShare']);

    Route::get('/presensi', function () {
        return Inertia::render('Presensi/Index');
    })->name('presensi');
    Route::post('/presensi', [ProgressController::class, 'storePresensi'])->name('presensi.store');

    Route::get('/kelompok', [GroupsController::class, 'index'])->name('group.index');
    Route::get('/diagram', [GroupsController::class, 'indexDiagram'])->name('diagram');

    Route::get('/materi', [MateriController::class, 'index'])->name('materi.index');
    Route::get('/materi/{materi}', [MateriController::class, 'show'])->name('materi.show');
    Route::get('/materi/{materi}/drag-and-drop', [MateriController::class, 'dragAndDrop'])->name('materi.dragAndDrop');
    Route::get('/materi/{materi}/studi-kasus', [MateriController::class, 'studiKasus'])->name('materi.studiKasus');
    Route::post('/materi/drag-and-drop/save', [MateriController::class, 'dndSave'])->name('materi.dragAndDrop.save');

    Route::get('/test', [TestController::class, 'index'])->name('test.index');
    Route::get('/test/{test}', [TestController::class, 'show'])->name('test.show');
    Route::post('/test/capture', [TestController::class, 'capture'])->name('test.capture');

    Route::post('/activities/start', [ActivityController::class, 'startActivity']);
    Route::post('/activities/stop', [ActivityController::class, 'stopActivity']);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
