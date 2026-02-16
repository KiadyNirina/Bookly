<?php

namespace App\Http\Controllers;

use App\Models\Save;
use Illuminate\Http\Request;

class SaveController extends Controller 
{
    public function saveBook(Request $request) {
        $bookId = $request->input('book');
        $userId = $request->input('user');

        $query = Save::create([
            'book' => $bookId,
            'user' => $userId
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $query
        ], 201);
    }
}