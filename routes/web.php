<?php

use App\Events\MonitoringChannel;
use App\Events\ScreenSharingStarted;
use App\Events\testingEvent;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\GroupsController;
use App\Http\Controllers\MateriController;
use App\Http\Controllers\MonitoringController;
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

    // Route::get('/monitoring/monitoring-test', [MonitoringController::class, 'monitoringTest'])->name('monitoring.monitoringTest');
});
Route::get('tests', function () {
    return Inertia::render('TestPage');
})->name('test');

Route::get('guru', function () {
    return Inertia::render('GuruPage');
})->name('guru');

Route::post('/broadcast-video', function () {
    $videoData = request()->videoData;
    broadcast(new testingEvent($videoData, 1));
    return response()->json(['message' => 'Video broadcasted successfully!']);
});

Route::middleware('auth')->group(function () {
    Route::get('/diagram', function () {
        return Inertia::render('DrawIo/Index');
    })->name('diagram');

    Route::post('/start-screen-share', [TestController::class, 'startScreenShare']);

    Route::get('/presensi', function () {
        return Inertia::render('Presensi/Index');
    })->name('presensi');
    Route::post('/presensi', [ProgressController::class, 'storePresensi'])->name('presensi.store');

    Route::get('/kelompok', [GroupsController::class, 'index'])->name('group.index');
    Route::post('/kelompok/storeMany', [GroupsController::class, 'storeMany'])->name('group.storeMany');
    Route::post('/kelompok/randomize', [GroupsController::class, 'randomize'])->name('group.randomize');
    Route::post('/kelompok/{group}/update-drawio-link', [GroupsController::class, 'updateDrawioLink'])->name('group.updateDrawioLink');
    Route::get('/diagram', [GroupsController::class, 'indexDiagram'])->name('diagram');

    Route::get('/materi', [MateriController::class, 'index'])->name('materi.index');
    Route::get('/materi/{materi}', [MateriController::class, 'show'])->name('materi.show');
    Route::post('/materi', [MateriController::class, 'store'])->name('materi.store');
    Route::post('/materi/{materi}', [MateriController::class, 'update'])->name('materi.update');
    Route::get('/materi/{materi}/drag-and-drop', [MateriController::class, 'dragAndDrop'])->name('materi.dragAndDrop');

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
