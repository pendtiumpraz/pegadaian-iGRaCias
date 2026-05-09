<?php

namespace App\Http\Controllers;

use App\Models\AuditPlan;
use App\Models\OrganizationalUnit;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditPlanController extends Controller
{
    public function index()
    {
        $plans = AuditPlan::with(['unit', 'leadAuditor'])->latest()->paginate(20);

        return Inertia::render('Audit/Index', [
            'plans' => $plans,
        ]);
    }

    public function create()
    {
        return Inertia::render('Audit/Create', [
            'units'    => OrganizationalUnit::orderBy('name')->get(['id', 'name']),
            'auditors' => User::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'audit_code'      => 'required|string|max:50|unique:audit_plans,audit_code',
            'title'           => 'required|string|max:255',
            'type'            => 'nullable|string|max:100',
            'period'          => 'nullable|string|max:100',
            'unit_id'         => 'nullable|integer|exists:organizational_units,id',
            'lead_auditor_id' => 'nullable|integer|exists:users,id',
            'start_date'      => 'nullable|date',
            'end_date'        => 'nullable|date|after_or_equal:start_date',
            'progress'        => 'nullable|integer|min:0|max:100',
            'risk_level'      => 'nullable|string|max:50',
            'status'          => 'required|string|max:50',
        ]);

        AuditPlan::create($data);

        return redirect()->route('audit.index')->with('success', 'Rencana audit berhasil ditambahkan.');
    }

    public function show(AuditPlan $plan)
    {
        $plan->load(['unit', 'leadAuditor', 'teamMembers.user', 'findings']);

        return Inertia::render('Audit/Show', [
            'plan' => $plan,
        ]);
    }

    public function edit(AuditPlan $plan)
    {
        return Inertia::render('Audit/Edit', [
            'plan'     => $plan,
            'units'    => OrganizationalUnit::orderBy('name')->get(['id', 'name']),
            'auditors' => User::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, AuditPlan $plan)
    {
        $data = $request->validate([
            'audit_code'      => 'required|string|max:50|unique:audit_plans,audit_code,' . $plan->id,
            'title'           => 'required|string|max:255',
            'type'            => 'nullable|string|max:100',
            'period'          => 'nullable|string|max:100',
            'unit_id'         => 'nullable|integer|exists:organizational_units,id',
            'lead_auditor_id' => 'nullable|integer|exists:users,id',
            'start_date'      => 'nullable|date',
            'end_date'        => 'nullable|date|after_or_equal:start_date',
            'progress'        => 'nullable|integer|min:0|max:100',
            'risk_level'      => 'nullable|string|max:50',
            'status'          => 'required|string|max:50',
        ]);

        $plan->update($data);

        return redirect()->route('audit.show', $plan)->with('success', 'Rencana audit berhasil diperbarui.');
    }

    public function destroy(AuditPlan $plan)
    {
        $plan->delete();

        return redirect()->route('audit.index')->with('success', 'Rencana audit dipindahkan ke tempat sampah.');
    }

    public function trash()
    {
        $plans = AuditPlan::onlyTrashed()->latest('deleted_at')->paginate(20);

        return Inertia::render('Audit/Trash', [
            'plans' => $plans,
        ]);
    }

    public function restore($id)
    {
        $plan = AuditPlan::onlyTrashed()->findOrFail($id);
        $plan->restore();

        return redirect()->route('audit.trash')->with('success', 'Rencana audit berhasil dipulihkan.');
    }

    public function forceDelete($id)
    {
        $plan = AuditPlan::onlyTrashed()->findOrFail($id);
        $plan->forceDelete();

        return redirect()->route('audit.trash')->with('success', 'Rencana audit berhasil dihapus permanen.');
    }
}
