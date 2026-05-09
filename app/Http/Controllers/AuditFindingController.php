<?php

namespace App\Http\Controllers;

use App\Models\AuditFinding;
use App\Models\AuditPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditFindingController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditFinding::with(['auditPlan', 'unit', 'owner'])->latest();

        if ($request->filled('audit_plan_id')) {
            $query->where('audit_plan_id', $request->audit_plan_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $findings = $query->paginate(20)->withQueryString();
        $plans    = AuditPlan::orderBy('audit_code')->get(['id', 'audit_code', 'title']);

        return Inertia::render('Finding/Index', [
            'findings' => $findings,
            'plans'    => $plans,
            'filters'  => $request->only(['audit_plan_id', 'status']),
        ]);
    }

    public function show(AuditFinding $finding)
    {
        $finding->load(['auditPlan', 'unit', 'owner', 'actionPlans.owner']);

        return Inertia::render('Finding/Show', [
            'finding' => $finding,
        ]);
    }

    public function update(Request $request, AuditFinding $finding)
    {
        $data = $request->validate([
            'finding_code'   => 'required|string|max:50|unique:audit_findings,finding_code,' . $finding->id,
            'description'    => 'required|string',
            'severity'       => 'nullable|string|max:50',
            'owner_id'       => 'nullable|integer|exists:users,id',
            'deadline'       => 'nullable|date',
            'status'         => 'required|string|max:50',
            'recommendation' => 'nullable|string',
        ]);

        $finding->update($data);

        return redirect()->route('findings.show', $finding)->with('success', 'Temuan berhasil diperbarui.');
    }

    public function close(AuditFinding $finding)
    {
        $finding->update([
            'status'    => 'selesai',
            'closed_at' => now(),
        ]);

        return redirect()->route('findings.show', $finding)->with('success', 'Temuan berhasil ditutup.');
    }
}
