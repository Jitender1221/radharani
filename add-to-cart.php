<?php
session_start();
require_once('admin/inc/config.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product_id = $_POST['product_id'] ?? '';
    $size_name = $_POST['size'] ?? '';
    $color_code = $_POST['color'] ?? '';
    $quantity = $_POST['quantity'] ?? 1;

    if (!$product_id || !$size_name || !$color_code) {
        echo "Missing product data.";
        exit;
    }

    // Fetch product
    $stmt = $pdo->prepare("SELECT * FROM tbl_product WHERE p_id = ?");
    $stmt->execute([$product_id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        echo "Product not found.";
        exit;
    }

    if ($quantity <= 0) {
        echo "Invalid quantity.";
        exit; 
    }

    // Get size_id and color_id
    $sizeStmt = $pdo->prepare("SELECT size_id FROM tbl_size WHERE size_name = ?");
    $sizeStmt->execute([$size_name]);
    $size_id = $sizeStmt->fetchColumn() ?: 0;

    $colorStmt = $pdo->prepare("SELECT color_id FROM tbl_color WHERE color_code = ?");
    $colorStmt->execute([$color_code]);
    $color_id = $colorStmt->fetchColumn() ?: 0;

    // Initialize cart if not set
    if (!isset($_SESSION['cart_p_id'])) {
        $_SESSION['cart_p_id'] = [];
        $_SESSION['cart_size_id'] = [];
        $_SESSION['cart_size_name'] = [];
        $_SESSION['cart_color_id'] = [];
        $_SESSION['cart_color_name'] = [];
        $_SESSION['cart_p_qty'] = [];
        $_SESSION['cart_p_current_price'] = [];
        $_SESSION['cart_p_name'] = [];
        $_SESSION['cart_p_featured_photo'] = [];
    }

    $item_found = false;

    // Check if item with same id + size + color exists
    for ($i = 0; $i < count($_SESSION['cart_p_id']); $i++) {
        if (
            $_SESSION['cart_p_id'][$i] == $product_id &&
            $_SESSION['cart_size_id'][$i] == $size_id &&
            $_SESSION['cart_color_id'][$i] == $color_id
        ) {
            $_SESSION['cart_p_qty'][$i] += $quantity;
            $item_found = true;
            break;
        }
    }

    // If not found, add new item
    if (!$item_found) {
        $_SESSION['cart_p_id'][] = $product_id;
        $_SESSION['cart_size_id'][] = $size_id;
        $_SESSION['cart_size_name'][] = $size_name;
        $_SESSION['cart_color_id'][] = $color_id;
        $_SESSION['cart_color_name'][] = $color_code;
        $_SESSION['cart_p_qty'][] = $quantity;
        $_SESSION['cart_p_current_price'][] = $product['p_current_price'];
        $_SESSION['cart_p_name'][] = $product['p_name'];
        $_SESSION['cart_p_featured_photo'][] = $product['p_featured_photo'];
    }

    echo "success";
} else {
    echo "Invalid request.";
}