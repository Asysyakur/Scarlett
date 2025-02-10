<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Groups;
use App\Models\NilaiERDGroup;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GroupsController extends Controller
{
    public function index()
    {
        // Retrieve all users and groups
        $users = User::where('role_id', 2)->get();
        $groups = Groups::with('users')->get();

        return inertia('Group/Index', [
            'users' => $users,
            'groups' => $groups,
        ]);
    }


    public function storeMany(Request $request)
    {
        $request->validate([
            'count' => 'required|integer|min:1',
        ]);

        // Detach users from all groups
        foreach (Groups::all() as $group) {
            $group->users()->detach(); // Detach all users from the group
        }

        // Delete existing groups
        Groups::query()->delete();

        // Create new groups based on the provided count
        for ($i = 1; $i <= $request->count; $i++) {
            Groups::create([
                'name' => 'Kelompok ' . $i,
            ]);
        }

        return redirect()->back()->with('success', 'Groups updated successfully!');
    }



    public function randomize()
    {
        // Fetch users with role_id = 2 and shuffle them
        $users = User::where('role_id', 2)->get()->shuffle();

        // Fetch all groups
        $groups = Groups::all();
        $groupCount = $groups->count();
        $userCount = $users->count();

        // Calculate base group size and remainder
        $groupSize = floor($userCount / $groupCount);
        $remainder = $userCount % $groupCount;

        // Distribute users into groups
        $index = 0; // Start index for users
        foreach ($groups as $group) {
            // Get the users for this group
            $size = $groupSize + ($index < $remainder ? 1 : 0); // Add one extra user if this group is in the remainder
            $group->users()->sync($users->splice(0, $size)->pluck('id'));
            $index++;
        }

        return redirect()->back()->with('success', 'Users with role_id 2 randomized into groups!');
    }

    public function updateDrawioLink(Request $request, Groups $group)
    {
        $request->validate([
            'drawio_link' => 'required|url',
        ]);

        $group->drawio_link = $request->drawio_link;
        $group->save();

        return back()->with('success', 'Draw.io link updated successfully!');
    }

    public function indexDiagram()
    {
        $groups = Groups::with('users')->get();
        $nilaiERDGroups = NilaiERDGroup::all();

        return inertia('DrawIo/Index', [
            'groups' => $groups,
            'nilaiERDGroups' => $nilaiERDGroups,
        ]);
    }

    public function addStudent(Request $request, Groups $group)
    {
        $request->validate([
            'users' => 'required|exists:users,id',
        ]);

        $group->users()->attach($request->users);

        return back()->with('success', 'Student added to group successfully!');
    }

    public function removeStudent($group, $id)
    {
        Groups::find($group)->users()->detach($id);

        // return back()->with('success', 'Student removed from group successfully!');
    }
}
