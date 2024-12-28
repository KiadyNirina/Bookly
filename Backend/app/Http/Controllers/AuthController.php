<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;
use Google_Client;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json($user, 201);
    }

    public function login (Request $request) 
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request) 
    {
        $user = $request -> user();
        $user -> tokens() -> delete();

        return response() -> json(['message' => 'Logged out']);
    }

    public function googleLogin(Request $request)
    {
        try {
            // Récupérer le token envoyé par le frontend
            $token = $request->input('token');

            // Initialiser le client Google
            $client = new Google_Client();
            $client->setClientId('427222673098-tujgvjf5mm6b9djup602111qja0rit86.apps.googleusercontent.com');

            // Vérifier le token Google
            $payload = $client->verifyIdToken($token);

            if ($payload) {
                // Token valide, récupérer les informations de l'utilisateur
                $userId = $payload['sub'];
                $email = $payload['email'];
                $name = $payload['name'];

                // Vérifier si l'utilisateur existe déjà dans la base de données
                $user = User::where('email', $email)->orWhere('google_id', $userId)->first();

                if (!$user) {
                    // L'utilisateur n'existe pas, donc on le crée
                    $user = User::create([
                        'google_id' => $userId,
                        'name' => $name,
                        'email' => $email,
                        'password' => bcrypt(Str::random(24)), // Mot de passe sécurisé généré aléatoirement
                    ]);
                }

                // Retourner une réponse avec le token JWT
                $token = $user->createToken('Bookly')->plainTextToken;

                return response()->json([
                    'success' => true,
                    'user' => $user,
                    'token' => $token
                ]);
            } else {
                return response()->json(['success' => false, 'message' => 'Token invalide'], 400);
            }
        } catch (\Exception $e) {
            // Gestion des erreurs
            return response()->json(['success' => false, 'message' => 'Erreur serveur: ' . $e->getMessage()], 500);
        }
    }
}
