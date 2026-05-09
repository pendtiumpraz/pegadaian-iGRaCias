<?php

namespace App\Http\Controllers;

use App\Models\Regulation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegulationController extends Controller
{
    public function index(Request $request)
    {
        $query = Regulation::latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('issuer')) {
            $query->where('issuer', $request->issuer);
        }

        $regulations = $query->paginate(20)->withQueryString();

        return Inertia::render('Regulation/Index', [
            'regulations' => $regulations,
            'filters'     => $request->only(['status', 'issuer']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Regulation/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'reg_code'       => 'required|string|max:50|unique:regulations,reg_code',
            'name'           => 'required|string|max:255',
            'issuer'         => 'nullable|string|max:255',
            'effective_date' => 'nullable|date',
            'owner_div'      => 'nullable|string|max:255',
            'gap_count'      => 'nullable|integer|min:0',
            'status'         => 'required|string|max:50',
            'page_count'     => 'nullable|integer|min:0',
            'max_penalty'    => 'nullable|numeric|min:0',
        ]);

        Regulation::create($data);

        return redirect()->route('regulations.index')->with('success', 'Regulasi berhasil ditambahkan.');
    }

    public function show(Regulation $regulation)
    {
        $regulation->load('obligations');

        return Inertia::render('Regulation/Show', [
            'regulation' => $regulation,
        ]);
    }

    public function edit(Regulation $regulation)
    {
        return Inertia::render('Regulation/Edit', [
            'regulation' => $regulation,
        ]);
    }

    public function update(Request $request, Regulation $regulation)
    {
        $data = $request->validate([
            'reg_code'       => 'required|string|max:50|unique:regulations,reg_code,' . $regulation->id,
            'name'           => 'required|string|max:255',
            'issuer'         => 'nullable|string|max:255',
            'effective_date' => 'nullable|date',
            'owner_div'      => 'nullable|string|max:255',
            'gap_count'      => 'nullable|integer|min:0',
            'status'         => 'required|string|max:50',
            'page_count'     => 'nullable|integer|min:0',
            'max_penalty'    => 'nullable|numeric|min:0',
        ]);

        $regulation->update($data);

        return redirect()->route('regulations.show', $regulation)->with('success', 'Regulasi berhasil diperbarui.');
    }

    public function destroy(Regulation $regulation)
    {
        $regulation->delete();

        return redirect()->route('regulations.index')->with('success', 'Regulasi berhasil dihapus.');
    }
}
