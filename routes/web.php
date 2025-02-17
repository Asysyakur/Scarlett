<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GroupsController;
use App\Http\Controllers\MateriController;
use App\Http\Controllers\NilaiController;
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

Route::middleware(['auth', AdminMiddleware::class])->group(function () {
    Route::get('/monitoring', function () {
        return Inertia::render('Monitoring/Index');
    })->name('monitoring');

    Route::get('/monitoring/aktivitas-siswa', [ActivityController::class, 'index'])->name('monitoring.activity');
    Route::get('/monitoring/aktivitas-siswa/{userId}', [ActivityController::class, 'show'])->name('monitoring.detail');

    Route::get('/monitoring/monitoring-test', function () {
        return Inertia::render('Monitoring/MonitoringTest/Index');
    })->name('monitoring.monitoringTest');

    Route::get('/monitoring/erd', [ActivityController::class, 'erdIndex'])->name('monitoring.erd');
    Route::get('/monitoring/erd/{id}', [ActivityController::class, 'erdShow'])->name('monitoring.erd.show');
    Route::post('/monitoring/erd/{id}', [NilaiController::class, 'storeNilaiERD'])->name('monitoring.erd.storeNilaiERD');
    Route::post('/monitoring/erd/{id}/edit', [NilaiController::class, 'editNilaiERD'])->name('monitoring.erd.editNilaiERD');
    Route::delete('/monitoring/erd/comment/{commentId}', [ActivityController::class, 'deleteComment'])->name('monitoring.erd.deleteComment');

    Route::post('/diagram/{id}', [NilaiController::class, 'storeERDGroup'])->name('diagram.storeERDGroup');
    Route::post('/diagram/{id}/edit', [NilaiController::class, 'editERDGroup'])->name('diagram.editERDGroup');

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

    Route::post('/dashboard/update', [DashboardController::class, 'update'])->name('dashboard.update');

    Route::post('/groups/{group}/add-student', [GroupsController::class, 'addStudent'])->name('group.addStudent');
    Route::delete('/groups/{group}/remove-student/{id}', [GroupsController::class, 'removeStudent'])->name('group.removeStudent');
    Route::post('/groups/{group}/set-leader/{id}', [GroupsController::class, 'setLeader'])->name('group.setLeader');
    Route::post('/groups/{group}/unset-leader/{id}', [GroupsController::class, 'removeLeader'])->name('group.removeLeader');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/start-screen-share', [TestController::class, 'startScreenShare']);
    Route::post('/stop-screen-share', [TestController::class, 'stopScreenShare']);

    Route::get('/presensi', [DashboardController::class, 'presensi'])->name('presensi');
    Route::post('/presensi', [ProgressController::class, 'storePresensi'])->name('presensi.store');

    Route::get('/kelompok', [GroupsController::class, 'index'])->name('group.index');
    Route::get('/diagram', [GroupsController::class, 'indexDiagram'])->name('diagram');

    Route::get('/materi', [MateriController::class, 'index'])->name('materi.index');
    Route::get('/materi/{materi}', [MateriController::class, 'show'])->name('materi.show');
    Route::get('/materi/{materi}/drag-and-drop', [MateriController::class, 'dragAndDrop'])->name('materi.dragAndDrop');
    Route::get('/materi/{materi}/studi-kasus', [MateriController::class, 'studiKasus'])->name('materi.studiKasus');
    Route::post('/materi/drag-and-drop/save', [MateriController::class, 'dndSave'])->name('materi.dragAndDrop.save');
    Route::post('/upload-screenshot', [ActivityController::class, 'uploadScreenshot'])->name('activity.uploadScreenshot');
    Route::post('/diagram/{id}/task', [GroupsController::class, 'storeTask'])->name('diagram.storeTask');

    Route::get('/test', [TestController::class, 'index'])->name('test.index');
    Route::get('/test/{test}', [TestController::class, 'show'])->name('test.show');
    Route::post('/test/capture', [TestController::class, 'capture'])->name('test.capture');

    Route::post('/activities/start', [ActivityController::class, 'startActivity']);
    Route::post('/activities/stop', [ActivityController::class, 'stopActivity']);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/update-progress', [ProgressController::class, 'updateProgress'])->name('progress.update.progress');
    Route::post('/comment', [ActivityController::class, 'comment'])->name('comment');
});

require __DIR__ . '/auth.php';
