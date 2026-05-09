<?php

namespace App\Http\Controllers;

use App\Models\ActionPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActionPlanController extends Controller
{
    public function index(Request $request)
    {
        $query = ActionPlan::with(['owner', 'actionable'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $plans = $query->paginate(20)->withQueryString();

        return Inertia::render('ActionPlan/Index', [
            'plans'   => $plans,
            'filters' => $request->only(['status']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'           => 'required|string|max:255',
            'owner_id'        => 'nullable|integer|exists:users,id',
            'deadline'        => 'nullable|date',
            'progress'        => 'nullable|integer|min:0|max:100',
            'status'          => 'required|string|in:perencanaan,aktif,pelaksanaan,selesai',
            'actionable_type' => 'required|string|max:100',
            'actionable_id'   => 'required|integer',
        ]);

        ActionPlan::create($data);

        return back()->with('success', 'Rencana aksi berhasil ditambahkan.');
    }

    public function update(Request $request, ActionPlan $plan)
    {
        $data = $request->validate([
            'title'    => 'required|string|max:255',
            'owner_id' => 'nullable|integer|exists:users,id',
            'deadline' => 'nullable|date',
            'progress' => 'nullable|integer|min:0|max:100',
            'status'   => 'required|string|in:perencanaan,aktif,pelaksanaan,selesai',
        ]);

        $plan->update($data);

        return back()->with('success', 'Rencana aksi berhasil diperbarui.');
    }

    public function destroy(ActionPlan $plan)
    {
        $plan->delete();

        return back()->with('success', 'Rencana aksi berhasil dihapus.');
    }
}
