<?php require_once('header.php'); ?>

<?php
// Redirect if ID is not provided
if (!isset($_REQUEST['id']) || empty($_REQUEST['id'])) {
    header('Location: logout.php');
    exit;
}

$id = $_REQUEST['id'];

// Check if top category exists
$statement = $pdo->prepare("SELECT * FROM tbl_top_category WHERE tcat_id = ?");
$statement->execute([$id]);
if ($statement->rowCount() === 0) {
    header('Location: logout.php');
    exit;
}

// Get all associated end category IDs
$ecat_ids = [];
$statement = $pdo->prepare("
    SELECT t3.ecat_id
    FROM tbl_top_category t1
    JOIN tbl_mid_category t2 ON t1.tcat_id = t2.tcat_id
    JOIN tbl_end_category t3 ON t2.mcat_id = t3.mcat_id
    WHERE t1.tcat_id = ?
");
$statement->execute([$id]);
$result = $statement->fetchAll(PDO::FETCH_ASSOC);
foreach ($result as $row) {
    $ecat_ids[] = $row['ecat_id'];
}

// If end categories found, delete associated products and media
if (!empty($ecat_ids)) {
    $p_ids = [];

    // Get all product IDs linked to those end categories
    $statement = $pdo->prepare("SELECT p_id, p_featured_photo FROM tbl_product WHERE ecat_id = ?");
    foreach ($ecat_ids as $ecat_id) {
        $statement->execute([$ecat_id]);
        $products = $statement->fetchAll(PDO::FETCH_ASSOC);
        foreach ($products as $product) {
            $p_ids[] = $product['p_id'];

            // Delete featured photo if exists
            $photoPath = '../assets/uploads/' . $product['p_featured_photo'];
            if (file_exists($photoPath)) {
                unlink($photoPath);
            }
        }
    }

    if (!empty($p_ids)) {
        // Delete additional product photos
        $statement = $pdo->prepare("SELECT photo FROM tbl_product_photo WHERE p_id = ?");
        foreach ($p_ids as $p_id) {
            $statement->execute([$p_id]);
            $photos = $statement->fetchAll(PDO::FETCH_ASSOC);
            foreach ($photos as $photo) {
                $photoPath = '../assets/uploads/product_photos/' . $photo['photo'];
                if (file_exists($photoPath)) {
                    unlink($photoPath);
                }
            }
        }

        // Delete from product-related tables
        $deleteTables = ['tbl_product_photo', 'tbl_product_size', 'tbl_product_color', 'tbl_rating'];
        foreach ($deleteTables as $table) {
            $stmt = $pdo->prepare("DELETE FROM $table WHERE p_id = ?");
            foreach ($p_ids as $p_id) {
                $stmt->execute([$p_id]);
            }
        }

        // Delete from tbl_payment via tbl_order
        $stmtOrder = $pdo->prepare("SELECT payment_id FROM tbl_order WHERE product_id = ?");
        $stmtPayment = $pdo->prepare("DELETE FROM tbl_payment WHERE payment_id = ?");
        foreach ($p_ids as $p_id) {
            $stmtOrder->execute([$p_id]);
            $orders = $stmtOrder->fetchAll(PDO::FETCH_ASSOC);
            foreach ($orders as $order) {
                $stmtPayment->execute([$order['payment_id']]);
            }
        }

        // Delete from tbl_order
        $stmt = $pdo->prepare("DELETE FROM tbl_order WHERE product_id = ?");
        foreach ($p_ids as $p_id) {
            $stmt->execute([$p_id]);
        }

        // Delete products
        $stmt = $pdo->prepare("DELETE FROM tbl_product WHERE p_id = ?");
        foreach ($p_ids as $p_id) {
            $stmt->execute([$p_id]);
        }
    }

    // Delete end categories
    $stmt = $pdo->prepare("DELETE FROM tbl_end_category WHERE ecat_id = ?");
    foreach ($ecat_ids as $ecat_id) {
        $stmt->execute([$ecat_id]);
    }
}

// Delete mid categories
$statement = $pdo->prepare("DELETE FROM tbl_mid_category WHERE tcat_id = ?");
$statement->execute([$id]);

// Delete top category
$statement = $pdo->prepare("DELETE FROM tbl_top_category WHERE tcat_id = ?");
$statement->execute([$id]);

header('Location: top-category.php');
exit;
?>