<?php

use App\Http\Controllers\AdminGraphs;
use App\Http\Controllers\CompareReportsController;
use App\Http\Controllers\DestroyController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\ViewController;
use App\Models\VulnerabilityBase;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

Route::get('/', function () {
    return Inertia::render('Main/main');
});

Route::get('/cards', [ReportController::class, 'index']);

Route::middleware('auth')->group(function () {
    Route::get('/admin', function () {
        $latest = VulnerabilityBase::latest('date')->first();
        $latest = $latest?->toArray();
        return Inertia::render('Admin/AdminPanel', [
            'latest' => $latest
        ]);
    })->name('admin');

    Route::get('/admin/view', function () {
        return Inertia::render('Admin/layout/ViewReports');
    });
    Route::get('/admin/upload', function () {
        return Inertia::render('Admin/layout/Uploading');
    });
    Route::get('/admin/comparison', function () {
        return Inertia::render('Admin/layout/Comparison');
    });
    Route::get('/admin/download', function () {
        return Inertia::render('Admin/layout/DownloadReport');
    });

    Route::get('/admin/createadmin', function () {
        return Inertia::render('Admin/layout/CreateAdmin');
    })->name('admin.createadmin');

    Route::post('/admin/upload', [UploadController::class, 'store'])->name('admin.upload');
    Route::post('/admin/view', [ViewController::class, 'view'])->name('admin.view');
    Route::post('/admin/download', [ViewController::class, 'view']);
    Route::delete('/admin/view/', [DestroyController::class, 'destroy'])->name('reports.destroy');
    Route::post('/admin/comparison', [CompareReportsController::class, 'compareReports'])->name('admin.comparison');

    Route::post('/admin/createadmin/register', [RegisteredUserController::class, 'store'])->name('register');

    Route::get('/admin/getComputersIdentifiers', [ReportController::class, 'getComputersIdentifiers'])->name("admin.getComputersIdentifiers");
    Route::get('/admin/getReportsByComputer', [ReportController::class, 'getReportsByComputer']);

    Route::get('/admin/errors', [AdminGraphs::class, 'allErrors']);

    // --- Где я это вообще использую ---
    Route::get('/admin/computers/count', function () {
        $count = \App\Models\Computer::count();
        return response()->json(['count' => $count]);
    });

    Route::get('/admin/reports/count', function () {
        $count = \App\Models\Report::count();
        return response()->json(['count' => $count]);
    });
    // ------

    Route::get('/admin/createadmin/getUsers', [ReportController::class, 'getUsers'])->name('admin.getUsers');

    Route::delete('/admin/createadmin/{id}', [ReportController::class, 'deleteAdminUser']);

    Route::post('/admin/logout', [AuthenticatedSessionController::class, 'destroy'])->name('admin.logout');

    Route::get('/admin/getRole', [AuthenticatedSessionController::class, 'getRole']);
});

require __DIR__.'/auth.php';
