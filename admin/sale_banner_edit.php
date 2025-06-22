<?php
include './inc/config.php';

$left = $_POST['left_text'];
$center = $_POST['center_text'];
$right = $_POST['right_text'];
$subtext = $_POST['subtext'];
$bg_type = $_POST['bg_type'];
$bg_value = '';

if ($bg_type === 'color') {
    $bg_value = $_POST['bg_value_color'];
} elseif ($bg_type === 'image' && isset($_FILES['bg_image']['tmp_name'])) {
    $targetDir = "uploads/";
    $fileName = time() . "_" . basename($_FILES["bg_image"]["name"]);
    $targetFile = $targetDir . $fileName;
    move_uploaded_file($_FILES["bg_image"]["tmp_name"], $targetFile);
    $bg_value = $targetFile;
}

$conn->query("INSERT INTO tbl_banner (left_text, center_text, right_text, subtext, bg_type, bg_value)
              VALUES ('$left', '$center', '$right', '$subtext', '$bg_type', '$bg_value')");

header("Location: sale_banner.php");
?>