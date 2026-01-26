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
        Schema::table('sticky_notes', function (Blueprint $table) {
            $table->timestamp('notified_at')->nullable()->after('due_at');
            $table->index(['due_at', 'notified_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sticky_notes', function (Blueprint $table) {
            $table->dropIndex(['due_at', 'notified_at']);
            $table->dropColumn('notified_at');
        });
    }
};
