@php
    $manifest = json_decode(
        file_get_contents(public_path('build/.vite/manifest.json')),
        true
    );

    $entry = $manifest['index.html'];
@endphp

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{config('app.name')}}</title>
    <link rel="shortcut icon" href="./safe.png" type="image/x-icon">

    @if(isset($entry['css']))
        @foreach($entry['css'] as $css)
            <link rel="stylesheet" href="{{ asset('build/' . $css) }}">
        @endforeach
    @endif
</head>
<body>
    <div id="root"></div>

    <script type="module" src="{{ asset('build/' . $entry['file']) }}"></script>
</body>
</html>
