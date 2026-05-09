<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\OrganizationalUnit;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IncidentController extends Controller
{
    public function index(Request $request)
    {
        $query = Incident::with(['unit', 'investigator'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('severity')) {
            $query->where('severity', $request->severity);
        }

        $incidents = $query->paginate(20)->withQueryString();

        return Inertia::render('Incident/Index', [
            'incidents' => $incidents,
            'filters'   => $request->only(['status', 'severity']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Incident/Create', [
            'units'        => OrganizationalUnit::orderBy('name')->get(['id', 'name']),
            'investigators' => User::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'incident_code'      => 'required|string|max:50|unique:incidents,incident_code',
            'title'              => 'required|string|max:255',
            'channel'            => 'nullable|string|max:100',
            'unit_id'            => 'nullable|integer|exists:organizational_units,id',
            'anonymous'          => 'boolean',
            'reporter_name'      => 'nullable|string|max:255',
            'reporter_email_nip' => 'nullable|string|max:255',
            'occurrence_date'    => 'nullable|date',
            'description'        => 'required|string',
            'severity'           => 'nullable|string|max:50',
            'status'             => 'required|string|max:50',
            'investigator_id'    => 'nullable|integer|exists:users,id',
        ]);

        Incident::create($data);

        return redirect()->route('incidents.index')->with('success', 'Insiden berhasil dilaporkan.');
    }

    public function show(Incident $incident)
    {
        $incident->load(['unit', 'investigator', 'timelines', 'recommendations', 'attachments', 'actionPlans.owner']);

        return Inertia::render('Incident/Show', [
            'incident' => $incident,
        ]);
    }

    public function edit(Incident $incident)
    {
        return Inertia::render('Incident/Edit', [
            'incident'     => $incident,
            'units'        => OrganizationalUnit::orderBy('name')->get(['id', 'name']),
            'investigators' => User::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Incident $incident)
    {
        $data = $request->validate([
            'incident_code'      => 'required|string|max:50|unique:incidents,incident_code,' . $incident->id,
            'title'              => 'required|string|max:255',
            'channel'            => 'nullable|string|max:100',
            'unit_id'            => 'nullable|integer|exists:organizational_units,id',
            'anonymous'          => 'boolean',
            'reporter_name'      => 'nullable|string|max:255',
            'reporter_email_nip' => 'nullable|string|max:255',
            'occurrence_date'    => 'nullable|date',
            'description'        => 'required|string',
            'severity'           => 'nullable|string|max:50',
            'status'             => 'required|string|max:50',
            'investigator_id'    => 'nullable|integer|exists:users,id',
        ]);

        $incident->update($data);

        return redirect()->route('incidents.show', $incident)->with('success', 'Insiden berhasil diperbarui.');
    }

    public function destroy(Incident $incident)
    {
        $incident->delete();

        return redirect()->route('incidents.index')->with('success', 'Insiden dipindahkan ke tempat sampah.');
    }

    public function trash()
    {
        $incidents = Incident::onlyTrashed()->latest('deleted_at')->paginate(20);

        return Inertia::render('Incident/Trash', [
            'incidents' => $incidents,
        ]);
    }

    public function restore($id)
    {
        $incident = Incident::onlyTrashed()->findOrFail($id);
        $incident->restore();

        return redirect()->route('incidents.trash')->with('success', 'Insiden berhasil dipulihkan.');
    }

    public function forceDelete($id)
    {
        $incident = Incident::onlyTrashed()->findOrFail($id);
        $incident->forceDelete();

        return redirect()->route('incidents.trash')->with('success', 'Insiden berhasil dihapus permanen.');
    }
}
