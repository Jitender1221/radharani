<?php
require_once("admin/inc/config.php");


$reviews = [];
$t_rating = 0;
$avg_rating = 0;


$sql = "SELECT r.*, c.cust_name 
        FROM tbl_rating r 
        JOIN tbl_customer c ON r.cust_id = c.cust_id";

$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
        $t_rating += $row['rating'];
    }
}

$total = count($reviews);
if ($total > 0) {
    $avg_rating = round($t_rating / $total, 1);
}
?>

<link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />

<div class="container text-center">
    <h2 class="title">Customer Stories</h2>
    <h5 class="subtitle">See What Our Customer Says About Our Products</h5>

    <div class="swiper mySwiper">
        <div class="swiper-wrapper">
            <?php if ($total > 0): ?>
            <?php foreach ($reviews as $review): ?>
            <div class="swiper-slide">
                <div class="review-box" style="border: 1px solid #ccc; padding: 20px; border-radius: 8px;">
                    <div class="stars">
                        <?php
                                $fullStars = floor($review['rating']);
                                $halfStar = ($review['rating'] - $fullStars) >= 0.5 ? 1 : 0;
                            ?>
                        <?php for ($i = 0; $i < $fullStars; $i++): ?>
                        <span class="star full" style="color: #108474;">★</span>
                        <?php endfor; ?>
                        <?php if ($halfStar): ?>
                        <span class="star half" style="color: #108474;">⯪</span>
                        <?php endif; ?>
                        <?php for ($i = $fullStars + $halfStar; $i < 5; $i++): ?>
                        <span class="star empty" style="color: lightgray;">☆</span>
                        <?php endfor; ?>
                    </div>

                    <p class="review-text"><?= htmlspecialchars($review['comment']) ?></p>
                    <p class="review-author">❝ <strong><?= htmlspecialchars($review['cust_name']) ?></strong></p>
                </div>
            </div>
            <?php endforeach; ?>
            <?php else: ?>
            <div class="swiper-slide">
                <p>No reviews yet.</p>
            </div>
            <?php endif; ?>
        </div>

        <div class="swiper-pagination"></div>
    </div>
</div>

<script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
<script>
const swiper = new Swiper(".mySwiper", {
    loop: true,
    autoplay: {
        delay: 3000,
    },
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        768: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        }
    }
});
</script>