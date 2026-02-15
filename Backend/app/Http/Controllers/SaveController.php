<?php

namespace App\Http\Controllers;

use App\Models\Save;
use Illuminate\Http\Request;

class SaveController extends Controller 
{
    public function saveBook($idBook, Request $request) {
        $user = $request->user();
        
        $query = Save::create([
            'book' => $idBook,
            'user' => $user->id
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $query
        ], 201);
    }
}