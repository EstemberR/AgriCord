<?php

namespace App\Http\Controllers;

use App\Models\Farmer;
use App\Models\FarmerHistory;
use App\Models\Distribution;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): Response
    {
        try {
            // 1. FARMERS STATISTICS
            $totalFarmers = Farmer::count();
            $activeFarmers = Farmer::where('status', 'Active')->count();

            // 2. DISTRIBUTIONS STATISTICS
            $totalDistributions = Distribution::count();
            $pendingDistributions = Distribution::where('status', 'pending')->count();

            // 3. INVENTORY STATISTICS
            $totalInventoryValue = Inventory::sum('total_value') ?? 0;
            $lowStockItems = Inventory::where('status', 'low_stock')->count();

            // 4. TOTAL FARM LAND AREA
            $totalFarmLandArea = Farmer::sum('farm_size') ?? 0;

            // 5. TOP CROPS PLANTED
            $topCrops = Farmer::select('farm_name as name')
                ->selectRaw('COUNT(*) as count')
                ->whereNotNull('farm_name')
                ->where('farm_name', '!=', '')
                ->groupBy('farm_name')
                ->orderByDesc('count')
                ->limit(5)
                ->get()
                ->map(function ($item) use ($totalFarmers) {
                    return [
                        'name' => $item->name,
                        'count' => $item->count,
                        'percentage' => $totalFarmers > 0 ? round(($item->count / $totalFarmers) * 100, 0) : 0,
                    ];
                });

            // 6. MONTHLY DISTRIBUTIONS (Last 6 months)
            $monthlyDistributions = [];
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $count = Distribution::whereMonth('distribution_date', $date->month)
                    ->whereYear('distribution_date', $date->year)
                    ->count();
                
                $monthlyDistributions[] = [
                    'month' => $date->format('M'),
                    'count' => $count,
                ];
            }

            // 7. BARANGAY DISTRIBUTION (Top 10)
            $barangayDistribution = Farmer::select('address_barangay as barangay')
                ->selectRaw('COUNT(*) as farmers')
                ->whereNotNull('address_barangay')
                ->where('address_barangay', '!=', '')
                ->groupBy('address_barangay')
                ->orderByDesc('farmers')
                ->limit(10)
                ->get();

            // 8. FERTILIZER USAGE
            $fertilizerUsage = Distribution::select('item_name as type')
                ->selectRaw('SUM(quantity) as quantity')
                ->selectRaw('MAX(unit) as unit')
                ->where('item_type', 'fertilizer')
                ->whereNotNull('item_name')
                ->groupBy('item_name')
                ->limit(4)
                ->get()
                ->map(function ($item) {
                    return [
                        'type' => $item->type,
                        'quantity' => round($item->quantity, 2),
                        'unit' => $item->unit ?? 'kg',
                    ];
                });

            // 9. RECENT ACTIVITIES (System-wide)
            $recentActivities = FarmerHistory::latest()
                ->take(10)
                ->get()
                ->map(function ($history) {
                    $type = 'farmer';
                    $description = '';
                    
                    switch ($history->action_type) {
                        case 'created':
                            $description = "New farmer registered: {$history->farmer_name}";
                            break;
                        case 'updated':
                            $description = "Farmer information updated: {$history->farmer_name}";
                            break;
                        case 'status_changed':
                            $description = "Farmer status changed: {$history->farmer_name}";
                            break;
                        case 'deleted':
                            $description = "Farmer removed: {$history->farmer_name}";
                            break;
                        default:
                            $description = "{$history->action_type}: {$history->farmer_name}";
                    }

                    return [
                        'id' => $history->id,
                        'type' => $type,
                        'description' => $description,
                        'timestamp' => $history->created_at->diffForHumans(),
                        'user' => $history->changed_by ?? 'System',
                    ];
                });

            // Prepare dashboard data structure
            $dashboardData = [
                'totalFarmers' => $totalFarmers,
                'activeFarmers' => $activeFarmers,
                'totalDistributions' => $totalDistributions,
                'totalInventoryValue' => number_format($totalInventoryValue, 2),
                'lowStockItems' => $lowStockItems,
                'pendingDistributions' => $pendingDistributions,
                'totalFarmLandArea' => number_format($totalFarmLandArea, 1),
                'topCrops' => $topCrops,
                'monthlyDistributions' => $monthlyDistributions,
                'barangayDistribution' => $barangayDistribution,
                'fertilizerUsage' => $fertilizerUsage,
                'recentActivities' => $recentActivities,
            ];

            return Inertia::render('dashboard/index', [
                'dashboardData' => $dashboardData,
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard error: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            // Return with default empty data
            return Inertia::render('dashboard/index', [
                'dashboardData' => [
                    'totalFarmers' => 0,
                    'activeFarmers' => 0,
                    'totalDistributions' => 0,
                    'totalInventoryValue' => '0.00',
                    'lowStockItems' => 0,
                    'pendingDistributions' => 0,
                    'totalFarmLandArea' => '0.0',
                    'topCrops' => [],
                    'monthlyDistributions' => [],
                    'barangayDistribution' => [],
                    'fertilizerUsage' => [],
                    'recentActivities' => [],
                ],
            ]);
        }
    }
}
