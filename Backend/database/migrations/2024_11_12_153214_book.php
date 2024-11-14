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
        Schema::create('books', function (Blueprint $table) {
            $table -> id();
            $table -> string('title');
            $table -> string('author');
            $table -> text('description');
            $table -> string('genre');
            $table->unsignedBigInteger('posted_by');
            $table -> string('lang', 5);
            $table -> integer('page');
            $table -> date('date') -> nullable();
            $table -> string('picture') -> nullable();
            $table -> timestamps();

            $table -> foreign('posted_by') -> references('id') -> on('users') -> onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
