<?php

namespace App\Http\Controllers;

use App\Models\LossEvent;
use App\Models\OrganizationalUnit;
use App\Models\RiskRegister;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LossEventController extends Controller
{
    public function index(Request $request)
    {
        $query = LossEvent::with(['unit', 'risk'])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $losses = $query->paginate(20)->withQueryString();

        return Inertia::render('LossEvent/Index', [
            'losses'  => $losses,
            'filters' => $request->only(['status', 'category']),
        ]);
    }

    public function create()
    {
        return Inertia::render('LossEvent/Create', [
            'units' => OrganizationalUnit::orderBy('name')->get(['id', 'name']),
            'risks' => RiskRegister::orderBy('risk_code')->get(['id', 'risk_code', 'title']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'loss_code'       => 'required|string|max:50|unique:loss_events,loss_code',
            'category'        => 'required|string|max:100',
            'description'     => 'required|string',
            'unit_id'         => 'nullable|integer|exists:organizational_units,id',
            'occurred_at'     => 'nullable|date',
            'discovered_at'   => 'nullable|date',
            'gross_loss'      => 'nullable|numeric|min:0',
            'recovery_amount' => 'nullable|numeric|min:0',
            'status'          => 'required|string|max:50',
            'risk_id'         => 'nullable|integer|exists:risk_register,id',
            'root_cause'      => 'nullable|string',
            'reported_to'     => 'nullable|string|max:255',
            'basel_code'      => 'nullable|string|max:50',
        ]);

        LossEvent::create($data);

        return redirect()->route('loss.index')->with('success', 'Loss event berhasil ditambahkan.');
    }

    public function show(LossEvent $loss)
    {
        $loss->load(['unit', 'risk', 'recoveries', 'actionPlans.owner']);

        return Inertia::render('LossEvent/Show', [
            'loss' => $loss,
        ]);
    }

    public function update(Request $request, LossEvent $loss)
    {
        $data = $request->validate([
            'loss_code'       => 'required|string|max:50|unique:loss_events,loss_code,' . $loss->id,
            'category'        => 'required|string|max:100',
            'description'     => 'required|string',
            'unit_id'         => 'nullable|integer|exists:organizational_units,id',
            'occurred_at'     => 'nullable|date',
            'discovered_at'   => 'nullable|date',
            'gross_loss'      => 'nullable|numeric|min:0',
            'recovery_amount' => 'nullable|numeric|min:0',
            'status'          => 'required|string|max:50',
            'risk_id'         => 'nullable|integer|exists:risk_register,id',
            'root_cause'      => 'nullable|string',
            'reported_to'     => 'nullable|string|max:255',
            'basel_code'      => 'nullable|string|max:50',
        ]);

        $loss->update($data);

        return redirect()->route('loss.show', $loss)->with('success', 'Loss event berhasil diperbarui.');
    }

    public function destroy(LossEvent $loss)
    {
        $loss->delete();

        return redirect()->route('loss.index')->with('success', 'Loss event berhasil dihapus.');
    }
}
