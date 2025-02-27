<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    //
    public function userInfo(Request $request)
    {
        $user = $request->user();

        if ($user) {
            return response()->json([
                'success' => true,
                'user' => $user
            ], 200); 
        }

        return response()->json([
            'success' => false,
            'message' => 'Utilisateur non authentifié'
        ], 401); 
    }

    
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $user
        ], 200);
    }


    public function updateCurrentUser(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 422);
        }

        $user->update([
            'name' => $request->name ?? $user->name,
            'email' => $request->email ?? $user->email,
            'password' => $request->password ? bcrypt($request->password) : $user->password,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Informations mises à jour avec succès.',
            'data' => $user,
        ], 200);
    }


    public function deleteCurrentUser(Request $request)
    {
        $user = $request->user();

        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Votre compte a été supprimé avec succès.'
        ], 200);
    }

    public function showAllUsers(Request $request)
    {
        $per_page = $request->get('per_page', 4);
        $users = User::paginate($per_page);
        return response()->json([
            'status' => 'success',
            'data' => $users
        ], 200);
    }

}
