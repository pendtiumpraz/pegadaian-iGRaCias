<?php

namespace App\Http\Controllers;

use App\Models\Policy;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PolicyController extends Controller
{
    public function index(Request $request)
    {
        $query = Policy::latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $policies = $query->paginate(20)->withQueryString();

        return Inertia::render('Policy/Index', [
            'policies' => $policies,
            'filters'  => $request->only(['status', 'type']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Policy/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'policy_code'       => 'required|string|max:50|unique:policies,policy_code',
            'name'              => 'required|string|max:255',
            'type'              => 'nullable|string|max:100',
            'owner_div'         => 'nullable|string|max:255',
            'version'           => 'nullable|string|max:50',
            'effective_date'    => 'nullable|date',
            'next_review_date'  => 'nullable|date',
            'status'            => 'required|string|max:50',
            'page_count'        => 'nullable|integer|min:0',
            'acknowledged_count'=> 'nullable|integer|min:0',
            'file_path'         => 'nullable|string|max:2048',
        ]);

        Policy::create($data);

        return redirect()->route('policies.index')->with('success', 'Kebijakan berhasil ditambahkan.');
    }

    public function show(Policy $policy)
    {
        $policy->load(['versions', 'approvalWorkflows', 'actionPlans.owner']);

        return Inertia::render('Policy/Show', [
            'policy' => $policy,
        ]);
    }

    public function edit(Policy $policy)
    {
        return Inertia::render('Policy/Edit', [
            'policy' => $policy,
        ]);
    }

    public function update(Request $request, Policy $policy)
    {
        $data = $request->validate([
            'policy_code'       => 'required|string|max:50|unique:policies,policy_code,' . $policy->id,
            'name'              => 'required|string|max:255',
            'type'              => 'nullable|string|max:100',
            'owner_div'         => 'nullable|string|max:255',
            'version'           => 'nullable|string|max:50',
            'effective_date'    => 'nullable|date',
            'next_review_date'  => 'nullable|date',
            'status'            => 'required|string|max:50',
            'page_count'        => 'nullable|integer|min:0',
            'acknowledged_count'=> 'nullable|integer|min:0',
            'file_path'         => 'nullable|string|max:2048',
        ]);

        $policy->update($data);

        return redirect()->route('policies.show', $policy)->with('success', 'Kebijakan berhasil diperbarui.');
    }

    public function destroy(Policy $policy)
    {
        $policy->delete();

        return redirect()->route('policies.index')->with('success', 'Kebijakan dipindahkan ke tempat sampah.');
    }

    public function trash()
    {
        $policies = Policy::onlyTrashed()->latest('deleted_at')->paginate(20);

        return Inertia::render('Policy/Trash', [
            'policies' => $policies,
        ]);
    }

    public function restore($id)
    {
        $policy = Policy::onlyTrashed()->findOrFail($id);
        $policy->restore();

        return redirect()->route('policies.trash')->with('success', 'Kebijakan berhasil dipulihkan.');
    }

    public function forceDelete($id)
    {
        $policy = Policy::onlyTrashed()->findOrFail($id);
        $policy->forceDelete();

        return redirect()->route('policies.trash')->with('success', 'Kebijakan berhasil dihapus permanen.');
    }
}
