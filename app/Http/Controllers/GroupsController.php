<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\ERDUsers;
use App\Models\Group;
use App\Models\Groups;
use App\Models\GroupUser;
use App\Models\NilaiERD;
use App\Models\NilaiERDGroup;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GroupsController extends Controller
{
    public function index()
    {
        // Retrieve all users and groups
        $users = User::where('role_id', 2)->get();
        $groups = Groups::with('users')->get();
        $usersGroups = GroupUser::with('user')->get();

        return inertia('Group/Index', [
            'users' => $users,
            'groups' => $groups,
            'usersGroups' => $usersGroups,
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
        $user = Auth::user();
        $groups = Groups::with('users')->get();
        $nilaiERDGroups = NilaiERDGroup::all();
        $commentUser = Comment::with('user')->get();
        $usersGroups = GroupUser::with('user')->get();

        // Find the group that includes the logged-in user
        $userGroup = GroupUser::where('user_id', $user->id)->first();

        if ($userGroup) {
            // Get all user IDs in the same group
            $groupUserIds = GroupUser::where('group_id', $userGroup->group_id)->pluck('user_id');

            // Get ERDUsers for the logged-in user and users in the same group
            $erdUser = ERDUsers::whereIn('user_id', $groupUserIds)->get();
        } else {
            $erdUser = collect(); // Empty collection if the user is not in any group
        }

        return inertia('DrawIo/Index', [
            'groups' => $groups,
            'nilaiERDGroups' => $nilaiERDGroups,
            'erdUser' => $erdUser,
            'commentUser' => $commentUser,
            'usersGroups' => $usersGroups,
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

    public function setLeader($group, $id)
    {
        $group = Groups::find($group);

        // Set is_leader to false for all users in the group
        $group->users()->updateExistingPivot($group->users()->pluck('users.id')->toArray(), ['is_leader' => false]);

        // Set is_leader to true for the new leader
        $group->users()->updateExistingPivot($id, ['is_leader' => true]);

        return back()->with('success', 'Group leader updated successfully!');
    }

    public function removeLeader($group, $id)
    {
        $group = Groups::find($group);
        $group->users()->updateExistingPivot($id, ['is_leader' => false]);

        return back()->with('success', 'Group leader removed successfully!');
    }

    public function storeTask(Request $request, $id)
    {
        $request->validate([
            'task' => 'required|string',
        ]);

        $group = NilaiERDGroup::where('group_id', $id)->first();

        if ($group) {
            $group->update([
                'task' => $request->task,
            ]);
            $group->save();
        } else {
            NilaiERDGroup::create([
                'group_id' => $id,
                'task' => $request->task,
            ]);
        }

        return back()->with('success', 'Task added successfully!');
    }
}
