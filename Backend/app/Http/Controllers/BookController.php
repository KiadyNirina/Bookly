<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;

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
            'file' => 'required|file|mimes:pdf,doc,docx',
        ]);

        if ($request->hasFile('picture')) {
            $imagePath = $request->file('picture')->store('public/images');
            $validatedData['picture'] = str_replace('public/', 'storage/', $imagePath);
        } else {
            $validatedData['picture'] = 'storage/images/default.jpg';
        }

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('books', 'public');
            $validatedData['file'] = $filePath;
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


    public function getRecentBooks(Request $request)
    {
        $perPage = $request->get('per_page', 4);

        $books = Book::with('posted_by') 
                    ->orderBy('created_at', 'desc')
                    ->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $books
        ], 200);
    }


    public function show($id)
    {
        $book = Book::with('posted_by')->find($id);
        
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


    public function getBooksByUser(Request $request)
    {
        $books = Book::where('posted_by', $request->user()->id)
                     ->orderBy('created_at', 'desc')
                     //->get()
                     ->paginate($request->get('per_page', 4));
        
        //$books = Book::paginate($request->get('per_page', 4)); 

        if ($books->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Aucun livre trouvé pour cet utilisateur'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $books
        ], 200);
    }


    public function getBooksByUserSelected($id)
    {
        $perPage = request()->get('per_page', 4);
        $books = Book::where('posted_by', $id)
                     ->orderBy('created_at', 'desc')
                     ->paginate($perPage);
        
        if ($books->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Aucun livre trouvé pour cet utilisateur'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $books
        ], 200);
    }

    public function getFile($id)
    {
        $book = Book::findOrFail($id);

        $filePath = storage_path('app/public/' . $book->file);

        if (!file_exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        return response()->file($filePath, [
            'Content-Type' => 'application/epub+zip',
            'Access-Control-Allow-Origin' => 'http://localhost:5173',
        ]);
    }

    public function search(Request $request)
    {
        $q = $request->query('q');

        if (!$q) {
            return response()->json([
                'books' => [],
                'users' => [],
            ]);
        }

        $books = Book::where('title', 'like', "%$q%")
                    ->orWhere('author', 'like', "%$q%")
                    ->with('posted_by')
                    ->get();

        $users = User::where('name', 'like', "%$q%")
                    ->orWhere('email', 'like', "%$q%")
                    ->get();

        return response()->json([
            'books' => $books,
            'users' => $users,
        ]);
    }
}