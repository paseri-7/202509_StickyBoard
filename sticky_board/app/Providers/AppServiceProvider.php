<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Repositories\IBoardRepository::class,
            \App\Repositories\impl\BoardRepository::class,
        );
        $this->app->bind(
            \App\Repositories\IStickyNoteRepository::class,
            \App\Repositories\impl\StickyNoteRepository::class,
        );
        $this->app->bind(
            \App\Repositories\IBoardAreaRepository::class,
            \App\Repositories\impl\BoardAreaRepository::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
