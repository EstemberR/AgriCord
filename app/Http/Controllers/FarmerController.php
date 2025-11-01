<?php

namespace App\Http\Controllers;

use App\Models\Farmer;
use App\Models\FarmerHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FarmerController extends Controller
{
    public function index(): Response
    {
        $farmers = Farmer::latest()->get()->map(function ($farmer) {
            return [
                'id' => $farmer->id,
                'farmer_id' => 'F' . str_pad($farmer->id, 6, '0', STR_PAD_LEFT),
                'full_name' => $farmer->full_name,
                'date_of_birth' => $farmer->date_of_birth,
                'gender' => $farmer->gender,
                'civil_status' => $farmer->civil_status,
                'contact_number' => $farmer->contact_number,
                'email' => $farmer->email,
                'address_purok' => $farmer->address_purok,
                'address_barangay' => $farmer->address_barangay,
                'address_municipality' => $farmer->address_municipality,
                'address_province' => $farmer->address_province,
                'nationality' => $farmer->nationality,
                'voters_id_number' => $farmer->voters_id_number,
                'voters_certification_number' => $farmer->voters_certification_number,
                'passport_photo_path' => $farmer->passport_photo_path,
                'farm_name' => $farmer->farm_name,
                'farm_location' => $farmer->farm_location,
                'farm_size' => $farmer->farm_size ?? 0,
                'land_ownership_type' => $farmer->land_ownership_type,
                'farming_experience_months' => $farmer->farming_experience_months,
                'farming_experience_years' => $farmer->farming_experience_years,
                'emergency_contact_person' => $farmer->emergency_contact_person,
                'emergency_contact_number' => $farmer->emergency_contact_number,
                'created_at' => $farmer->created_at->toISOString(),
                'updated_at' => $farmer->updated_at->toISOString(),
                'status' => $farmer->status ?? 'Active',
            ];
        });

        // Calculate statistics
        $stats = [
            'total' => $farmers->count(), // Total all farmers
            'active' => $farmers->where('status', 'Active')->count(),
            'newThisMonth' => Farmer::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'inactive' => $farmers->where('status', 'Inactive')->count(),
        ];

        return Inertia::render('farmers/index', [
            'farmers' => $farmers,
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('farmers/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // Personal Information
            'full_name' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date'],
            'gender' => ['required', 'string', 'max:50'],
            'civil_status' => ['required', 'string', 'max:50'],
            'contact_number' => ['required', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'address_purok' => ['required', 'string', 'max:255'],
            'address_barangay' => ['required', 'string', 'max:255'],
            'address_municipality' => ['required', 'string', 'max:255'],
            'address_province' => ['required', 'string', 'max:255'],
            'nationality' => ['required', 'string', 'max:100'],

            // Identification
            'voters_id_number' => ['nullable', 'string', 'max:100'],
            'voters_certification_number' => ['nullable', 'string', 'max:100'],
            'passport_photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],

            // Farm Information
            'farm_name' => ['required', 'string', 'max:255'],
            'farm_location' => ['required', 'string', 'max:255'],
            'farm_size' => ['nullable', 'numeric', 'min:0'],
            'land_ownership_type' => ['required', 'in:owner,tenant'],
            'farming_experience_months' => ['nullable', 'integer', 'min:0'],
            'farming_experience_years' => ['nullable', 'integer', 'min:0'],

            // Additional Information
            'emergency_contact_person' => ['nullable', 'string', 'max:255'],
            'emergency_contact_number' => ['nullable', 'string', 'max:50'],
        ]);

        if ($request->hasFile('passport_photo')) {
            $path = $request->file('passport_photo')->store('passport_photos', 'public');
            $validated['passport_photo_path'] = $path;
        }

        $farmer = Farmer::create($validated);

        // Log history
        FarmerHistory::create([
            'farmer_id' => $farmer->id,
            'farmer_name' => $farmer->full_name,
            'farmer_code' => 'F' . str_pad($farmer->id, 6, '0', STR_PAD_LEFT),
            'action_type' => 'New Registration',
            'changed_by' => 'Admin User', // Can be updated with auth()->user()->name later
            'details' => "New farmer registered: {$farmer->full_name} from {$farmer->address_barangay}, {$farmer->address_municipality}",
            'previous_value' => null,
        ]);

        return redirect()->route('farmers.index')->with('status', 'Farmer created successfully');
    }

    public function update(Request $request, Farmer $farmer): RedirectResponse
    {
        $validated = $request->validate([
            // Personal Information
            'full_name' => ['sometimes', 'required', 'string', 'max:255'],
            'date_of_birth' => ['sometimes', 'nullable', 'date'],
            'gender' => ['sometimes', 'nullable', 'string', 'max:50'],
            'civil_status' => ['sometimes', 'nullable', 'string', 'max:50'],
            'contact_number' => ['sometimes', 'required', 'string', 'max:50'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'address_purok' => ['sometimes', 'nullable', 'string', 'max:255'],
            'address_barangay' => ['sometimes', 'nullable', 'string', 'max:255'],
            'address_municipality' => ['sometimes', 'nullable', 'string', 'max:255'],
            'address_province' => ['sometimes', 'nullable', 'string', 'max:255'],
            'nationality' => ['sometimes', 'nullable', 'string', 'max:100'],

            // Identification
            'voters_id_number' => ['sometimes', 'nullable', 'string', 'max:100'],
            'voters_certification_number' => ['sometimes', 'nullable', 'string', 'max:100'],
            'passport_photo' => ['sometimes', 'nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],

            // Farm Information
            'farm_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'farm_location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'farm_size' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'land_ownership_type' => ['sometimes', 'nullable', 'in:owner,tenant'],
            'farming_experience_months' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'farming_experience_years' => ['sometimes', 'nullable', 'integer', 'min:0'],

            // Additional Information
            'emergency_contact_person' => ['sometimes', 'nullable', 'string', 'max:255'],
            'emergency_contact_number' => ['sometimes', 'nullable', 'string', 'max:50'],
        ]);

        // Handle passport photo update
        if ($request->hasFile('passport_photo')) {
            // Delete old photo
            if ($farmer->passport_photo_path) {
                Storage::disk('public')->delete($farmer->passport_photo_path);
            }
            $path = $request->file('passport_photo')->store('passport_photos', 'public');
            $validated['passport_photo_path'] = $path;
        }

        // Get changed fields for history
        $changes = [];
        foreach ($validated as $key => $value) {
            if ($key !== 'passport_photo' && $farmer->{$key} != $value) {
                $changes[] = $key;
            }
        }

        $farmer->update($validated);

        // Log history if there were changes
        if (!empty($changes)) {
            FarmerHistory::create([
                'farmer_id' => $farmer->id,
                'farmer_name' => $farmer->full_name,
                'farmer_code' => 'F' . str_pad($farmer->id, 6, '0', STR_PAD_LEFT),
                'action_type' => 'Updated',
                'changed_by' => 'Admin User',
                'details' => "Farmer information updated. Fields changed: " . implode(', ', $changes),
                'previous_value' => null,
            ]);
        }

        return redirect()->back()->with('status', 'Farmer updated successfully');
    }

    public function destroy(Farmer $farmer): RedirectResponse
    {
        // Log history before deleting
        FarmerHistory::create([
            'farmer_id' => null, // Set to null since farmer will be deleted
            'farmer_name' => $farmer->full_name,
            'farmer_code' => 'F' . str_pad($farmer->id, 6, '0', STR_PAD_LEFT),
            'action_type' => 'Deleted',
            'changed_by' => 'Admin User',
            'details' => "Farmer record deleted: {$farmer->full_name}",
            'previous_value' => null,
        ]);

        // Delete passport photo if exists
        if ($farmer->passport_photo_path) {
            Storage::disk('public')->delete($farmer->passport_photo_path);
        }

        $farmer->delete();

        return redirect()->back()->with('status', 'Farmer deleted successfully');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['required', 'integer', 'exists:farmers,id'],
        ]);

        $farmers = Farmer::whereIn('id', $validated['ids'])->get();

        foreach ($farmers as $farmer) {
            // Log history before deleting
            FarmerHistory::create([
                'farmer_id' => null,
                'farmer_name' => $farmer->full_name,
                'farmer_code' => 'F' . str_pad($farmer->id, 6, '0', STR_PAD_LEFT),
                'action_type' => 'Deleted',
                'changed_by' => 'Admin User',
                'details' => "Farmer record deleted (bulk): {$farmer->full_name}",
                'previous_value' => null,
            ]);

            if ($farmer->passport_photo_path) {
                Storage::disk('public')->delete($farmer->passport_photo_path);
            }
            $farmer->delete();
        }

        return redirect()->back()->with('status', 'Farmers deleted successfully');
    }

    public function updateStatus(Request $request, Farmer $farmer): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:Active,Inactive,Pending Verification'],
        ]);

        $previousStatus = $farmer->status;
        $farmer->update(['status' => $validated['status']]);

        // Log history
        FarmerHistory::create([
            'farmer_id' => $farmer->id,
            'farmer_name' => $farmer->full_name,
            'farmer_code' => 'F' . str_pad($farmer->id, 6, '0', STR_PAD_LEFT),
            'action_type' => 'Status Changed',
            'changed_by' => 'Admin User',
            'details' => "Status changed from {$previousStatus} to {$validated['status']}",
            'previous_value' => $previousStatus,
        ]);

        return redirect()->back()->with('status', 'Farmer status updated successfully');
    }

    public function history(): Response
    {
        // Get all history records from database
        $history = FarmerHistory::latest()->get()->map(function ($record) {
            return [
                'id' => $record->id,
                'date_time' => $record->created_at->toISOString(),
                'action_type' => $record->action_type,
                'farmer_name' => $record->farmer_name,
                'farmer_id' => $record->farmer_code,
                'changed_by' => $record->changed_by,
                'details' => $record->details,
                'previous_value' => $record->previous_value,
            ];
        });

        // Get unique admins for filter
        $admins = FarmerHistory::distinct()->pluck('changed_by')->toArray();

        return Inertia::render('farmers/history', [
            'history' => $history,
            'admins' => $admins,
        ]);
    }
}




