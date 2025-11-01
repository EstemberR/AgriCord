<?php

namespace App\Http\Controllers;

use App\Models\Distribution;
use App\Models\Farmer;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DistributionHistoryController extends Controller
{
    public function index(): Response
    {
        try {
            // Summary statistics
            $totalDistributions = Distribution::count();
            
            $totalFertilizerDistributed = Distribution::where('item_type', 'fertilizer')
                ->sum('quantity');
            
            $totalSeedsDistributed = Distribution::where('item_type', 'seed')
                ->sum('quantity');
            
            $thisMonthDistributions = Distribution::where('distribution_date', '>=', Carbon::now()->startOfMonth())
                ->count();

            // Get all distributions with relationships
            $distributions = Distribution::with(['farmer', 'distributor'])
                ->orderBy('distribution_date', 'desc')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($distribution) {
                    return [
                        'id' => $distribution->id,
                        'distribution_id' => 'D' . str_pad($distribution->id, 6, '0', STR_PAD_LEFT),
                        'date' => Carbon::parse($distribution->distribution_date)->format('m/d/Y'),
                        'time' => Carbon::parse($distribution->created_at)->format('h:i A'),
                        'datetime' => Carbon::parse($distribution->created_at)->format('m/d/Y h:i A'),
                        'item_type' => $distribution->item_type,
                        'item_name' => $distribution->item_name,
                        'crop_type' => $distribution->crop_type,
                        'variety' => $distribution->variety,
                        'farmer_name' => $distribution->farmer->full_name,
                        'farmer_id' => $distribution->farmer_id,
                        'barangay' => $distribution->farmer->address_barangay,
                        'quantity' => number_format(floatval($distribution->quantity), 2),
                        'unit' => $distribution->unit,
                        'status' => $distribution->status,
                        'distributed_by' => $distribution->distributor->name,
                        'notes' => $distribution->notes,
                    ];
                });

            // Get unique item names for filter
            $itemNames = Distribution::select('item_name')
                ->distinct()
                ->orderBy('item_name')
                ->pluck('item_name');

            // Get unique barangays for filter
            $barangays = Farmer::select('address_barangay')
                ->distinct()
                ->orderBy('address_barangay')
                ->pluck('address_barangay');

            // Get all admin users for filter
            $admins = User::orderBy('name')->get()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                ];
            });

            return Inertia::render('distributions/DistributionHistory', [
                'statistics' => [
                    'totalDistributions' => $totalDistributions,
                    'totalFertilizerDistributed' => number_format($totalFertilizerDistributed, 2),
                    'totalSeedsDistributed' => number_format($totalSeedsDistributed, 2),
                    'thisMonthDistributions' => $thisMonthDistributions,
                ],
                'distributions' => $distributions,
                'itemNames' => $itemNames,
                'barangays' => $barangays,
                'admins' => $admins,
            ]);
        } catch (\Exception $e) {
            return Inertia::render('distributions/DistributionHistory', [
                'statistics' => [
                    'totalDistributions' => 0,
                    'totalFertilizerDistributed' => '0.00',
                    'totalSeedsDistributed' => '0.00',
                    'thisMonthDistributions' => 0,
                ],
                'distributions' => [],
                'itemNames' => [],
                'barangays' => [],
                'admins' => [],
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function downloadReceipt(Distribution $distribution)
    {
        // Load the relationships needed for the receipt
        $distribution->load(['farmer', 'distributor']);

        // Cast the dates to Carbon instances
        $distributionDate = Carbon::parse($distribution->distribution_date);
        $createdAt = Carbon::parse($distribution->created_at);

        // Cast quantity to float for number_format
        $quantity = floatval($distribution->quantity);

        // Generate PDF using the receipt template
        $pdf = Pdf::loadView('receipts.distribution', [
            'distribution' => [
                'id' => $distribution->id,
                'distribution_id' => 'D' . str_pad($distribution->id, 6, '0', STR_PAD_LEFT),
                'date' => $distributionDate->format('m/d/Y'),
                'time' => $createdAt->format('h:i A'),
                'item_type' => ucfirst($distribution->item_type),
                'item_name' => $distribution->item_name,
                'crop_type' => $distribution->crop_type,
                'variety' => $distribution->variety,
                'farmer_name' => $distribution->farmer->full_name,
                'farmer_id' => $distribution->farmer_id,
                'barangay' => $distribution->farmer->address_barangay,
                'quantity' => number_format($quantity, 2),
                'unit' => $distribution->unit,
                'status' => ucfirst($distribution->status),
                'distributed_by' => $distribution->distributor->name,
                'notes' => $distribution->notes,
            ]
        ]);

        // Return the PDF for download
        return $pdf->download("distribution-receipt-{$distribution->id}.pdf");
    }
}
