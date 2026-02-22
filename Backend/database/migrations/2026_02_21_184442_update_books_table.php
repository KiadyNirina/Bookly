<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('books', function (Blueprint $table) {

            $table->unsignedBigInteger('views_count')->default(0);
            $table->unsignedInteger('completed_count')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {

            $table->dropColumn([
                'views_count',
                'completed_count'
            ]);
        });
    }
};