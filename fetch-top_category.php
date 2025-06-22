<?php require_once('admin/inc/config.php'); ?>

<!-- jQuery & Owl Carousel -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css" />
<link rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"></script>

<?php
if (isset($_GET['tcat_id'])) {
    $tcat_id = $_GET['tcat_id'];

    $statement = $pdo->prepare("
        SELECT p.*, GROUP_CONCAT(pp.photo) as product_photos,
               GROUP_CONCAT(DISTINCT ps.size_id) as size_ids,
               GROUP_CONCAT(DISTINCT pc.color_id) as color_ids
        FROM tbl_product p
        LEFT JOIN tbl_product_photo pp ON p.p_id = pp.p_id
        LEFT JOIN tbl_product_size ps ON p.p_id = ps.p_id
        LEFT JOIN tbl_product_color pc ON p.p_id = pc.p_id
        INNER JOIN tbl_end_category ec ON p.ecat_id = ec.ecat_id
        INNER JOIN tbl_mid_category mc ON ec.mcat_id = mc.mcat_id
        WHERE mc.tcat_id = ?
        GROUP BY p.p_id
    ");
    $statement->execute([$tcat_id]);
    $products = $statement->fetchAll(PDO::FETCH_ASSOC);

    if (count($products) > 0) {
        echo '<div class="owl-carousel owl-theme">';

        foreach ($products as $product) {
            $sizeIds = $product['size_ids'] ? explode(',', $product['size_ids']) : [];
            $sizes = [];
            if (!empty($sizeIds)) {
                $placeholders = implode(',', array_fill(0, count($sizeIds), '?'));
                $sizeStmt = $pdo->prepare("SELECT size_name FROM tbl_size WHERE size_id IN ($placeholders)");
                $sizeStmt->execute($sizeIds);
                $sizes = $sizeStmt->fetchAll(PDO::FETCH_COLUMN);
            }

            $colorIds = $product['color_ids'] ? explode(',', $product['color_ids']) : [];
            $colors = [];
            if (!empty($colorIds)) {
                $placeholders = implode(',', array_fill(0, count($colorIds), '?'));
                $colorStmt = $pdo->prepare("SELECT color_code FROM tbl_color WHERE color_id IN ($placeholders)");
                $colorStmt->execute($colorIds);
                $colors = $colorStmt->fetchAll(PDO::FETCH_COLUMN);
            }

            $photos = $product['product_photos'] ? explode(',', $product['product_photos']) : [];
            $featuredPhoto = !empty($product['p_featured_photo']) ? htmlspecialchars($product['p_featured_photo']) : 'default.jpg';
            $featuredPhotoPath = 'assets/uploads/' . $featuredPhoto;
            $secondPhoto = !empty($photos[0]) ? htmlspecialchars($photos[0]) : '';
            $secondPhotoPath = 'assets/uploads/product_photos/' . $secondPhoto;

            $oldPrice = (float)$product['p_old_price'];
            $currentPrice = (float)$product['p_current_price'];
            $discount = ($oldPrice > 0 && $oldPrice > $currentPrice) ? round((($oldPrice - $currentPrice) / $oldPrice) * 100) : 0;

            $statement1 = $pdo->prepare("SELECT rating FROM tbl_rating WHERE p_id=?");
            $statement1->execute([$product['p_id']]);
            $ratings = $statement1->fetchAll(PDO::FETCH_COLUMN);
            $tot_rating = count($ratings);
            $avg_rating = $tot_rating > 0 ? array_sum($ratings) / $tot_rating : 0;

            echo '<div class="card">';
            echo '<div class="card-box-first">';
            echo '<div class="first-content">';
            echo '<img src="' . $featuredPhotoPath . '" class="card-img-top" alt="' . htmlspecialchars($product['p_name']) . '" onerror="this.src=\'assets/uploads/default.jpg\'">';
            if (!empty($secondPhoto)) {
                echo '<img src="' . $secondPhotoPath . '" class="card-img-top second-content" alt="' . htmlspecialchars($product['p_name']) . '" onerror="this.src=\'assets/uploads/default.jpg\'">';
            }
            echo '</div>';
            echo '<div class="sale_lbl-wrap">';
            if ($discount > 0) {
                echo ' <label class="lbl on-sale">' . $discount . '%<br>OFF</label>';
            }
            echo '</div>';
            echo '<button class="btn btn-sm btn-quick-view quick-view-btn" 
                data-toggle="modal" 
                data-target="#quickViewModal"
                data-id="' . htmlspecialchars($product['p_id']) . '"
                data-name="' . htmlspecialchars($product['p_name']) . '"
                data-img="' . $featuredPhotoPath . '"
                data-price="' . $currentPrice . '"
                data-old-price="' . $oldPrice . '"
                data-sizes=\'' . json_encode($sizes) . '\'
                data-colors=\'' . json_encode($colors) . '\'>
                Quick View
            </button>';
            echo '</div>';
            echo '<div class="card-body">';
            echo '<a href="product.php?id=' . htmlspecialchars($product['p_id']) . '" class="textlink">';
            echo '<h5 class="card-title">' . htmlspecialchars($product['p_name']) . '</h5>';
            echo '<div class="rating text-center">';
            for ($i = 1; $i <= 5; $i++) {
                if ($i <= floor($avg_rating)) {
                    echo '<i class="fa fa-star"></i>';
                } elseif ($i - $avg_rating < 1) {
                    echo '<i class="fa fa-star-half-o"></i>';
                } else {
                    echo '<i class="fa fa-star-o"></i>';
                }
            }
            echo '<span> (Reviews: ' . $tot_rating . ')</span>';
            echo '</div>';
            echo '<p class="card-text text-success">INR: ';
            if ($oldPrice > $currentPrice) {
                echo '<span style="text-decoration: line-through; color: red;">₹' . number_format($oldPrice, 2) . '</span> ';
                echo '<strong>₹' . number_format($currentPrice, 2) . '</strong> ';
            } else {
                echo '<strong>₹' . number_format($currentPrice, 2) . '</strong>';
            }
            echo '</p>';
            echo '</a>';
            echo '</div>';
            echo '</div>';
        }
        echo '</div>';
    } else {
        echo "<p>No products found in this category.</p>";
    }
}
?>

<script>
$(document).ready(function() {
    $(".owl-carousel").owlCarousel({
        loop: true,
        margin: 20,
        autoplay: true,
        autoplayTimeout: 3000,
        nav: true,
        dots: false,
        navText: [
            "<span class='carousel-nav'>&#10094;</span>",
            "<span class='carousel-nav'>&#10095;</span>"
        ],
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 2
            },
            768: {
                items: 3
            },
            992: {
                items: 4
            }
        }
    });
});
</script>

