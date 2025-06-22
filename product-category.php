<?php require_once('header.php');


$banner = $pdo->query("SELECT banner_product_category FROM tbl_settings WHERE id=1")->fetchColumn();


if (!isset($_REQUEST['id']) || !isset($_REQUEST['type'])) {
    header('Location: index.php');
    exit;
}
$type = $_REQUEST['type'];
$id = $_REQUEST['id'];
$valid_types = ['top-category', 'mid-category', 'end-category'];
if (!in_array($type, $valid_types)) {
    header('Location: index.php');
    exit;
}

// Load category mappings
$top1 = $mid1 = $mid2 = $end1 = $end2 = [];
foreach ($pdo->query("SELECT * FROM tbl_top_category") as $r) {
    $top1[$r['tcat_id']] = $r['tcat_name'];
}
foreach ($pdo->query("SELECT * FROM tbl_mid_category") as $r) {
    $mid1[$r['mcat_id']] = $r['mcat_name'];
    $mid2[$r['mcat_id']] = $r['tcat_id'];
}
foreach ($pdo->query("SELECT * FROM tbl_end_category") as $r) {
    $end1[$r['ecat_id']] = $r['ecat_name'];
    $end2[$r['ecat_id']] = $r['mcat_id'];
}


$ecat_ids = [];
$title = '';
if ($type == 'top-category') {
    $title = $top1[$id] ?? '';
    $mid_ids = array_keys(array_filter($mid2, fn($v) => $v == $id));
    foreach ($end2 as $eid => $mid_id) {
        if (in_array($mid_id, $mid_ids)) {
            $ecat_ids[] = $eid;
        }
    }
} elseif ($type == 'mid-category') {
    $title = $mid1[$id] ?? '';
    foreach ($end2 as $eid => $mid_id) {
        if ($mid_id == $id) {
            $ecat_ids[] = $eid;
        }
    }
} elseif ($type == 'end-category') {
    $title = $end1[$id] ?? '';
    $ecat_ids[] = $id;
}

// Filters
$params = [];
$joins = '';
$filter_sql = '';

if (!empty($_GET['size'])) {
    $joins .= " INNER JOIN tbl_product_size ps ON ps.p_id = p.p_id";
    $filter_sql .= " AND ps.size_id=?";
    $params[] = $_GET['size'];
}
if (!empty($_GET['color'])) {
    $joins .= " INNER JOIN tbl_product_color pc ON pc.p_id = p.p_id";
    $filter_sql .= " AND pc.color_id=?";
    $params[] = $_GET['color'];
}
if (!empty($_GET['price'])) {
    list($min, $max) = explode('-', $_GET['price']);
    $filter_sql .= " AND p.p_current_price BETWEEN ? AND ?";
    $params[] = $min;
    $params[] = $max;
}

$order_sql = '';
if (!empty($_GET['sort'])) {
    $order_sql = ($_GET['sort'] === 'price_asc') ? ' ORDER BY p.p_current_price ASC' :
        (($_GET['sort'] === 'price_desc') ? ' ORDER BY p.p_current_price DESC' : '');
}

$page = isset($_GET['page']) && is_numeric($_GET['page']) ? intval($_GET['page']) : 1;
$limit = 9;
$offset = ($page - 1) * $limit;
?>

<link rel="stylesheet" href="index.css">
<link rel="stylesheet" href="product-category.css">

<div class="page-banner" style="background-image:url(assets/uploads/<?php echo htmlspecialchars($banner); ?>)">
    <div class="inner">
        <h1><?php echo LANG_VALUE_50 . ' ' . htmlspecialchars($title); ?></h1>
    </div>
</div>

