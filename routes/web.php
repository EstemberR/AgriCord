<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\FarmerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\FertilizerDistributionController;
use App\Http\Controllers\SeedDistributionController;
use App\Http\Controllers\DistributionHistoryController;
use App\Http\Controllers\InventoryManagementController;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Users Management
    Route::get('users', [UsersController::class, 'index'])->name('users.index');

    // Farmers
    Route::get('farmers', [FarmerController::class, 'index'])->name('farmers.index');
    Route::get('farmers/create', [FarmerController::class, 'create'])->name('farmers.create');
    Route::get('farmers/history', [FarmerController::class, 'history'])->name('farmers.history');
    Route::post('farmers', [FarmerController::class, 'store'])->name('farmers.store');
    // Bulk delete MUST come before parameterized routes
    Route::delete('farmers/bulk-delete', [FarmerController::class, 'bulkDestroy'])->name('farmers.bulk-destroy');
    Route::put('farmers/{farmer}', [FarmerController::class, 'update'])->name('farmers.update');
    Route::put('farmers/{farmer}/status', [FarmerController::class, 'updateStatus'])->name('farmers.update-status');
    Route::delete('farmers/{farmer}', [FarmerController::class, 'destroy'])->name('farmers.destroy');

    // Input Distribution
    Route::get('distributions/fertilizer', [FertilizerDistributionController::class, 'index'])->name('distributions.fertilizer');
    Route::post('distributions/fertilizer', [FertilizerDistributionController::class, 'store'])->name('distributions.fertilizer.store');
    Route::put('distributions/fertilizer/{distribution}', [FertilizerDistributionController::class, 'update'])->name('distributions.fertilizer.update');
    Route::delete('distributions/fertilizer/{distribution}', [FertilizerDistributionController::class, 'destroy'])->name('distributions.fertilizer.destroy');
    Route::get('distributions/seed', [SeedDistributionController::class, 'index'])->name('distributions.seed');
    Route::post('distributions/seed', [SeedDistributionController::class, 'store'])->name('distributions.seed.store');
    Route::get('distributions/history', [DistributionHistoryController::class, 'index'])->name('distributions.history');
    Route::get('download-receipt/{distribution}', [DistributionHistoryController::class, 'downloadReceipt'])->name('distributions.download-receipt');
    Route::get('inventory', [InventoryManagementController::class, 'index'])->name('inventory.index');
    Route::post('inventory', [InventoryManagementController::class, 'store'])->name('inventory.store');
    Route::post('inventory/restock', [InventoryManagementController::class, 'restock'])->name('inventory.restock');
    Route::post('inventory/adjust', [InventoryManagementController::class, 'adjust'])->name('inventory.adjust');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
