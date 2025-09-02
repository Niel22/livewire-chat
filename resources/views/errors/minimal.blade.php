<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>@yield('title')</title>
        @vite(['resources/css/app.css'])
    </head>
    <body class="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 h-screen flex items-center justify-center">
        <div class="text-center px-6">
            <h1 class="text-9xl font-extrabold text-red-600">@yield('code')</h1>
            <h2 class="mt-4 text-2xl font-semibold">@yield('title')</h2>
            <p class="mt-2 text-lg">@yield('message')</p>
            <div class="mt-6">
                <a href="{{ url()->previous() }}"
                   class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                    Go Back
                </a>
                <a href="{{ url('/') }}"
                   class="inline-block px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition ml-3">
                    Home
                </a>
            </div>
        </div>
    </body>
</html>
