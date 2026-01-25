<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title')</title>
    @vite('resources/css/app.css')
    @viteReactRefresh
    @stack('vite')
</head>
<body>
    <div id="app" @yield('app-attributes')></div>
</body>
</html>
