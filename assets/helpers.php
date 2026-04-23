<?php
function resolveImage($baseName) {
    $extensions = ['png', 'jpg', 'jpeg', 'webp'];
    foreach ($extensions as $ext) {
        $path = "images/" . $baseName . "." . $ext;
        if (file_exists(__DIR__ . "/../" . $path)) {
            return $path;
        }
    }
    return null;
}

function resolveImageFromPages($baseName) {
    $extensions = ['png', 'jpg', 'jpeg', 'webp'];
    foreach ($extensions as $ext) {
        $path = "../images/" . $baseName . "." . $ext;
        if (file_exists(__DIR__ . "/../images/" . $baseName . "." . $ext)) {
            return $path;
        }
    }
    return null;
}
?>