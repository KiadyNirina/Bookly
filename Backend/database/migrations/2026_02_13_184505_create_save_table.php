<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('save', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('book');
            $table->unsignedBigInteger('user');
            $table->timestamps();

            $table -> foreign('book') -> references('id') -> on('books') -> onDelete('cascade');
            $table -> foreign('user') -> references('id') -> on('users') -> onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('save');
    }
};
