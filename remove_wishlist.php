<?php
if (isset($_POST['product_id'])) {
    $productId = $_POST['product_id'];
    $wishlist = isset($_COOKIE['wishlist']) ? json_decode($_COOKIE['wishlist'], true) : [];


    if (($key = array_search($productId, $wishlist)) !== false) {
        unset($wishlist[$key]);
        $wishlist = array_values($wishlist);
    }

 
    setcookie('wishlist', json_encode($wishlist), time() + (86400 * 30), '/');
}

header('Location: wishlist.php');
exit;