<div class="page">
    <div class="row">
        <div class="container1 col-md-3">
            <h3><?php echo LANG_VALUE_49; ?></h3>
            <div class="card-box">
                <div id="left" class="span3 md-6">
                    <ul id="menu-group-1" class="nav menu">
                        <?php
                        $i = 0;
                        $statement = $pdo->prepare("SELECT * FROM tbl_top_category WHERE show_on_menu=1");
                        $statement->execute();
                        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
                        foreach ($result as $row) {
                            $i++;
                        ?>
                        <li class="cat-level-1 deeper parent">
                            <a href="product-category.php?id=<?php echo $row['tcat_id']; ?>&type=top-category">
                                <span data-toggle="collapse" data-parent="#menu-group-1"
                                    href="#cat-lvl1-id-<?php echo $i; ?>" class="sign"><i class="fa fa-plus"></i></span>
                                <span class="lbl"><?php echo $row['tcat_name']; ?></span>
                            </a>
                            <ul class="children nav-child unstyled small collapse" id="cat-lvl1-id-<?php echo $i; ?>">
                                <?php
                                    $j = 0;
                                    $statement1 = $pdo->prepare("SELECT * FROM tbl_mid_category WHERE tcat_id=?");
                                    $statement1->execute([$row['tcat_id']]);
                                    $result1 = $statement1->fetchAll(PDO::FETCH_ASSOC);
                                    foreach ($result1 as $row1) {
                                        $j++;
                                    ?>
                                <li class="deeper parent">
                                    <a href="product-category.php?id=<?php echo $row1['mcat_id']; ?>&type=mid-category">
                                        <span data-toggle="collapse" data-parent="#menu-group-1"
                                            href="#cat-lvl2-id-<?php echo $i . $j; ?>" class="sign"><i
                                                class="fa fa-plus"></i></span>
                                        <span class="lbl lbl1"><?php echo $row1['mcat_name']; ?></span>
                                    </a>
                                    <ul class="children nav-child unstyled small collapse"
                                        id="cat-lvl2-id-<?php echo $i . $j; ?>">
                                        <?php
                                                $k = 0;
                                                $statement2 = $pdo->prepare("SELECT * FROM tbl_end_category WHERE mcat_id=?");
                                                $statement2->execute([$row1['mcat_id']]);
                                                $result2 = $statement2->fetchAll(PDO::FETCH_ASSOC);
                                                foreach ($result2 as $row2) {
                                                    $k++;
                                                ?>
                                        <li class="item-<?php echo $i . $j . $k; ?>">
                                            <a
                                                href="product-category.php?id=<?php echo $row2['ecat_id']; ?>&type=end-category">
                                                <span class="sign"></span>
                                                <span class="lbl lbl1"><?php echo $row2['ecat_name']; ?></span>
                                            </a>
                                        </li>
                                        <?php } ?>
                                    </ul>
                                </li>
                                <?php } ?>
                            </ul>
                        </li>
                        <?php } ?>
                    </ul>
                    <hr />
                    <div class="span3 md-6">
                        <div class="filter-sidebar p-3 shadow-sm rounded bg-white">

                            <h5 class="col-mb-9">Color</h5>
                            <form id="filterForm" method="get" class="mb-3 d-flex gap-3 flex-wrap">
                                <input type="hidden" name="id" value="<?= htmlspecialchars($id) ?>">
                                <input type="hidden" name="type" value="<?= htmlspecialchars($type) ?>">
                                <div style="height:100px; overflow-y: auto; overflow-x: hidden; ">
                                    <div class="color-filter">
                                        <?php
                                            $statement = $pdo->prepare("SELECT * FROM tbl_color");
                                            $statement->execute();
                                            $colors = $statement->fetchAll(PDO::FETCH_ASSOC);
                                            foreach ($colors as $row) {
                                                $color_code = $row['color_code'];
                                                $shape = $row['shape'];
                                                $border_radius = ($shape == 'circle') ? '50%' : '0';
                                            ?>
                                        <div class="text-center">
                                            <label style="cursor: pointer;">
                                                <input type="radio" name="color" value="<?= $row['color_id'] ?>"
                                                    style="display:none;"
                                                    onchange="document.getElementById('filterForm').submit();">
                                                <div class="color-box"
                                                    style="width: 20px; height: 20px; background-color: <?= $color_code ?>; border-radius: <?= $border_radius ?>; border: 1px solid #999; margin: auto;">
                                                </div>
                                            </label>
                                        </div>
                                        <?php } ?>
                                    </div>
                                </div>
                                <hr />
                                <h5 class="mt-4 mb-3">Size</h5>
                                <div class="d-flex flex-wrap gap-2">
                                    <?php
                                    $stmt = $pdo->prepare("SELECT * FROM tbl_size ORDER BY size_name ASC");
                                    $stmt->execute();
                                    $sizes = $stmt->fetchAll(PDO::FETCH_ASSOC);
                                    foreach ($sizes as $size) {
                                        echo '<button class="btn btn-outline-dark btn-sm" onclick="filterBySize(' . $size['size_id'] . ')">' . htmlspecialchars($size['size_name']) . '</button>';
                                    }
                                    ?>
                                </div>


                                <script>
                                function filterBySize(sizeId) {
                                    const form = document.getElementById('filterForm');
                                    const sizeInput = document.createElement('input');
                                    sizeInput.type = 'hidden';
                                    sizeInput.name = 'size';
                                    sizeInput.value = sizeId;
                                    form.appendChild(sizeInput);
                                    form.submit();
                                }
                                </script>




                                <hr />
                                <h5 class="mt-4 mb-3">Shop by Price</h5>
                                <?php
