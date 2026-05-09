<?php

namespace App\Http\Controllers;

use App\Models\RiskRegister;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RiskRegisterController extends Controller
{
    public function index(Request $request)
    {
        $query = RiskRegister::query();

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('inherent_level')) {
            $query->where('inherent_level', $request->inherent_level);
        }

        $risks = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Risk/Index', [
            'risks'   => $risks,
            'filters' => $request->only(['category', 'status', 'inherent_level']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Risk/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'risk_code'        => 'required|string|max:50|unique:risk_register,risk_code',
            'title'            => 'required|string|max:255',
            'description'      => 'nullable|string',
            'unit_id'          => 'nullable|integer|exists:organizational_units,id',
            'category'         => 'required|string|max:100',
            'likelihood'       => 'nullable|integer|min:1|max:5',
            'impact'           => 'nullable|integer|min:1|max:5',
            'inherent_score'   => 'nullable|numeric',
            'inherent_level'   => 'nullable|string|max:50',
            'residual_score'   => 'nullable|numeric',
            'residual_level'   => 'nullable|string|max:50',
            'risk_appetite'    => 'nullable|string|max:50',
            'status'           => 'required|string|max:50',
            'owner'            => 'nullable|string|max:255',
            'kri_id'           => 'nullable|integer|exists:kris,id',
            'reviewed_by'      => 'nullable|string|max:255',
            'next_review_date' => 'nullable|date',
        ]);

        RiskRegister::create($data);

        return redirect()->route('risk.index')->with('success', 'Risiko berhasil ditambahkan.');
    }

    public function show(RiskRegister $risk)
    {
        $risk->load(['controls', 'actionPlans.owner', 'unit', 'kri']);

        return Inertia::render('Risk/Show', [
            'risk' => $risk,
        ]);
    }

    public function edit(RiskRegister $risk)
    {
        return Inertia::render('Risk/Edit', [
            'risk' => $risk,
        ]);
    }

    public function update(Request $request, RiskRegister $risk)
    {
        $data = $request->validate([
            'risk_code'        => 'required|string|max:50|unique:risk_register,risk_code,' . $risk->id,
            'title'            => 'required|string|max:255',
            'description'      => 'nullable|string',
            'unit_id'          => 'nullable|integer|exists:organizational_units,id',
            'category'         => 'required|string|max:100',
            'likelihood'       => 'nullable|integer|min:1|max:5',
            'impact'           => 'nullable|integer|min:1|max:5',
            'inherent_score'   => 'nullable|numeric',
            'inherent_level'   => 'nullable|string|max:50',
            'residual_score'   => 'nullable|numeric',
            'residual_level'   => 'nullable|string|max:50',
            'risk_appetite'    => 'nullable|string|max:50',
            'status'           => 'required|string|max:50',
            'owner'            => 'nullable|string|max:255',
            'kri_id'           => 'nullable|integer|exists:kris,id',
            'reviewed_by'      => 'nullable|string|max:255',
            'next_review_date' => 'nullable|date',
        ]);

        $risk->update($data);

        return redirect()->route('risk.show', $risk)->with('success', 'Risiko berhasil diperbarui.');
    }

    public function destroy(RiskRegister $risk)
    {
        $risk->delete();

        return redirect()->route('risk.index')->with('success', 'Risiko dipindahkan ke tempat sampah.');
    }

    public function trash()
    {
        $risks = RiskRegister::onlyTrashed()->latest('deleted_at')->paginate(20);

        return Inertia::render('Risk/Trash', [
            'risks' => $risks,
        ]);
    }

    public function restore($id)
    {
        $risk = RiskRegister::onlyTrashed()->findOrFail($id);
        $risk->restore();

        return redirect()->route('risk.trash')->with('success', 'Risiko berhasil dipulihkan.');
    }

    public function forceDelete($id)
    {
        $risk = RiskRegister::onlyTrashed()->findOrFail($id);
        $risk->forceDelete();

        return redirect()->route('risk.trash')->with('success', 'Risiko berhasil dihapus permanen.');
    }
}
