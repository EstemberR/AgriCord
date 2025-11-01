<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class InventoryManagementController extends Controller
{
    public function index(): Response
    {
        try {
            // Summary statistics
            $totalItems = Inventory::sum('current_stock');
            $lowStockItems = Inventory::where('status', 'low_stock')->count();
            $outOfStockItems = Inventory::where('status', 'out_of_stock')->count();
            $totalValue = Inventory::sum('total_value');

            // Get all inventory items
            $inventory = Inventory::orderBy('item_name')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'item_type' => $item->item_type,
                        'item_name' => $item->item_name,
                        'current_stock' => $item->current_stock,
                        'unit' => $item->unit,
                        'minimum_threshold' => $item->minimum_threshold,
                        'maximum_capacity' => $item->maximum_capacity,
                        'last_restock_date' => $item->last_restock_date ? $item->last_restock_date->format('m/d/Y') : 'Never',
                        'unit_cost' => number_format($item->unit_cost, 2),
                        'total_value' => number_format($item->total_value, 2),
                        'status' => $item->status,
                        'supplier' => $item->supplier,
                        'notes' => $item->notes,
                    ];
                });

            // Get low stock alerts
            $lowStockAlerts = Inventory::where('status', 'low_stock')
                ->orWhere('status', 'out_of_stock')
                ->orderBy('current_stock', 'asc')
                ->get()
                ->map(function ($item) {
                    $recommended = $item->maximum_capacity ? $item->maximum_capacity - $item->current_stock : $item->minimum_threshold * 2;
                    return [
                        'id' => $item->id,
                        'item_name' => $item->item_name,
                        'current_stock' => $item->current_stock,
                        'minimum_threshold' => $item->minimum_threshold,
                        'unit' => $item->unit,
                        'status' => $item->status,
                        'recommended_restock' => $recommended,
                    ];
                });

            return Inertia::render('inventory/InventoryManagement', [
                'statistics' => [
                    'totalItems' => $totalItems,
                    'lowStockItems' => $lowStockItems,
                    'outOfStockItems' => $outOfStockItems,
                    'totalValue' => number_format($totalValue, 2),
                ],
                'inventory' => $inventory,
                'lowStockAlerts' => $lowStockAlerts,
            ]);
        } catch (\Exception $e) {
            return Inertia::render('inventory/InventoryManagement', [
                'statistics' => [
                    'totalItems' => 0,
                    'lowStockItems' => 0,
                    'outOfStockItems' => 0,
                    'totalValue' => '0.00',
                ],
                'inventory' => [],
                'lowStockAlerts' => [],
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_type' => 'required|in:fertilizer,seed',
            'item_name' => 'required|string|unique:inventory,item_name',
            'initial_stock' => 'required|numeric|min:0',
            'unit' => 'required|string|in:kg,bags,packets',
            'minimum_threshold' => 'required|numeric|min:0',
            'maximum_capacity' => 'nullable|numeric|min:0',
            'unit_cost' => 'required|numeric|min:0',
            'supplier' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $totalValue = $validated['initial_stock'] * $validated['unit_cost'];
            $status = 'normal';
            if ($validated['initial_stock'] == 0) {
                $status = 'out_of_stock';
            } elseif ($validated['initial_stock'] < $validated['minimum_threshold']) {
                $status = 'low_stock';
            }

            $inventory = Inventory::create([
                'item_type' => $validated['item_type'],
                'item_name' => $validated['item_name'],
                'current_stock' => $validated['initial_stock'],
                'unit' => $validated['unit'],
                'minimum_threshold' => $validated['minimum_threshold'],
                'maximum_capacity' => $validated['maximum_capacity'],
                'last_restock_date' => $validated['initial_stock'] > 0 ? now() : null,
                'unit_cost' => $validated['unit_cost'],
                'total_value' => $totalValue,
                'status' => $status,
                'supplier' => $validated['supplier'],
                'notes' => $validated['notes'],
            ]);

            // Log initial stock if > 0
            if ($validated['initial_stock'] > 0) {
                InventoryTransaction::create([
                    'inventory_id' => $inventory->id,
                    'transaction_type' => 'in',
                    'quantity' => $validated['initial_stock'],
                    'balance_after' => $validated['initial_stock'],
                    'reason' => 'initial_stock',
                    'unit_cost' => $validated['unit_cost'],
                    'total_cost' => $totalValue,
                    'user_id' => auth()->id(),
                    'notes' => 'Initial inventory setup',
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Inventory item added successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to add inventory item: ' . $e->getMessage());
        }
    }

    public function restock(Request $request)
    {
        $validated = $request->validate([
            'inventory_id' => 'required|exists:inventory,id',
            'quantity' => 'required|numeric|min:0.01',
            'unit_cost' => 'required|numeric|min:0',
            'supplier' => 'nullable|string',
            'reference_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $inventory = Inventory::findOrFail($validated['inventory_id']);
            $inventory->current_stock += $validated['quantity'];
            $inventory->last_restock_date = now();
            $inventory->total_value = $inventory->current_stock * $inventory->unit_cost;
            $inventory->updateStatus();
            $inventory->save();

            InventoryTransaction::create([
                'inventory_id' => $inventory->id,
                'transaction_type' => 'in',
                'quantity' => $validated['quantity'],
                'balance_after' => $inventory->current_stock,
                'reason' => 'restock',
                'reference_number' => $validated['reference_number'],
                'unit_cost' => $validated['unit_cost'],
                'total_cost' => $validated['quantity'] * $validated['unit_cost'],
                'user_id' => auth()->id(),
                'notes' => $validated['notes'],
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Inventory restocked successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to restock inventory: ' . $e->getMessage());
        }
    }

    public function adjust(Request $request)
    {
        $validated = $request->validate([
            'inventory_id' => 'required|exists:inventory,id',
            'adjustment_type' => 'required|in:add,subtract',
            'quantity' => 'required|numeric|min:0.01',
            'reason' => 'required|string|in:correction,wastage,damage,other',
            'notes' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            $inventory = Inventory::findOrFail($validated['inventory_id']);
            
            if ($validated['adjustment_type'] === 'add') {
                $inventory->current_stock += $validated['quantity'];
            } else {
                if ($inventory->current_stock < $validated['quantity']) {
                    return back()->with('error', 'Cannot subtract more than available stock.');
                }
                $inventory->current_stock -= $validated['quantity'];
            }

            $inventory->total_value = $inventory->current_stock * $inventory->unit_cost;
            $inventory->updateStatus();
            $inventory->save();

            InventoryTransaction::create([
                'inventory_id' => $inventory->id,
                'transaction_type' => 'adjustment',
                'quantity' => $validated['quantity'],
                'balance_after' => $inventory->current_stock,
                'reason' => $validated['reason'],
                'user_id' => auth()->id(),
                'notes' => $validated['notes'] . ' (Adjustment: ' . $validated['adjustment_type'] . ')',
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Inventory adjusted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to adjust inventory: ' . $e->getMessage());
        }
    }
}
