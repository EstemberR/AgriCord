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

class FertilizerDistributionController extends Controller
{
    public function index(Request $request): Response
    {
        try {
            // Get date filter parameters or default to current month
            $dateFrom = $request->query('dateFrom') ? Carbon::parse($request->query('dateFrom')) : Carbon::now()->startOfMonth();
            $dateTo = $request->query('dateTo') ? Carbon::parse($request->query('dateTo')) : Carbon::now()->endOfMonth();
            
            // Base query for fertilizer distributions
            $distributionsQuery = Distribution::where('item_type', 'fertilizer');
            
            // Apply date filter if provided
            if ($request->has(['dateFrom', 'dateTo'])) {
                $distributionsQuery->whereBetween('distribution_date', [$dateFrom, $dateTo]);
            }
            
            // Summary statistics with date filter
            $totalDistributionsThisMonth = (clone $distributionsQuery)->count();
            $totalFertilizerDistributed = (clone $distributionsQuery)->sum('quantity');

            // These aren't affected by date filter as they're current status
            $lowStockItems = Inventory::where('item_type', 'fertilizer')
                ->where('status', 'low_stock')
                ->count();

            $pendingDistributions = Distribution::where('item_type', 'fertilizer')
                ->where('status', 'pending')
                ->count();

            // Get all fertilizer distributions with relationships
            $distributions = Distribution::with(['farmer', 'distributor'])
                ->where('item_type', 'fertilizer')
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
                        'fertilizer_type' => $distribution->item_name,
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
                    ];
                });

            // Get fertilizer inventory for stock checking
            $fertilizerInventory = Inventory::where('item_type', 'fertilizer')
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

            return Inertia::render('distributions/FertilizerDistribution', [
                'statistics' => [
                    'totalDistributionsThisMonth' => $totalDistributionsThisMonth,
                    'totalFertilizerDistributed' => number_format($totalFertilizerDistributed, 2),
                    'lowStockItems' => $lowStockItems,
                    'pendingDistributions' => $pendingDistributions,
                ],
                'distributions' => $distributions,
                'farmers' => $farmers,
                'fertilizerInventory' => $fertilizerInventory,
                'barangays' => $barangays,
            ]);
        } catch (\Exception $e) {
            return Inertia::render('distributions/FertilizerDistribution', [
                'statistics' => [
                    'totalDistributionsThisMonth' => 0,
                    'totalFertilizerDistributed' => '0.00',
                    'lowStockItems' => 0,
                    'pendingDistributions' => 0,
                ],
                'distributions' => [],
                'farmers' => [],
                'fertilizerInventory' => [],
                'barangays' => [],
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'farmer_id' => 'required|exists:farmers,id',
            'fertilizer_type' => 'required|string',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'required|string|in:kg,bags',
            'distribution_date' => 'required|date',
            'status' => 'required|in:completed,pending',
            'notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Check inventory stock
            $inventory = Inventory::where('item_type', 'fertilizer')
                ->where('item_name', $validated['fertilizer_type'])
                ->first();

            if (!$inventory) {
                return back()->with('error', 'Fertilizer type not found in inventory.');
            }

            if ($inventory->current_stock < $validated['quantity']) {
                return back()->with('error', 'Insufficient stock. Available: ' . $inventory->current_stock . ' ' . $inventory->unit);
            }

            // Create distribution record
            $distribution = Distribution::create([
                'farmer_id' => $validated['farmer_id'],
                'distribution_date' => $validated['distribution_date'],
                'item_type' => 'fertilizer',
                'item_name' => $validated['fertilizer_type'],
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

            return redirect()->back()->with('success', 'Distribution recorded successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to record distribution: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Distribution $distribution)
    {
        if ($distribution->item_type !== 'fertilizer') {
            return back()->with('error', 'Invalid distribution type.');
        }

        $validated = $request->validate([
            'farmer_id' => 'required|exists:farmers,id',
            'fertilizer_type' => 'required|string',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'required|string|in:kg,bags',
            'distribution_date' => 'required|date',
            'status' => 'required|in:completed,pending',
            'notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Get the original data for comparison
            $originalQuantity = $distribution->quantity;
            $originalStatus = $distribution->status;

            // Check inventory if increasing quantity or changing to completed
            if ($validated['quantity'] > $originalQuantity || 
                ($originalStatus === 'pending' && $validated['status'] === 'completed')) {
                
                $inventory = Inventory::where('item_type', 'fertilizer')
                    ->where('item_name', $validated['fertilizer_type'])
                    ->first();

                if (!$inventory) {
                    return back()->with('error', 'Fertilizer type not found in inventory.');
                }

                $additionalQuantityNeeded = $validated['quantity'] - ($originalStatus === 'completed' ? $originalQuantity : 0);
                
                if ($inventory->current_stock < $additionalQuantityNeeded) {
                    return back()->with('error', 'Insufficient stock. Available: ' . $inventory->current_stock . ' ' . $inventory->unit);
                }

                // Update inventory if needed
                $inventory->current_stock -= $additionalQuantityNeeded;
                $inventory->total_value = $inventory->current_stock * $inventory->unit_cost;
                $inventory->updateStatus();
                $inventory->save();

                // Log inventory transaction
                if ($additionalQuantityNeeded != 0) {
                    InventoryTransaction::create([
                        'inventory_id' => $inventory->id,
                        'transaction_type' => 'out',
                        'quantity' => $additionalQuantityNeeded,
                        'balance_after' => $inventory->current_stock,
                        'reason' => 'distribution_update',
                        'distribution_id' => $distribution->id,
                        'user_id' => auth()->id(),
                    ]);
                }
            }
            // Return stock if reducing quantity or changing to pending
            elseif ($validated['quantity'] < $originalQuantity || 
                    ($originalStatus === 'completed' && $validated['status'] === 'pending')) {
                
                $inventory = Inventory::where('item_type', 'fertilizer')
                    ->where('item_name', $distribution->item_name)
                    ->first();

                if ($inventory) {
                    $quantityToReturn = $originalStatus === 'completed' ? 
                        ($validated['status'] === 'pending' ? $originalQuantity : $originalQuantity - $validated['quantity']) : 0;

                    if ($quantityToReturn > 0) {
                        $inventory->current_stock += $quantityToReturn;
                        $inventory->total_value = $inventory->current_stock * $inventory->unit_cost;
                        $inventory->updateStatus();
                        $inventory->save();

                        // Log inventory transaction
                        InventoryTransaction::create([
                            'inventory_id' => $inventory->id,
                            'transaction_type' => 'in',
                            'quantity' => $quantityToReturn,
                            'balance_after' => $inventory->current_stock,
                            'reason' => 'distribution_update_return',
                            'distribution_id' => $distribution->id,
                            'user_id' => auth()->id(),
                        ]);
                    }
                }
            }

            // Update distribution
            $distribution->update([
                'farmer_id' => $validated['farmer_id'],
                'item_name' => $validated['fertilizer_type'],
                'quantity' => $validated['quantity'],
                'unit' => $validated['unit'],
                'distribution_date' => $validated['distribution_date'],
                'status' => $validated['status'],
                'notes' => $validated['notes'],
            ]);

            // Log history
            DistributionHistory::create([
                'distribution_id' => $distribution->id,
                'action' => 'updated',
                'user_id' => auth()->id(),
                'details' => 'Distribution updated',
            ]);

            DB::commit();
            return redirect()->back()->with('success', 'Distribution updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to update distribution: ' . $e->getMessage());
        }
    }

    public function destroy(Distribution $distribution)
    {
        if ($distribution->item_type !== 'fertilizer') {
            return back()->with('error', 'Invalid distribution type.');
        }

        try {
            DB::beginTransaction();

            // Return stock to inventory if distribution was completed
            if ($distribution->status === 'completed') {
                $inventory = Inventory::where('item_type', 'fertilizer')
                    ->where('item_name', $distribution->item_name)
                    ->first();

                if ($inventory) {
                    $inventory->current_stock += $distribution->quantity;
                    $inventory->total_value = $inventory->current_stock * $inventory->unit_cost;
                    $inventory->updateStatus();
                    $inventory->save();

                    // Log inventory transaction
                    InventoryTransaction::create([
                        'inventory_id' => $inventory->id,
                        'transaction_type' => 'in',
                        'quantity' => $distribution->quantity,
                        'balance_after' => $inventory->current_stock,
                        'reason' => 'distribution_deleted',
                        'user_id' => auth()->id(),
                    ]);
                }
            }

            // Log deletion in history before deleting distribution
            DistributionHistory::create([
                'distribution_id' => $distribution->id,
                'action' => 'deleted',
                'user_id' => auth()->id(),
                'details' => 'Distribution deleted',
            ]);

            $distribution->delete();

            DB::commit();
            return redirect()->back()->with('success', 'Distribution deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete distribution: ' . $e->getMessage());
        }
    }
}
