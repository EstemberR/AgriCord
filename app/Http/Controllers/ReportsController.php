<?php

namespace App\Http\Controllers;

use App\Models\Distribution;
use App\Models\Farmer;
use App\Models\Inventory;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportsController extends Controller
{
    public function index()
    {
        $recentDistributions = Distribution::with('farmer')
            ->orderBy('distribution_date', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Reports/Index', [
            'recentDistributions' => $recentDistributions,
            'totalDistributions' => Distribution::count(),
            'totalFarmers' => Farmer::count(),
            'totalInventoryValue' => Inventory::sum('total_value')
        ]);
    }

    public function distribution()
    {
        // Get distribution data for the last 6 months
        $monthlyDistributions = Distribution::selectRaw('
                DATE_FORMAT(distribution_date, "%b") as month,
                SUM(CASE WHEN item_type = "fertilizer" THEN quantity ELSE 0 END) as fertilizer,
                SUM(CASE WHEN item_type = "seed" THEN quantity ELSE 0 END) as seeds
            ')
            ->whereRaw('distribution_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)')
            ->groupBy('month')
            ->orderBy('distribution_date')
            ->get();

        $recentDistributions = Distribution::with(['farmer', 'distributor'])
            ->orderBy('distribution_date', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Reports/DistributionReport', [
            'distributionData' => $monthlyDistributions,
            'recentDistributions' => $recentDistributions,
            'summary' => [
                'total' => Distribution::count(),
                'fertilizerTotal' => Distribution::where('item_type', 'fertilizer')->sum('quantity'),
                'seedsTotal' => Distribution::where('item_type', 'seed')->sum('quantity')
            ]
        ]);
    }

    public function farmer()
    {
        $statusData = Farmer::selectRaw('
                status,
                COUNT(*) as value
            ')
            ->groupBy('status')
            ->get()
            ->map(function($item) {
                return [
                    'name' => ucfirst($item->status),
                    'value' => $item->value,
                    'color' => $item->status === 'active' ? '#185c37' : 
                              ($item->status === 'inactive' ? '#dc2626' : '#f59e0b')
                ];
            });

        $farmSizeRanges = [
            ['range' => '< 1', 'min' => 0, 'max' => 1, 'color' => '#1a223f'],
            ['range' => '1-2', 'min' => 1, 'max' => 2, 'color' => '#2563eb'],
            ['range' => '2-5', 'min' => 2, 'max' => 5, 'color' => '#7c3aed'],
            ['range' => '> 5', 'min' => 5, 'max' => 999999, 'color' => '#db2777']
        ];

        $farmSizeData = collect($farmSizeRanges)->map(function($range) {
            return [
                'name' => $range['range'] . ' hectare' . ($range['range'] === '1-2' ? 's' : ''),
                'value' => Farmer::whereBetween('farm_size', [$range['min'], $range['max']])->count(),
                'color' => $range['color']
            ];
        });

        $recentUpdates = Farmer::orderBy('updated_at', 'desc')
            ->take(10)
            ->get()
            ->map(function($farmer) {
                return [
                    'id' => $farmer->id,
                    'name' => $farmer->full_name,
                    'barangay' => $farmer->address_barangay,
                    'status' => $farmer->status,
                    'farmSize' => $farmer->farm_size,
                    'lastUpdate' => $farmer->updated_at->format('Y-m-d')
                ];
            });

        return Inertia::render('Reports/FarmerReport', [
            'statusData' => $statusData,
            'farmSizeData' => $farmSizeData,
            'recentUpdates' => $recentUpdates,
            'summary' => [
                'total' => Farmer::count(),
                'active' => Farmer::where('status', 'active')->count(),
                'avgFarmSize' => Farmer::avg('farm_size')
            ]
        ]);
    }

    public function resource()
    {
        // Get inventory trends for the last 6 months
        $monthlyInventory = InventoryTransaction::selectRaw('
                DATE_FORMAT(created_at, "%b") as month,
                SUM(CASE WHEN transaction_type = "in" THEN quantity ELSE 0 END) as received,
                SUM(CASE WHEN transaction_type = "out" THEN quantity ELSE 0 END) as distributed
            ')
            ->whereRaw('created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)')
            ->groupBy('month')
            ->orderBy('created_at')
            ->get();

        $utilizationData = Inventory::with(['transactions' => function($query) {
                $query->whereRaw('created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)');
            }])
            ->get()
            ->map(function($item) {
                $received = $item->transactions->where('transaction_type', 'in')->sum('quantity');
                $distributed = $item->transactions->where('transaction_type', 'out')->sum('quantity');
                
                return [
                    'id' => $item->id,
                    'resource' => $item->item_name,
                    'initial' => $item->current_stock - $received + $distributed,
                    'received' => $received,
                    'distributed' => $distributed,
                    'remaining' => $item->current_stock
                ];
            });

        return Inertia::render('Reports/ResourceReport', [
            'inventoryData' => $monthlyInventory,
            'utilizationData' => $utilizationData,
            'summary' => [
                'totalValue' => Inventory::sum('total_value'),
                'utilizationRate' => 78, // This needs a more complex calculation
                'turnoverRate' => 4.2, // This needs a more complex calculation
                'stockCoverage' => 2.5 // This needs a more complex calculation
            ]
        ]);
    }

    public function compliance()
    {
        // Calculate farmer data completeness
        $farmerDataCompleteness = Farmer::selectRaw("
            AVG(
                CASE WHEN full_name IS NOT NULL THEN 100 ELSE 0 END +
                CASE WHEN date_of_birth IS NOT NULL THEN 100 ELSE 0 END +
                CASE WHEN contact_number IS NOT NULL THEN 100 ELSE 0 END +
                CASE WHEN farm_size IS NOT NULL THEN 100 ELSE 0 END
            ) / 4 as completeness_score
        ")->value('completeness_score');
        
        // Calculate distribution data completeness
        $distributionAccuracy = Distribution::select('id')
            ->whereExists(function($query) {
                $query->from('inventory_transactions')
                    ->whereColumn('inventory_transactions.distribution_id', 'distributions.id');
            })
            ->count() * 100 / max(Distribution::count(), 1);

        // Calculate record keeping score
        $recordKeeping = Distribution::whereNotNull('notes')
            ->count() * 100 / max(Distribution::count(), 1);

        // Calculate data quality based on actual data validation
        $dataQuality = round(Inventory::whereNotNull(['item_type', 'item_name', 'unit', 'current_stock'])
            ->count() * 100 / max(Inventory::count(), 1));

        $complianceScores = [
            ['category' => 'Data Completeness', 'score' => round($farmerDataCompleteness)],
            ['category' => 'Documentation', 'score' => round($recordKeeping)],
            ['category' => 'Distribution Accuracy', 'score' => round($distributionAccuracy)],
            ['category' => 'Record Keeping', 'score' => round($recordKeeping)],
            ['category' => 'Data Quality', 'score' => $dataQuality]
        ];

        $overallScore = collect($complianceScores)->avg('score');

        return Inertia::render('Reports/ComplianceReport', [
            'complianceScores' => $complianceScores,
            'summary' => [
                'overallScore' => round($overallScore),
                'auditSuccess' => round($distributionAccuracy),
                'dataQuality' => $dataQuality,
                'completionRate' => round($farmerDataCompleteness)
            ]
        ]);
    }

    public function generatePdf(string $type)
    {
        // TODO: Implement PDF generation based on report type
        return response()->json(['message' => 'PDF generation not implemented yet']);
    }
}