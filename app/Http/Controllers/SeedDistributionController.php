<?php

namespace App\Http\Controllers;

use App\Models\Distribution;
use App\Models\Farmer;
use App\Models\Inventory;
use App\Models\InventoryTransaction;
use App\Models\DistributionHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SeedDistributionController extends Controller
{
    public function index(Request $request): Response
    {
        try {
            // Get date filter parameters or default to current month
            $dateFrom = $request->query('dateFrom') ? Carbon::parse($request->query('dateFrom')) : Carbon::now()->startOfMonth();
            $dateTo = $request->query('dateTo') ? Carbon::parse($request->query('dateTo')) : Carbon::now()->endOfMonth();
            
            // Base query for seed distributions
            $distributionsQuery = Distribution::where('item_type', 'seed');
            
            // Apply date filter if provided
            if ($request->has(['dateFrom', 'dateTo'])) {
                $distributionsQuery->whereBetween('distribution_date', [$dateFrom, $dateTo]);
            }
            
            // Summary statistics with date filter
            $totalDistributionsThisMonth = (clone $distributionsQuery)->count();
            $totalSeedsDistributed = (clone $distributionsQuery)->sum('quantity');

            // These aren't affected by date filter as they're current status
            $lowStockItems = Inventory::where('item_type', 'seed')
                ->where('status', 'low_stock')
                ->count();

            $pendingDistributions = Distribution::where('item_type', 'seed')
                ->where('status', 'pending')
                ->count();

            // Get all seed distributions with relationships
            $distributions = Distribution::with(['farmer', 'distributor'])
                ->where('item_type', 'seed')
                ->orderBy('distribution_date', 'desc')
                ->get()
                ->map(function ($distribution) {
                    return [
                        'id' => $distribution->id,
                        'distribution_id' => 'D' . str_pad($distribution->id, 6, '0', STR_PAD_LEFT),
                        'date' => $distribution->distribution_date->format('m/d/Y'),
                        'farmer_name' => $distribution->farmer->full_name,
                        'farmer_id' => $distribution->farmer_id,
                        'barangay' => $distribution->farmer->address_barangay,
                        'seed_type' => $distribution->item_name,
                        'crop_type' => $distribution->crop_type,
                        'variety' => $distribution->variety,
                        'quantity' => number_format($distribution->quantity, 2),
                        'unit' => $distribution->unit,
                        'status' => $distribution->status,
                        'distributed_by' => $distribution->distributor->name,
                        'notes' => $distribution->notes,
                    ];
                });

            // Get all farmers for the form dropdown
            $farmers = Farmer::where('status', 'active')
                ->orderBy('full_name')
                ->get()
                ->map(function ($farmer) {
                    return [
                        'id' => $farmer->id,
                        'name' => $farmer->full_name,
                        'barangay' => $farmer->address_barangay,
                        'contact' => $farmer->contact_number,
                        'crop' => $farmer->crop,
                    ];
                });

            // Get seed inventory for stock checking
            $seedInventory = Inventory::where('item_type', 'seed')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->item_name,
                        'current_stock' => $item->current_stock,
                        'unit' => $item->unit,
                        'status' => $item->status,
                    ];
                });

            // Get unique barangays for filter
            $barangays = Farmer::select('address_barangay')
                ->distinct()
                ->orderBy('address_barangay')
                ->pluck('address_barangay');

            return Inertia::render('distributions/SeedDistribution', [
                'statistics' => [
                    'totalDistributionsThisMonth' => $totalDistributionsThisMonth,
                    'totalSeedsDistributed' => number_format($totalSeedsDistributed, 2),
                    'lowStockItems' => $lowStockItems,
                    'pendingDistributions' => $pendingDistributions,
                ],
                'distributions' => $distributions,
                'farmers' => $farmers,
                'seedInventory' => $seedInventory,
                'barangays' => $barangays,
            ]);
        } catch (\Exception $e) {
            return Inertia::render('distributions/SeedDistribution', [
                'statistics' => [
                    'totalDistributionsThisMonth' => 0,
                    'totalSeedsDistributed' => '0.00',
                    'lowStockItems' => 0,
                    'pendingDistributions' => 0,
                ],
                'distributions' => [],
                'farmers' => [],
                'seedInventory' => [],
                'barangays' => [],
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'farmer_id' => 'required|exists:farmers,id',
            'seed_type' => 'required|string',
            'crop_type' => 'nullable|string',
            'variety' => 'nullable|string',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'required|string|in:kg,bags,packets',
            'distribution_date' => 'required|date',
            'status' => 'required|in:completed,pending',
            'notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Check inventory stock
            $inventory = Inventory::where('item_type', 'seed')
                ->where('item_name', $validated['seed_type'])
                ->first();

            if (!$inventory) {
                return back()->with('error', 'Seed type not found in inventory.');
            }

            if ($inventory->current_stock < $validated['quantity']) {
                return back()->with('error', 'Insufficient stock. Available: ' . $inventory->current_stock . ' ' . $inventory->unit);
            }

            // Create distribution record
            $distribution = Distribution::create([
                'farmer_id' => $validated['farmer_id'],
                'distribution_date' => $validated['distribution_date'],
                'item_type' => 'seed',
                'item_name' => $validated['seed_type'],
                'crop_type' => $validated['crop_type'],
                'variety' => $validated['variety'],
                'quantity' => $validated['quantity'],
                'unit' => $validated['unit'],
                'status' => $validated['status'],
                'distributed_by' => auth()->id(),
                'notes' => $validated['notes'],
            ]);

            // Deduct from inventory if completed
            if ($validated['status'] === 'completed') {
                $inventory->current_stock -= $validated['quantity'];
                $inventory->total_value = $inventory->current_stock * $inventory->unit_cost;
                $inventory->updateStatus();
                $inventory->save();

                // Log inventory transaction
                InventoryTransaction::create([
                    'inventory_id' => $inventory->id,
                    'transaction_type' => 'out',
                    'quantity' => $validated['quantity'],
                    'balance_after' => $inventory->current_stock,
                    'reason' => 'distribution',
                    'distribution_id' => $distribution->id,
                    'user_id' => auth()->id(),
                ]);
            }

            // Log distribution history
            DistributionHistory::create([
                'distribution_id' => $distribution->id,
                'action' => 'created',
                'user_id' => auth()->id(),
                'details' => 'Distribution created',
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Seed distribution recorded successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to record distribution: ' . $e->getMessage());
        }
    }
}
