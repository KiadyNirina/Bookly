<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('book_sessions', function (Blueprint $table) {
            $table->id();

            // Utilisateur et livre
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('book_id')->constrained()->cascadeOnDelete();

            // Tracking de lecture
            $table->unsignedInteger('current_page')->default(1);
            $table->decimal('progress_percentage', 5, 2)->default(0); // 0 à 100
            $table->unsignedInteger('duration_seconds')->default(0);

            // Vue et complétion
            $table->boolean('view_counted')->default(false);
            $table->boolean('completed')->default(false);

            // Horodatage de la session
            $table->timestamp('started_at')->nullable();
            $table->timestamp('last_activity_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('book_sessions');
    }
};