$stmt = $pdo->prepare("SELECT MIN(p_current_price) AS min_price, MAX(p_current_price) AS max_price FROM tbl_product WHERE p_current_price > 0");
$stmt->execute();
$priceData = $stmt->fetch(PDO::FETCH_ASSOC);
$min_price = floor($priceData['min_price']);
$max_price = ceil($priceData['max_price']);


$selected_max = isset($_GET['price']) ? explode('-', $_GET['price'])[1] : $max_price;
?>
                                <div>
                                    <input type="range" class="form-range" name="price_range_slider" id="priceRange"
                                        min="<?= $min_price ?>" max="<?= $max_price ?>" value="<?= $selected_max ?>"
                                        oninput="updatePriceLabel(this.value)">
                                    <div class="d-flex justify-content-between mt-2">
                                        <span>₹ <?= $min_price ?></span>
                                        <span id="selectedPrice">₹ <?= $selected_max ?></span>
                                    </div>
                                    <!-- Hidden input that actually filters the backend -->
                                    <input type="hidden" id="price" name="price" value="0-<?= $selected_max ?>">
                                </div>

                            </form>
                            <hr />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container2 col-md-9">
            <div class="product product-cat">
                <h3><?php echo LANG_VALUE_51; ?> "<?php echo htmlspecialchars($title); ?>"</h3>

                <form method="get" class="mb-3 d-flex gap-3 flex-wrap">
                    <input type="hidden" name="id" value="<?= htmlspecialchars($id) ?>">
                    <input type="hidden" name="type" value="<?= htmlspecialchars($type) ?>">

                    <select name="size" class="form-select" style="width:150px" onchange="this.form.submit();">
                        <option value="">All Sizes</option>
                        <?php foreach ($pdo->query("SELECT * FROM tbl_size") as $row): ?>
                        <option value="<?= $row['size_id'] ?>"
                            <?= ($_GET['size'] ?? '') == $row['size_id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($row['size_name']) ?></option>
                        <?php endforeach; ?>
                    </select>

                    <select name="color" class="form-select" style="width:150px" onchange="this.form.submit();">
                        <option value="">All Color</option>
                        <?php foreach ($pdo->query("SELECT * FROM tbl_color") as $row): ?>
                        <option value="<?= $row['color_id'] ?>"
                            <?= ($_GET['color'] ?? '') == $row['color_id'] ? 'selected' : '' ?>>
                            <?= htmlspecialchars($row['color_code']) ?></option>
                        <?php endforeach; ?>
                    </select>

                    <select name="price" class="form-select" style="width:150px" onchange="this.form.submit();">
                        <option value="">All Prices</option>
                        <option value="0-500" <?= ($_GET['price'] ?? '') == '0-500' ? 'selected' : '' ?>>Under ₹500
                        </option>
                        <option value="500-1000" <?= ($_GET['price'] ?? '') == '500-1000' ? 'selected' : '' ?>>₹500 -
                            ₹1000</option>
                        <option value="1000-999999" <?= ($_GET['price'] ?? '') == '1000-999999' ? 'selected' : '' ?>>
                            Over ₹1000</option>
                    </select>

                    <select name="sort" class="form-select" style="width:150px">
                        <option value="">Sort By</option>
                        <option value="price_asc" <?= ($_GET['sort'] ?? '') == 'price_asc' ? 'selected' : '' ?>>Price:
                            Low to High</option>
                        <option value="price_desc" <?= ($_GET['sort'] ?? '') == 'price_desc' ? 'selected' : '' ?>>Price:
                            High to Low</option>
                    </select>


                </form>

                <div class="row">
                    <?php
                    $prod_found = false;
                    foreach ($ecat_ids as $ecid) {
                        $sql = "SELECT DISTINCT p.* 
                                FROM tbl_product p
                                $joins
                                WHERE p.ecat_id=? AND p.p_is_active=1 $filter_sql $order_sql 
                                LIMIT $limit OFFSET $offset";
                        $stmt = $pdo->prepare($sql);
                        $stmt->execute(array_merge([$ecid], $params));
                        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $product):
                            $prod_found = true;
                            $discount = (!empty($product['p_old_price']) && $product['p_old_price'] > $product['p_current_price']) ?
                                (100 - round(($product['p_current_price'] / $product['p_old_price']) * 100)) . '% OFF' : '';
                    ?>
                    <div class="col-12 col-sm-6 col-lg-4 mb-4">
                        <div class="cardLatestCat">
                            <div class="videoCat-container-latest">
                                <div class="videoCat"
                                    style="background-image:url('assets/uploads/<?= htmlspecialchars($product['p_featured_photo']) ?>');">
                                </div>
                                <?php if ($discount): ?><div class="discount-badge"><?= $discount ?></div>
                                <?php endif; ?>
                                <div class="views"><?= $product['p_total_view'] ?> Views</div>
                                <div class="icons">
                                    <i class="fa-regular fa-heart"></i>
                                    <a onclick="openShareModal()"><i class="fa-regular fa-paper-plane"></i></a>
                                </div>
                            </div>
                            <div class="product-details">
                                <h4><a
                                        href="product.php?id=<?= $product['p_id'] ?>"><?= htmlspecialchars($product['p_name']) ?></a>
                                </h4>
                                <div class="price">
                                    INR <?= $product['p_current_price'] ?>
                                    <?php if (!empty($product['p_old_price'])): ?>
                                    <span class="original">INR <del><?= $product['p_old_price'] ?></del></span>
                                    <?php endif; ?>
                                    <?php if ($discount): ?>
                                    <span class="discount-latest"><?= $discount ?></span>
                                    <?php endif; ?>
                                </div>
                                <div class="rating">
                                    <?php
                                    $r = $pdo->prepare("SELECT rating FROM tbl_rating WHERE p_id=?");
                                    $r->execute([$product['p_id']]);
                                    $ratings = $r->fetchAll(PDO::FETCH_COLUMN);
                                    $avg = ($ratings) ? array_sum($ratings) / count($ratings) : 0;
                                    for ($i = 1; $i <= 5; $i++) {
                                        echo $i <= floor($avg) ? '<i class="fa fa-star"></i>' :
                                            ($i - $avg < 1 ? '<i class="fa fa-star-half-o"></i>' : '<i class="fa fa-star-o"></i>');
                                    }
                                    ?>
                                </div>
                                <?php if ($product['p_qty'] == 0): ?>
                                <div class="out-of-stock">
                                    <div class="inner">Out Of Stock</div>
                                </div>
                                <?php else: ?>
                                <p><a class="buy-btn" href="product.php?id=<?= $product['p_id'] ?>"><i
                                            class="fa fa-shopping-cart"></i> Add to Cart</a></p>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; 
                    } ?>
                    <?php if (!$prod_found): ?>
                    <div class="pl_15"><?= LANG_VALUE_153 ?></div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Share Modal -->
