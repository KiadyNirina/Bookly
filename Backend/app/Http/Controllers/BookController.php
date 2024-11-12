<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    //
    public function store(Request $request) {
        $validated = $request -> validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'description' => 'required|string',
            'genre' => 'required|string|max:255',
            'posted_by' => 'required|exists:users,id',
            'lang' => 'required|string|max:255',
            'page' => 'required|integer',
            'date' => 'required|date',
            'picture' => 'required|image|max:2048',
        ]);

        if($request -> hasFile('picture')) {
            $validated['picture'] = $request -> file('picture') -> store('book_pictures', 'public');
        }

        $book = Book::create($validated);

        return response() -> json([
            'message' => 'Book created with success!',
            'book' => $book,
        ], 201);
    }
}
