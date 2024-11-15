<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'description' => 'required|string',
            'genre' => 'required|string|max:255',
            'posted_by' => 'required|exists:users,id',
            'lang' => 'required|string|max:10',
            'page' => 'required|integer',
            'date' => 'nullable|date',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('picture')) {
            $imagePath = $request->file('picture')->store('public/images');
            $validatedData['picture'] = str_replace('public/', 'storage/', $imagePath);
        }

        $book = Book::create($validatedData);

        return response()->json([
            'status' => 'success',
            'data' => $book
        ], 201);
    }


    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'author' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'genre' => 'sometimes|required|string|max:255',
            'posted_by' => 'sometimes|required|exists:users,id',
            'lang' => 'sometimes|required|string|max:10',
            'page' => 'sometimes|required|integer',
            'date' => 'nullable|date',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $book = Book::find($id);
        if (!$book) {
            return response()->json([
                'status' => 'error',
                'message' => 'Livre non trouvé'
            ], 404);
        }

        if ($request->hasFile('picture')) {
            $imagePath = $request->file('picture')->store('public/images');
            $validatedData['picture'] = str_replace('public/', 'storage/', $imagePath);
        }

        $book->update($validatedData);

        return response()->json([
            'status' => 'success',
            'data' => $book
        ], 200);
    }


    public function destroy($id)
    {
        $book = Book::find($id);
        if (!$book) {
            return response()->json([
                'status' => 'error',
                'message' => 'Livre non trouvé'
            ], 404);
        }

        $book->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Livre supprimé avec succès'
        ], 200);
    }


    public function getRecentBooks()
    {
        $books = Book::orderBy('created_at', 'desc')->take(10)->get();

        return response()->json([
            'status' => 'success',
            'data' => $books
        ], 200);
    }


    public function show($id)
    {
        $book = Book::find($id);
        
        if (!$book) {
            return response()->json([
                'status' => 'error',
                'message' => 'Livre non trouvé'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $book
        ], 200);
    }
}