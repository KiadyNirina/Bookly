<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\User;
use App\Models\BookSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;
use Illuminate\Support\Str;

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
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'file' => 'required|file|mimes:pdf,doc,docx',
        ]);

        if ($request->hasFile('picture')) {
            $imagePath = $request->file('picture')->store('public/images');
            $validatedData['picture'] = str_replace('public/', 'storage/', $imagePath);
        } else {
            $validatedData['picture'] = 'images/default.jpg';
        }

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('books', 'private');
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

        $filePath = storage_path('app/private/' . $book->file);
        $fileName = Str::slug($book->title) . '.pdf';

        if (!file_exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        return response()->file($filePath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $fileName . '"',
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

        $books = Book::query()
                    ->leftJoin('users', 'books.posted_by', '=', 'users.id')
                    ->where(function ($query) use ($q) {
                        $query->where('books.title', 'like', "%$q%")
                            ->orWhere('books.author', 'like', "%$q%")
                            ->orWhere('users.name', 'like', "%$q%");
                    })
                    ->select('books.*', 'users.name as poster_name')
                    ->get();

        $users = User::where('name', 'like', "%$q%")
                    ->orWhere('email', 'like', "%$q%")
                    ->get();

        return response()->json([
            'books' => $books,
            'users' => $users,
        ]);
    }

    public function bookCountUser(Request $request) {
        $user = $request->user();
        $countBook = Book::where('posted_by', $user->id)
                    ->count();

        return response()->json([
            'bookCount' => $countBook
        ]);
    }

    public function getGenres()
    {
        $genres = Book::select('genre')
            ->whereNotNull('genre')
            ->where('genre', '!=', '')
            ->distinct()
            ->orderBy('genre')
            ->pluck('genre')
            ->toArray();

        return response()->json($genres);
    }

    /**
     * Stream sécurisé du livre PDF
     */
    public function stream(Book $book)
    {
        // Vérifie que l'utilisateur peut accéder au livre
        //$this->authorize('view', $book);

        $filePath = storage_path("app/private/{$book->file}");
        if (!file_exists($filePath)) {
            abort(404, 'Fichier introuvable.');
        }

        return response()->file($filePath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline'
        ]);
    }

    /**
     * Démarre une session de lecture
     */
    public function startSession(Book $book)
    {
        // ✅ Supprimer ou archiver les sessions actives précédentes pour éviter les doublons
        BookSession::where('user_id', auth()->id())
            ->where('book_id', $book->id)
            ->where('completed', false)
            ->update(['completed' => true]); // Archive les anciennes
        
        $session = BookSession::create([
            'user_id' => auth()->id(),
            'book_id' => $book->id,
            'current_page' => 1,
            'progress_percentage' => 0,
            'duration_seconds' => 0,
            'view_counted' => false,
            'completed' => false,
            'started_at' => now(),
            'last_activity_at' => now()
        ]);

        return response()->json(['data' => $session]);
    }

    /**
     * Met à jour la progression de lecture
     */
    public function updateProgress(Request $request, BookSession $session)
    {
        $request->validate([
            'current_page' => 'required|integer|min:1',
            'time_spent' => 'required|integer|min:1',
            'total_pages' => 'nullable|integer|min:1'
        ]);

        $session->current_page = $request->current_page;
        $session->duration_seconds += $request->time_spent;

        $totalPages = $validated['total_pages'] ?? $session->book->pages ?? 1;
        $session->progress_percentage = min(100, 
            ($session->current_page / $totalPages) * 100
        );

        $session->last_activity_at = now();
        $session->save();

        $viewCounted = $this->validateView($session);
        $this->checkCompletion($session);
        
        return response()->json([
            'data' => $session,
            'view_counted' => $viewCounted
        ]);
    }

    /**
     * Valide si la session peut compter comme une vue
     */
    private function validateView(BookSession $session)
    {
        if (
            $session->progress_percentage >= 5 && // au moins 5% lu
            $session->duration_seconds >= 45 &&  // au moins 45 sec passées
            !$session->view_counted
        ) {
            $session->book->increment('views_count');
            $session->view_counted = true;
            $session->save();

            return true;
        }
        return false;
    }

    /**
     * Vérifie si le livre est terminé
     */
    private function checkCompletion(BookSession $session)
    {
        if ($session->progress_percentage >= 95 && !$session->completed) {
            $session->completed = true;
            $session->save();

            // On peut aussi incrémenter un compteur global
            $session->book->increment('completed_count');
        }
    }

    /**
     * Reprendre une session existante
     */
    public function resumeSession(Book $book)
    {
        $session = BookSession::where('user_id', auth()->id())
            ->where('book_id', $book->id)
            ->latest()
            ->first();

        if (!$session) {
            // ✅ Retourner 200 avec null plutôt que 404 pour simplifier le frontend
            return response()->json(['data' => null]);
        }

        return response()->json([
            'data' => [
                'id' => $session->id,
                'current_page' => $session->current_page,
                'progress_percentage' => (float) $session->progress_percentage,
                'duration_seconds' => $session->duration_seconds,
                'last_activity_at' => $session->last_activity_at
            ]
        ]);
    }
}