<div id="shareModal" class="modal2">
    <div class="modal2-content">
        <span class="close" onclick="closeShareModal()">&times;</span>
        <h4>Share on</h4>
        <hr>
        <div class="share-options">
            <a href="#" id="whatsappShare" target="_blank"><img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp_icon.svg"
                    alt="WhatsApp" /><span>WhatsApp</span></a>
            <a href="#" id="xShare" target="_blank"><img src="https://img.icons8.com/ios-filled/50/twitterx--v1.png"
                    alt="X" /><span>X</span></a>
            <a href="#" onclick="copyLink()"><img src="https://img.icons8.com/officel/80/copy-link.png"
                    alt="Copy Link" /><span>Copy link</span></a>
        </div>
    </div>
</div>

<script>
function updatePriceLabel(val) {
    document.getElementById('selectedPrice').innerText = '₹ ' + val;
    document.getElementById('price').value = '0-' + val;
    clearTimeout(window.priceTimeout);
    window.priceTimeout = setTimeout(() => {
        document.getElementById('filterForm').submit();
    }, 800);
}



// Other JavaScript functions
function openShareModal() {
    document.getElementById("shareModal").style.display = "block";
    const url = window.location.href;
    document.getElementById("whatsappShare").href = `https://wa.me/?text=${encodeURIComponent(url)}`;
    document.getElementById("xShare").href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
}

function closeShareModal() {
    document.getElementById("shareModal").style.display = "none";
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => alert("Link copied!"));
}
</script>


<?php require_once('footer.php'); ?>