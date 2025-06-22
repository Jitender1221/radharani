<?php
include('admin/inc/config.php');

$color = $_POST['color'] ?? null;
$size = $_POST['size'] ?? null;
$gender = $_POST['gender'] ?? [];
$price = $_POST['price'] ?? 999;

$query = "SELECT * FROM tbl_product WHERE 1=1";
$params = [];

if ($color) {
    $query .= " AND p_id IN (SELECT p_id FROM tbl_product_color WHERE color_id = ?)";
    $params[] = $color;
}
if ($size) {
    $query .= " AND p_id IN (SELECT p_id FROM tbl_product_size WHERE size_id = ?)";
    $params[] = $size;
}
if (!empty($gender)) {
    $in = str_repeat('?,', count($gender) - 1) . '?';
    $query .= " AND gender IN ($in)";
    $params = array_merge($params, $gender);
}
if ($price) {
    $query .= " AND p_current_price <= ?";
    $params[] = $price;
}

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$products = $stmt->fetchAll();

if ($products) {
    foreach ($products as $row) {
        ?>
<div class="card mb-3">
    <img src="assets/uploads/<?php echo $row['p_featured_photo']; ?>" class="card-img-top" style="height:200px;">
    <div class="card-body">
        <h5 class="card-title"><?php echo $row['p_name']; ?></h5>
        <p class="card-text">Price: ₹<?php echo $row['p_current_price']; ?></p>
    </div>
</div>
<?php
    }
} else {
    echo "<p>No products found!</p>";
}
?>