<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Materi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MateriController extends Controller
{
    public function index()
    {
        $materis = Materi::all();
        return Inertia::render('Materi/Index', [
            'materis' => $materis,
        ]);
    }

    public function show(Materi $materi)
    {
        return Inertia::render('Materi/Show', [
            'materi' => $materi,
        ]);
    }

    public function store(Request $request)
    {
        // Validate the request data
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'nullable|string',
            'image' => 'nullable|image',
            'video' => 'nullable|url',
            'file' => 'nullable|file',
            'link' => 'nullable|url',
        ]);

        // Handle file uploads if any
        $data = $request->only(['title', 'description', 'content', 'link', 'video']);

        // Store files in 'public' disk for accessibility
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('materi_images', 'public');
        }
        if ($request->hasFile('file')) {
            $data['file'] = $request->file('file')->store('materi_files', 'public');
        }

        // Create the new Materi
        Materi::create($data);

    }

    public function update(Request $request, Materi $materi)
    {
        // Validate incoming data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'nullable|string',
            'video' => 'nullable|url',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,xls,xlsx|max:10240',
            'link' => 'nullable|url',
        ]);

        // Update the Materi record
        $materi->title = $request->title;
        $materi->description = $request->description;
        $materi->content = $request->content;
        $materi->video = $request->video;
        $materi->link = $request->link;

        // Handle file uploads
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($materi->image) {
                Storage::delete('public/' . $materi->image);
            }
            // Store the new image
            $materi->image = $request->file('image')->store('materi_images', 'public');
        }

        if ($request->hasFile('file')) {
            // Delete the old file if it exists
            if ($materi->file) {
                Storage::delete('public/' . $materi->file);
            }
            // Store the new file
            $materi->file = $request->file('file')->store('materi_files', 'public');
        }

        // Save the updated Materi
        $materi->save();

    }

    public function dragAndDrop(Materi $materi)
    {
        $tables = $materi->tables;
        $attributes = $materi->attributes;
        $relations = $materi->relations;

        return Inertia::render('Materi/DragAndDrop', [
            'materi' => $materi,
            'tables' => $tables,
            'attributes' => $attributes,
            'relations' => $relations,
        ]);
    }
}
