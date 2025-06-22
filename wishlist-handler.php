<?php
session_start();
require_once('admin/inc/config.php'); 




if (!isset($_SESSION['customer'])) {
    echo 'not_logged_in';
    exit;
}

if (!isset($_POST['p_id'])) {
    echo 'invalid_request';
    exit;
}

$cust_id = $_SESSION['customer'];
$p_id = (int)$_POST['p_id'];

// Check if exists
$stmt = $pdo->prepare("SELECT id FROM wishlist WHERE cust_id = ? AND p_id = ?");
$stmt->execute([$cust_id, $p_id]);
$exists = $stmt->fetch();

if ($exists) {
    // Remove
    $stmt = $pdo->prepare("DELETE FROM wishlist WHERE cust_id = ? AND p_id = ?");
    $stmt->execute([$cust_id, $p_id]);
    echo 'removed';
} else {
    // Add
    $stmt = $pdo->prepare("INSERT INTO wishlist (cust_id, p_id) VALUES (?, ?)");
    $stmt->execute([$cust_id, $p_id]);
    echo 'added';
}