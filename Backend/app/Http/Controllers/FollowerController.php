<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowerController extends Controller
{
    // Suivre un utilisateur
    public function follow(User $user) {
        $follower = Auth::user();
        if (!$follower->following()->where('following_id', $user->id)->exists()) {
            $follower->following()->attach($user->id);
            return response()->json(['message' => 'Vous suivez maintenant ' . $user->name]);
        }
        return response()->json(['message' => 'Vous suivez déjà cet utilisateur'], 400);
    }

    // Se désabonner d'un utilisateur
    public function unfollow(User $user) {
        $follower = Auth::user();
        if ($follower->following()->where('following_id', $user->id)->exists()) {
            $follower->following()->detach($user->id);
            return response()->json(['message' => 'Vous ne suivez plus ' . $user->name]);
        }
        return response()->json(['message' => 'Vous ne suivez pas cet utilisateur'], 400);
    }

    // Vérifier si on suit un utilisateur
    public function isFollowing(User $user) {
        $isFollowing = Auth::user()->following()->where('following_id', $user->id)->exists();
        return response()->json(['isFollowing' => $isFollowing]);
    }

    // Liste des followers d'un utilisateur
    public function followers(User $user) {
        return response()->json($user->followers()->get());
    }

    // Liste des personnes suivies par un utilisateur
    public function following(User $user) {
        return response()->json($user->following()->get());
    }
}
