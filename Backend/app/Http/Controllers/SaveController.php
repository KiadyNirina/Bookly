<?php

namespace App\Http\Controllers;

use App\Models\Save;
use Illuminate\Http\Request;

class SaveController extends Controller 
{
    public function saveBook(Request $request) {

        $request->validate([
            'book' => 'required|integer|exists:books,id',
            'user' => 'required|integer|exists:users,id',
        ]);
        
        $existingSave = Save::where('book', $request->book)
                            ->where('user', $request->user)
                            ->first();
        
        if ($existingSave) {
            return response()->json([
                'success' => false,
                'message' => 'Ce livre est déjà dans votre bibliothèque',
                'already_saved' => true,
                'data' => $existingSave
            ], 409);
        }

        $query = Save::create([
            'book' => $request->book,
            'user' => $request->user,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Livre ajouté à votre bibliothèque',
            'saved' => true,
            'data' => $query
        ], 201);
    }

    // Vérifier si un livre est sauvegardé
    public function checkIfSaved($bookId, $userId)
    {
        $exists = Save::where('book', $bookId)
                      ->where('user', $userId)
                      ->exists();
        
        return response()->json([
            'saved' => $exists
        ]);
    }
    
    // Récupérer tous les livres sauvegardés par un utilisateur
    public function getUserSaves($userId)
    {
        $saves = Save::with('book')
                     ->where('user', $userId)
                     ->get();
        
        return response()->json([
            'saves' => $saves
        ]);
    }

    // Supprimer un livre de la bibliothèque de l'utilisateur
    public function unsaveBook($bookId)
    {
        $save = Save::where('book', $bookId)
                    ->where('user', auth()->id())
                    ->first();
        
        if (!$save) {
            return response()->json([
                'success' => false,
                'message' => 'Ce livre n\'est pas dans votre bibliothèque'
            ], 404);
        } else {
            $save->delete();
            return response()->json([
                'success' => true,
                'message' => 'Livre retiré de votre bibliothèque'
            ], 200);
        }
    }
}