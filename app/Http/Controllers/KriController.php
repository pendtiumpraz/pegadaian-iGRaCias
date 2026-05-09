<?php

namespace App\Http\Controllers;

use App\Models\Kri;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KriController extends Controller
{
    public function index()
    {
        $kris = Kri::latest()->paginate(20);

        return Inertia::render('Kri/Index', [
            'kris' => $kris,
        ]);
    }

    public function create()
    {
        return Inertia::render('Kri/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'kri_code'      => 'required|string|max:50|unique:kris,kri_code',
            'name'          => 'required|string|max:255',
            'category'      => 'nullable|string|max:100',
            'current_value' => 'nullable|numeric',
            'unit'          => 'nullable|string|max:50',
            'threshold'     => 'nullable|numeric',
            'direction'     => 'nullable|string|max:50',
            'trend_data'    => 'nullable|array',
            'status'        => 'required|string|max:50',
        ]);

        Kri::create($data);

        return redirect()->route('kri.index')->with('success', 'KRI berhasil ditambahkan.');
    }

    public function edit(Kri $kri)
    {
        return Inertia::render('Kri/Edit', [
            'kri' => $kri,
        ]);
    }

    public function update(Request $request, Kri $kri)
    {
        $data = $request->validate([
            'kri_code'      => 'required|string|max:50|unique:kris,kri_code,' . $kri->id,
            'name'          => 'required|string|max:255',
            'category'      => 'nullable|string|max:100',
            'current_value' => 'nullable|numeric',
            'unit'          => 'nullable|string|max:50',
            'threshold'     => 'nullable|numeric',
            'direction'     => 'nullable|string|max:50',
            'trend_data'    => 'nullable|array',
            'status'        => 'required|string|max:50',
        ]);

        $kri->update($data);

        return redirect()->route('kri.index')->with('success', 'KRI berhasil diperbarui.');
    }

    public function destroy(Kri $kri)
    {
        $kri->delete();

        return redirect()->route('kri.index')->with('success', 'KRI berhasil dihapus.');
    }
}
