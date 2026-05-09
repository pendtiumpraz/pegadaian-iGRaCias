<?php

namespace App\Http\Controllers;

use App\Models\Control;
use App\Models\RiskRegister;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ControlController extends Controller
{
    public function index()
    {
        $controls = Control::with('risk')->latest()->paginate(20);

        return Inertia::render('Control/Index', [
            'controls' => $controls,
        ]);
    }

    public function create()
    {
        $risks = RiskRegister::orderBy('risk_code')->get(['id', 'risk_code', 'title']);

        return Inertia::render('Control/Create', [
            'risks' => $risks,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'control_code'  => 'required|string|max:50|unique:controls,control_code',
            'risk_id'       => 'required|integer|exists:risk_register,id',
            'description'   => 'required|string',
            'type'          => 'nullable|string|max:100',
            'frequency'     => 'nullable|string|max:100',
            'automated'     => 'boolean',
            'effectiveness' => 'nullable|numeric|min:0|max:100',
            'test_date'     => 'nullable|date',
            'evidence_url'  => 'nullable|url|max:2048',
        ]);

        Control::create($data);

        return redirect()->route('controls.index')->with('success', 'Kontrol berhasil ditambahkan.');
    }

    public function edit(Control $control)
    {
        $risks = RiskRegister::orderBy('risk_code')->get(['id', 'risk_code', 'title']);

        return Inertia::render('Control/Edit', [
            'control' => $control,
            'risks'   => $risks,
        ]);
    }

    public function update(Request $request, Control $control)
    {
        $data = $request->validate([
            'control_code'  => 'required|string|max:50|unique:controls,control_code,' . $control->id,
            'risk_id'       => 'required|integer|exists:risk_register,id',
            'description'   => 'required|string',
            'type'          => 'nullable|string|max:100',
            'frequency'     => 'nullable|string|max:100',
            'automated'     => 'boolean',
            'effectiveness' => 'nullable|numeric|min:0|max:100',
            'test_date'     => 'nullable|date',
            'evidence_url'  => 'nullable|url|max:2048',
        ]);

        $control->update($data);

        return redirect()->route('controls.index')->with('success', 'Kontrol berhasil diperbarui.');
    }

    public function destroy(Control $control)
    {
        $control->delete();

        return redirect()->route('controls.index')->with('success', 'Kontrol berhasil dihapus.');
    }
}
