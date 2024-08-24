<?php

use App\Http\Controllers\AdminGraphs;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use Illuminate\Foundation\Application;
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
        return Inertia::render('Admin/AdminPanel');
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

    Route::post('/admin/upload', [ReportController::class, 'store'])->name('admin.upload');
    Route::post('/admin/view', [ReportController::class, 'view'])->name('admin.view');
    Route::post('/admin/download', [ReportController::class, 'view']);
    Route::delete('/admin/view/', [ReportController::class, 'destroy'])->name('reports.destroy');
    Route::post('/admin/comparison', [ReportController::class, 'compareReports'])->name('admin.comparison');

    Route::post('/admin/createadmin/register', [RegisteredUserController::class, 'store'])->name('register');

    Route::get('/admin/getComputersIdentifiers', [ReportController::class, 'getComputersIdentifiers'])->name("admin.getComputersIdentifiers");
    Route::get('/admin/getReportsByComputer', [ReportController::class, 'getReportsByComputer']);

    Route::get('/admin/errors', [AdminGraphs::class, 'allErrors']);

    Route::get('/admin/computers/count', function () {
        $count = \App\Models\Computer::count();
        return response()->json(['count' => $count]);
    });

    Route::get('/admin/reports/count', function () {
        $count = \App\Models\Report::count();
        return response()->json(['count' => $count]);
    });

    Route::get('/admin/createadmin/getUsers', [ReportController::class, 'getUsers'])->name('admin.getUsers');

    Route::delete('/admin/createadmin/{id}', [ReportController::class, 'deleteAdminUser']);

    Route::post('/admin/logout', [AuthenticatedSessionController::class, 'destroy'])->name('admin.logout');

    Route::get('/admin/getRole', [AuthenticatedSessionController::class, 'getRole']);
});
// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

require __DIR__.'/auth.php';
