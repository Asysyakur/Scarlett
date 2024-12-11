<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Atribut;
use App\Models\ERDUser;
use App\Models\Materi;
use App\Models\Relasi;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    public function dndSave(Request $request)
    {
        // Validate incoming request data (array of tables)
        $request->validate([
            'tables.*.materi_id' => 'required|exists:materis,id',
            'tables.*.table_id' => 'required|exists:erd_tables,id',
            'tables.*.user_id' => 'required|exists:users,id',
            'tables.*.attributes' => 'nullable|array', // You can validate attributes if needed
        ]);

        // Loop through the tables and save or update each one
        try {
            foreach ($request->all() as $table) {
                // Check if the record exists based on materi_id, table_id, and user_id
                $existingRecord = ERDUser::where('materi_id', $table['materi_id'])
                    ->where('table_id', $table['table_id'])
                    ->where('user_id', $table['user_id'])
                    ->first();

                if ($existingRecord) {
                    // If the record exists, update it
                    $existingRecord->update([
                        'attributes' => json_encode($table['attributes']), // Update attributes
                    ]);
                } else {
                    // If the record doesn't exist, create a new one
                    ERDUser::create([
                        'materi_id' => $table['materi_id'],
                        'table_id' => $table['table_id'],
                        'user_id' => $table['user_id'],
                        'attributes' => json_encode($table['attributes']), // Store attributes as JSON
                    ]);
                }
            }

            return response()->json([
                'message' => 'Data saved or updated successfully!',
            ], 200);
        } catch (\Exception $e) {
            // Return a response with an error message if something goes wrong
            return response()->json([
                'message' => 'Error saving or updating data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'required|string',
            'image' => 'nullable|image',
            'video' => 'nullable|url',
            'file' => 'nullable|file',
            'dnd' => 'required|string',
            'studikasus' => 'required|string',
        ]);

        // Convert 'dnd' and 'studikasus' to boolean
        $dnd = filter_var($request->input('dnd'), FILTER_VALIDATE_BOOLEAN);
        $studikasus = filter_var($request->input('studikasus'), FILTER_VALIDATE_BOOLEAN);

        // Prepare data for saving
        $data = $request->only(['title', 'description', 'content', 'video']);
        $data['dnd'] = $dnd;
        $data['studikasus'] = $studikasus;

        // Handle file uploads if any
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('materi_images', 'public');
        }
        if ($request->hasFile('file')) {
            $data['file'] = $request->file('file')->store('materi_files', 'public');
        }

        // Create the new Materi record
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
            'dnd' => 'required|string',
            'studikasus' => 'required|string',
        ]);

        $dnd = filter_var($request->input('dnd'), FILTER_VALIDATE_BOOLEAN);
        $studikasus = filter_var($request->input('studikasus'), FILTER_VALIDATE_BOOLEAN);
        // Update the Materi record
        $materi->title = $request->title;
        $materi->description = $request->description;
        $materi->content = $request->content;
        $materi->video = $request->video;
        $materi->dnd = $dnd;
        $materi->studikasus = $studikasus;

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

    public function destroy($id)
    {
        try {
            $materi = Materi::findOrFail($id); // Pastikan materi ada
            $materi->delete(); // Hapus materi dari database

            return response()->json(['message' => 'Materi berhasil dihapus'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan saat menghapus test'], 500);
        }
    }

    public function dragAndDrop(Materi $materi)
    {
        // Get related tables, attributes, and relations for the materi
        $tables = $materi->tables;
        $attributes = $materi->attributes;
        $relations = $materi->relations;

        // Get the authenticated user
        $authUser = Auth::user();

        // Fetch all saved ERD data for the authenticated user and specific materi
        $erdSave = ERDUser::where('materi_id', $materi->id)
            ->where('user_id', $authUser->id)
            ->get(); // Use `get()` to fetch all matching records

        // Parse attributes JSON string into an array
        $erdSave = $erdSave->map(function ($erd) {
            $erd->attributes = json_decode($erd->attributes, true); // Convert JSON string to an array
            return $erd;
        });

        return Inertia::render('Materi/DragAndDrop', [
            'materi' => $materi,
            'tables' => $tables,
            'attributes' => $attributes,
            'relations' => $relations,
            'erdSave' => $erdSave, // Pass all the saved ERD data with parsed attributes
        ]);
    }



    public function editAttribute(Request $request, $id)
    {
        // Validate incoming request
        $request->validate([
            'attributes.*.id' => 'required|string|max:255',
            'attributes.*.label' => 'required|string|max:255',
        ]);

        // Loop through the validated 'tables' data
        foreach ($request->all() as $attr) {
            if ($attr['id'] != 0) {
                // If the table ID is not 0, update the existing record
                $att = Atribut::find($attr['id']); // Find the table by ID
                if ($att) {
                    // If the table exists, update the 'name' field
                    $att->update(['label' => $attr['label']]);
                } else {
                    // If the table doesn't exist, create a new record
                    Atribut::create([
                        'id' => $attr['id'], // Using the provided id
                        'label' => $attr['label'], // Using the provided label
                        'materi_id' => $id, // Assuming materi_id is in the request
                    ]);
                }
            } else {
                // If the table ID is 0, it means this is a new table, so create a new record
                Atribut::create([
                    'label' => $attr['label'], // Using the provided name
                    'materi_id' => $id, // Assuming materi_id is in the request
                ]);
            }
        }
        return response()->json([
            'message' => 'Attributes updated/created successfully!',
        ]);
    }

    public function editTable(Request $request, $id)
    {
        // Validate incoming request
        $request->validate([
            'tables.*.id' => 'required|string|max:255',
            'tables.*.name' => 'required|string|max:255',
        ]);

        // Loop through the validated 'tables' data
        foreach ($request->all() as $table) {
            if ($table['id'] != 0) {
                // If the table ID is not 0, update the existing record
                $att = Table::find($table['id']); // Find the table by ID
                if ($att) {
                    // If the table exists, update the 'name' field
                    $att->update(['name' => $table['name']]);
                } else {
                    // If the table doesn't exist, create a new record
                    Table::create([
                        'id' => $table['id'], // Using the provided id
                        'name' => $table['name'], // Using the provided name
                        'materi_id' => $id, // Assuming materi_id is in the request
                    ]);
                }
            } else {
                // If the table ID is 0, it means this is a new table, so create a new record
                Table::create([
                    'name' => $table['name'], // Using the provided name
                    'materi_id' => $id, // Assuming materi_id is in the request
                ]);
            }
        }

        return response()->json([
            'message' => 'Tables updated/created successfully!',
        ]);
    }
    public function editRelation(Request $request, $id)
    {
        // Validate incoming request
        $request->validate([
            'relation.*.id' => 'required|string|max:255',
            'relation.*.from' => 'required|string|max:255', // Ensure 'from' is a string (table name)
            'relation.*.to' => 'required|string|max:255',   // Ensure 'to' is a string (table name)
            'relation.*.type' => 'required|string|max:255',  // Relation type
        ]);

        // Loop through the validated 'tables' data
        foreach ($request->all() as $relation) {
            if ($relation['id'] != 0) {
                // If the table ID is not 0, update the existing record
                $att = Relasi::find($relation['id']); // Find the table by ID
                if ($att) {
                    // If the table exists, update the 'name' field
                    $att->update(['from' => $relation['from']]);
                    $att->update(['to' => $relation['to']]);
                    $att->update(['type' => $relation['type']]);
                } else {
                    // If the table doesn't exist, create a new record
                    Relasi::create([
                        'id' => $relation['id'], // Using the provided id
                        'from' => $relation['from'],  // Use the string value for 'from' (table name)
                        'to' => $relation['to'],      // Use the string value for 'to' (table name)
                        'type' => $relation['type'],  // Type value from the request
                        'materi_id' => $id, // Assuming materi_id is in the request
                    ]);
                }
            } else {
                // If the table ID is 0, it means this is a new table, so create a new record
                Relasi::create([
                    'from' => $relation['from'],  // Use the string value for 'from' (table name)
                    'to' => $relation['to'],      // Use the string value for 'to' (table name)
                    'type' => $relation['type'],  // Type value from the request
                    'materi_id' => $id, // Assuming materi_id is in the request
                ]);
            }
        }

        return response()->json([
            'message' => 'Relation updated/created successfully!',
        ]);
    }

    public function destroyAttribute($id)
    {
        try {
            $attr = Atribut::findOrFail($id);
            $attr->delete();
            return response()->json(['message' => 'Attribute berhasil dihapus'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan saat menghapus attribute'], 500);
        }
    }

    public function destroyTable($id)
    {
        try {
            $table = Table::findOrFail($id);
            $table->delete();

            return response()->json(['message' => 'Table berhasil dihapus'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan saat menghapus table'], 500);
        }
    }
    public function destroyRelation($id)
    {
        try {
            $relation = Relasi::findOrFail($id);
            $relation->delete();

            return response()->json(['message' => 'Relation berhasil dihapus'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan saat menghapus relation'], 500);
        }
    }
}