<style>
.card-img-top {
    object-fit: contain;
    height: 410px;
    background-color: #f9f9f9;
    transition: transform 0.3s ease;
}

@media (max-width: 768px) {
    .card-img-top {
        object-fit: cover;
        height: auto;
    }
}

.card-box-first {
    position: relative;
    overflow: hidden;
}

.first-content img.second-content {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s ease-in;
}

.card-box-first:hover img.second-content {
    opacity: 1;
}

.card-body {
    padding: 10px;
    text-align: center;
}

.card-title {
    font-size: 16px;
    min-height: 40px;
}

.carousel-nav {
    font-size: 24px;
    color: #333;
    cursor: pointer;
    padding: 0 10px;
}

.carousel-nav:hover {
    color: #f15bb5;
}

.owl-carousel .item {
    padding: 10px;
}

.textlink {
    text-decoration: none !important;
    color: inherit;
}

.rating i {
    color: #f4c150;
    margin: 0 1px;
}

.badge.bg-success {
    background-color: #28a745;
    color: #fff;
    margin-left: 10px;
    padding: 5px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.sale_lbl-wrap {
    position: absolute;
    right: 30px;
    z-index: 2;
    margin: -5px 0 0;
    text-align: center;
    top: 0;
}

.lbl.on-sale {
    background: red;
    color: #fff;
    padding: 9px 2px 12px;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);
    font-size: 12px;
    border-radius: 0;
    line-height: 1.2;
    margin: 0;
    width: 40px;
    height: 58px;
}
</style>