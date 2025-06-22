<?php require_once('header.php'); ?>

<?php



$wishlist_ids = isset($_COOKIE['wishlist']) ? json_decode($_COOKIE['wishlist'], true) : [];

$wishlist_items = [];

if (!empty($wishlist_ids)) {
    $placeholders = implode(',', array_fill(0, count($wishlist_ids), '?'));
    $stmt = $pdo->prepare("SELECT p_id as product_id, p_name as product_name, p_current_price as unit_price, p_featured_photo FROM tbl_product WHERE p_id IN ($placeholders)");
    $stmt->execute($wishlist_ids);
    $wishlist_items = $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>


<div class="page">
    <div class="container-customer">
        <div class="container">

            <div class="wishlist-title"><i class="fa-solid fa-heart"></i>&nbsp;Your Wishlist</div>
            <hr />
            <div class="table-responsive">
                <table class="table table-bordered table-hover table-condensed table-striped ">
                    <thead>
                        <tr>
                            <th>PRODUCT</th>
                            <th>PRICE</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (count($wishlist_items) > 0): ?>
                        <?php foreach ($wishlist_items as $item): ?>
                        <tr class="wishlist-row">
                            <td>
                                <div style="display: flex; gap: 15px; align-items: center;">
                                    <img src="assets/uploads/<?= htmlspecialchars($item['p_featured_photo']); ?>"
                                        alt="<?= htmlspecialchars($item['product_name']); ?>">
                                    <div>
                                        <div class="product-name"><?= htmlspecialchars($item['product_name']); ?></div>
                                        <div class="status">In Stock</div>
                                    </div>
                                </div>
                            </td>
                            <td>Rs. <?= number_format($item['unit_price'], 2); ?></td>
                            <td>
                                <a href="product.php?id=<?= $item['product_id']; ?>" class="btn-view">VIEW PRODUCT</a>
                            </td>
                            <td>
                                <form method="post" action="remove_wishlist.php"
                                    onsubmit="return confirm('Remove from wishlist?');">
                                    <input type="hidden" name="product_id" value="<?= $item['product_id']; ?>">
                                    <button type="submit" class="btn-delete">×</button>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                        <?php else: ?>
                        <tr>
                            <td colspan="4" style="text-align:center;">No items in wishlist.</td>
                        </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<style>
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background: #fff;
}

.container {
    width: 90%;
    margin: 30px auto;
}

.breadcrumb {
    font-size: 14px;
    margin-bottom: 15px;
    color: #333;
}

.breadcrumb a {
    color: #666;
    text-decoration: none;
}

.wishlist-title {
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
}

th,
td {
    padding: 15px;
    vertical-align: middle;
}

th {
    background: #f9f9f9;
    text-align: left;
    font-size: 14px;
    color: #222;
}

td img {
    width: 80px;
    height: auto;
    border-radius: 4px;
}

.product-name {
    font-size: 15px;
    color: #333;
}

.status {
    color: green;
    font-weight: 500;
}

.btn-view,
.btn-delete {
    padding: 8px 15px;
    border: none;
    font-size: 13px;
    cursor: pointer;
    border-radius: 3px;
    text-decoration: none;
    display: inline-block;
}

.btn-view {
    background-color: #111;
    color: #fff;
}

.btn-delete {
    background-color: #e74c3c;
    color: #fff;
    font-size: 18px;
    padding: 4px 10px;
}

.wishlist-row {
    border-bottom: 1px solid #eee;
}
</style>

<?php require_once('footer.php'); ?>