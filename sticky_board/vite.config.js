import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/components/page/auth/login/login.page.tsx',
                'resources/js/components/page/board_list/board_list.page.tsx',
                'resources/js/components/page/board_detail/board_detail.page.tsx',
                'resources/js/components/page/board_form/board_form.page.tsx',
                'resources/js/components/page/board_form/board_edit.page.tsx',
                'resources/js/components/page/notification_list/notification_list.page.tsx',
            ],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        host: true,
        hmr: {
            host: 'localhost',
        },
    },
});
