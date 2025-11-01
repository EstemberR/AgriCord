<?php

namespace App\Http\Controllers;

use App\Models\Farmer;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UsersController extends Controller
{
    public function index(): Response
    {
        try {
            // 1. SUMMARY STATISTICS
            $totalFarmers = Farmer::count();
            $activeFarmers = Farmer::where('status', 'Active')->count();
            
            $totalAdmins = User::count();
            $activeAdmins = User::whereNotNull('email_verified_at')->count();
            
            $totalUsers = $totalFarmers + $totalAdmins;

            $statistics = [
                'farmers' => [
                    'total' => $totalFarmers,
                    'active' => $activeFarmers,
                ],
                'admins' => [
                    'total' => $totalAdmins,
                    'active' => $activeAdmins,
                ],
                'totalUsers' => $totalUsers,
            ];

            // 2. FARMERS DATA
            $farmers = Farmer::latest()
                ->get()
                ->map(function ($farmer) {
                    return [
                        'id' => $farmer->id,
                        'farmer_id' => 'F' . str_pad($farmer->id, 6, '0', STR_PAD_LEFT),
                        'full_name' => $farmer->full_name,
                        'contact_number' => $farmer->contact_number,
                        'address_barangay' => $farmer->address_barangay,
                        'farm_name' => $farmer->farm_name,
                        'status' => $farmer->status,
                        'created_at' => $farmer->created_at->toISOString(),
                        'registration_date' => $farmer->created_at->format('M d, Y'),
                    ];
                });

            // 3. ADMINS DATA
            $admins = User::latest()
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'admin_id' => 'A' . str_pad($user->id, 6, '0', STR_PAD_LEFT),
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => 'Admin', // Add role column to users table if needed
                        'status' => $user->email_verified_at ? 'Active' : 'Inactive',
                        'last_login' => $user->updated_at->toISOString(),
                        'last_login_formatted' => $user->updated_at->diffForHumans(),
                        'created_at' => $user->created_at->format('M d, Y'),
                    ];
                });

            return Inertia::render('users/index', [
                'statistics' => $statistics,
                'farmers' => $farmers,
                'admins' => $admins,
            ]);
        } catch (\Exception $e) {
            \Log::error('Users page error: ' . $e->getMessage());
            
            return Inertia::render('users/index', [
                'statistics' => [
                    'farmers' => ['total' => 0, 'active' => 0],
                    'admins' => ['total' => 0, 'active' => 0],
                    'totalUsers' => 0,
                ],
                'farmers' => [],
                'admins' => [],
            ]);
        }
    }
}
