<?php
    $manifest = json_decode(
        file_get_contents(public_path('build/.vite/manifest.json')),
        true
    );

    $entry = $manifest['index.html'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?php echo e(config('app.name')); ?></title>
    <link rel="shortcut icon" href="./safe.png" type="image/x-icon">

    <?php if(isset($entry['css'])): ?>
        <?php $__currentLoopData = $entry['css']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $css): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <link rel="stylesheet" href="<?php echo e(asset('build/' . $css)); ?>">
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    <?php endif; ?>
</head>
<body>
    <div id="root"></div>

    <script type="module" src="<?php echo e(asset('build/' . $entry['file'])); ?>"></script>
</body>
</html>
<?php /**PATH /home/chalasimon/Child_Protection_Case_Management_System/resources/views/app.blade.php ENDPATH**/ ?>