<?php require_once('header.php'); ?>

<?php
$statement = $pdo->prepare("SELECT * FROM tbl_settings WHERE id=1");
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);
foreach ($result as $row)
{
    $cta_title = $row['cta_title'];
    $cta_content = $row['cta_content'];
    $cta_read_more_text = $row['cta_read_more_text'];
    $cta_read_more_url = $row['cta_read_more_url'];
    $cta_photo = $row['cta_photo'];
    $featured_product_title = $row['featured_product_title'];
    $featured_product_subtitle = $row['featured_product_subtitle'];
    $latest_product_title = $row['latest_product_title'];
    $latest_product_subtitle = $row['latest_product_subtitle'];
    $popular_product_title = $row['popular_product_title'];
    $popular_product_subtitle = $row['popular_product_subtitle'];
    $total_featured_product_home = $row['total_featured_product_home'];
    $total_latest_product_home = $row['total_latest_product_home'];
    $total_popular_product_home = $row['total_popular_product_home'];
    $home_service_on_off = $row['home_service_on_off'];
    $home_welcome_on_off = $row['home_welcome_on_off'];
    $home_featured_product_on_off = $row['home_featured_product_on_off'];
    $home_latest_product_on_off = $row['home_latest_product_on_off'];
    $home_popular_product_on_off = $row['home_popular_product_on_off'];

}


?>


<style>
#bootstrap-touch-slider {
    position: relative;
    overflow: hidden;
}

.carousel-inner .item {
    position: relative;
    height: 500px;
    background-size: cover;
    background-position: center center;
    aspect-ratio: 16 / 9;

    background-size: contain;
    background-repeat: no-repeat;
    height: 100%;
    width: 100%;
}

.item::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgb(0 0 0 / 0%);
    /* dark overlay */
    z-index: 1;
}

.slider-left {
    position: absolute;
    top: 70%;
    left: 0;
    transform: translateY(-50%);
    z-index: 2;
    background: rgba(255, 255, 255 /0%);
    border-radius: 12px;

    display: flex;
    flex-direction: column;
    margin: auto;
    justify-content: center;
    align-items: center;
    right: 0;

}

.slider-left h2 {
    font-size: 35px;
    color: #FFF;
    margin-bottom: 10px;
    font-weight: 600;
}

.slider-left h1 {
    font-size: 38px;
    color: #000;
    font-weight: 700;
    margin-bottom: 15px;
}

.slider-left h1 span {
    color: #ffcc00;
}

.slider-left p {
    font-size: 16px;
    color: #333;
    margin-bottom: 20px;
}

.slider-left .btn-custom {
    background-color: #ffcc00;
    color: #000;
    font-weight: bold;
    border: none;
    padding: 16px 43px;
    border-radius: 30px;
    text-decoration: none;
}

.carousel-indicators li {
    background-color: #aaa;
}

.carousel-indicators .active {
    background-color: #333;
}

.carousel-control.left,
.carousel-control.right {
    background-image: none;
    color: #fff;
    font-size: 30px;
    top: 50%;
    transform: translateY(-50%);
    height: 67px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    display: flex;

}

.carousel-control.right,
.carousel-control.left {

    background-image: none !important;
    background-repeat: repeat-x;
}

@media (max-width: 568px) {
    .item {
        height: auto;
    }

    .slider-left .btn-custom {

        padding: 9px 19px;

    }

    .slider-left {
        position: absolute;
        top: 34%;
        left: 0;
        transform: translateY(-50%);
        z-index: 2;
        background: rgba(255, 255, 255 /0%);
        border-radius: 12px;

        display: flex;
        flex-direction: column;
        margin: auto;
        justify-content: center;
        align-items: center;
        right: 0;

    }

    .slider-left {

        transform: none;
        background: rgba(255, 255, 255, 0%);
        margin: 0px;
    }



    .slider-left h1 {
        font-size: 14px;
    }

    .slider-left h2 {
        font-size: 15px;
    }
}
</style>

<!-- Required CSS & JS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
<link rel='stylesheet' type='text/css' href='index.css'>
<!-- Slider HTML -->
<div id="bootstrap-touch-slider" class="carousel slide" data-ride="carousel" data-pause="hover" data-interval="2000">
    <!-- Indicators -->
    <ol class="carousel-indicators">
        <?php
        $i = 0;
        $statement = $pdo->prepare("SELECT * FROM tbl_slider");
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        foreach ($result as $row) {
            echo '<li data-target="#bootstrap-touch-slider" data-slide-to="'.$i.'" '.($i == 0 ? 'class="active"' : '').'></li>';
            $i++;
        }
        ?>
    </ol>

    <!-- Slides -->
    <div class="carousel-inner" role="listbox">
        <?php
        $i = 0;
        foreach ($result as $row) {
            $active = ($i == 0) ? 'active' : '';
            $backgroundImage = 'assets/uploads/' . $row['photo'];
        ?>
        <div class="item <?php echo $active; ?>" style="background-image: url('<?php echo $backgroundImage; ?>');">
            <div class="slider-left">
                <h2><?php echo $row['heading']; ?></h2>
                <h1><?php echo $row['content']; ?></h1>
                <?php if (!empty($row['button_text'])) { ?>
                <a href="<?php echo $row['button_url']; ?>"
                    class="btn btn-custom"><?php echo $row['button_text']; ?></a>
                <?php } ?>
            </div>
        </div>
        <?php $i++; } ?>
    </div>

    <!-- Controls -->
    <a class="left carousel-control" href="#bootstrap-touch-slider" data-slide="prev">
        <span class="fa fa-chevron-left"></span>
    </a>
    <a class="right carousel-control" href="#bootstrap-touch-slider" data-slide="next">
        <span class="fa fa-chevron-right"></span>
    </a>
</div>

<!-- Slider End -->

<h3 class="text-center mt-4 mb-3">Shop By Category</h3>

<div class="menu-container2 ">
    <ul class="shopby nav nav-tabs justify-content-center" id="categoryTabs">
        <?php
        require_once('admin/inc/config.php');
        $statement = $pdo->prepare("SELECT * FROM tbl_top_category WHERE show_on_menu=1");
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        $firstTabId = '';
        foreach ($result as $index => $row) {
            $activeClass = ($index == 0) ? 'active' : '';
            if ($index == 0) $firstTabId = $row['tcat_id'];
            echo '<li class="nav-item">
                    <a class="nav-link ' . $activeClass . '" href="javascript:void(0);" style="text-decoration:none; color:black;" onclick="loadCategory(' . $row['tcat_id'] . ', this)">' . htmlspecialchars($row['tcat_name']) . '</a>
                </li>';
        }
        ?>
    </ul>

    <div class="tab-content p-3 border border-top-0" id="categoryContent">

    </div>
</div>




<!-- Quick View Modal -->
<div class="modal fade" id="quickViewModal" tabindex="-1" aria-labelledby="quickViewModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 rounded-4">
            <div class="modal-header border-0">
                <h3 class="text-muted mb-2">Quick View</h3>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4">
                <div class="row g-4 align-items-center">
                    <div class="col-md-6 text-center">
                        <img id="modal-product-img" src="" class="img-fluid rounded-3 shadow-sm" alt="Product Image" />
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-muted mb-2">Radha Rani Textiles</h6>
                        <h3 id="modal-product-name" class="fw-bold mb-2"></h3>
                        <p class="mb-2">
                            <span id="modal-product-price" class="fs-4 text-success fw-semibold"></span>
                            <del class="text-muted ms-2 fs-6" id="modal-product-original-price"
                                style="display:none;"></del>
                            <span class="badge bg-warning text-dark ms-2" id="modal-product-discount"
                                style="display:none;"></span>
                        </p>

                        <div id="size-section" class="mt-3">
                            <label class="form-label fw-semibold">Size</label>
                            <div id="size-buttons" class="d-flex flex-wrap gap-2"></div>
                        </div>

                        <div id="color-section" class="mt-3">
                            <label class="form-label fw-semibold">Color</label>
                            <div id="color-buttons" class="d-flex flex-wrap gap-2"></div>
                        </div>

                        <div class="quantity-wrapper mt-3">
                            <label class="qty-label" for="modal-product-qty">Quantity</label>
                            <div class="qty-controls d-flex align-items-center gap-2">
                                <button type="button" class="qty-btn btn btn-outline-secondary"
                                    aria-label="Decrease quantity" onclick="changeQty(-1)">−</button>
                                <input type="number" id="modal-product-qty" value="1" min="1" max="10" readonly
                                    aria-live="polite" style="width: 60px; text-align: center;" />
                                <button type="button" class="qty-btn btn btn-outline-secondary"
                                    aria-label="Increase quantity" onclick="changeQty(1)">+</button>
                            </div>
                        </div>

                        <div class="mt-4 d-flex gap-3 w-100 flex-wrap">
                            <button class="btn btn-pink btn-lg px-4" id="modal-add-to-cart" type="button"
                                style="background-color:#f15bb5; color:#fff;">Add to cart</button>
                            <button class="btn btn-outline-dark btn-lg px-4" id="modal-buy-now" type="button">Buy it
                                now</button>
                        </div>

                        <div class="mt-5">
                            <a href="#" id="modal-product-link" class="text-decoration-underline text-muted">View full
                                details</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
    const firstTabId = <?php echo json_encode($firstTabId); ?>;
    if (firstTabId) {
        loadCategory(firstTabId);
    }
});

function loadCategory(tcat_id, element) {
    const tabs = document.querySelectorAll('#categoryTabs .nav-link');
    tabs.forEach(tab => tab.classList.remove('active'));
    if (element) element.classList.add('active');

    const content = document.getElementById('categoryContent');
    content.innerHTML = `
        <div class="d-flex justify-content-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">
<div class="loader">
    <div class="bar1"></div>
    <div class="bar2"></div>
    <div class="bar3"></div>
    <div class="bar4"></div>
    <div class="bar5"></div>
    <div class="bar6"></div>
    <div class="bar7"></div>
    <div class="bar8"></div>
    <div class="bar9"></div>
    <div class="bar10"></div>
    <div class="bar11"></div>
    <div class="bar12"></div>
</div></span>
            </div>
        </div>
    `;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "fetch-top_category.php?tcat_id=" + tcat_id, true);
    xhr.onload = function() {
        if (this.status === 200) {
            content.innerHTML = this.responseText;

            // Initialize Owl Carousel inside the returned content
            const slider = content.querySelector('.owl-carousel');
            if (slider) {
                $(slider).owlCarousel({
                    loop: false,
                    margin: 20,
                    nav: true,
                    dots: false,
                    navText: ["<span class='carousel-nav prev'>&#10094;</span>",
                        "<span class='carousel-nav next'>&#10095;</span>"
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
                        },
                        1200: {
                            items: 5
                        }
                    }
                });
            }

            if (typeof attachQuickViewEvents === "function") {
                attachQuickViewEvents();
            }
        } else {
            content.innerHTML =
                `<p class="text-danger text-center">Failed to load category data. Please try again.</p>`;
        }
    };
    xhr.onerror = function() {
        content.innerHTML =
            `<p class="text-danger text-center">Error while loading data. Check your connection.</p>`;
    };
    xhr.send();
}



function changeQty(val) {
    const qtyInput = document.getElementById('modal-product-qty');
    if (!qtyInput) return;

    let current = parseInt(qtyInput.value, 10) || 1;
    const min = parseInt(qtyInput.min, 10) || 1;
    const max = parseInt(qtyInput.max, 10) || 10;

    if (val === -1 && current > min) {
        qtyInput.value = current - 1;
    } else if (val === 1 && current < max) {
        qtyInput.value = current + 1;
    }
}

let selectedSize = '';
let selectedColor = '';
let currentProductId = null;

function attachQuickViewEvents() {
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', () => {
            try {
                const product = {
                    id: button.dataset.id,
                    name: button.dataset.name,
                    img: button.dataset.img,
                    price: parseFloat(button.dataset.price),
                    oldPrice: parseFloat(button.dataset.oldPrice || 0),
                    sizes: JSON.parse(button.dataset.sizes || '[]'),
                    colors: JSON.parse(button.dataset.colors || '[]')
                };

                selectedSize = '';
                selectedColor = '';
                currentProductId = product.id;

                // Populate modal fields
                document.getElementById('modal-product-name').textContent = product.name;
                document.getElementById('modal-product-img').src = product.img;
                document.getElementById('modal-product-price').textContent =
                    `₹${product.price.toFixed(2)}`;
                document.getElementById('modal-product-qty').value = 1;
                document.getElementById('modal-product-link').href =
                    `product.php?id=${encodeURIComponent(product.id)}`;

                const oldPriceEl = document.getElementById('modal-product-original-price');
                const discountEl = document.getElementById('modal-product-discount');

                if (product.oldPrice > product.price && product.oldPrice > 0) {
                    oldPriceEl.textContent = `₹${product.oldPrice.toFixed(2)}`;
                    const discount = Math.round(((product.oldPrice - product.price) / product
                        .oldPrice) * 100);
                    discountEl.textContent = `${discount}% OFF`;
                    oldPriceEl.style.display = 'inline';
                    discountEl.style.display = 'inline';
                } else {
                    oldPriceEl.style.display = 'none';
                    discountEl.style.display = 'none';
                }

                // Sizes
                const sizeButtons = document.getElementById('size-buttons');
                sizeButtons.innerHTML = '';
                if (product.sizes.length > 0) {
                    product.sizes.forEach(size => {
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = 'btn btn-outline-dark';
                        btn.textContent = size;
                        btn.setAttribute('aria-pressed', 'false');

                        btn.addEventListener('click', () => {
                            selectedSize = size;
                            // Remove active classes
                            sizeButtons.querySelectorAll('.btn').forEach(b => {
                                b.classList.remove('active');
                                b.setAttribute('aria-pressed', 'false');
                            });
                            btn.classList.add('active');
                            btn.setAttribute('aria-pressed', 'true');
                        });

                        sizeButtons.appendChild(btn);
                    });
                } else {
                    sizeButtons.textContent = 'No sizes available';
                }

                // Colors
                const colorButtons = document.getElementById('color-buttons');
                colorButtons.innerHTML = '';
                if (product.colors.length > 0) {
                    product.colors.forEach(color => {
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = 'btn btn-outline-secondary';
                        btn.style.backgroundColor = color;
                        btn.style.width = '30px';
                        btn.style.height = '30px';
                        btn.style.borderRadius = '50%';
                        btn.setAttribute('title', color);
                        btn.setAttribute('aria-pressed', 'false');

                        btn.addEventListener('click', () => {
                            selectedColor = color;
                            colorButtons.querySelectorAll('.btn').forEach(b => {
                                b.classList.remove('active');
                                b.setAttribute('aria-pressed', 'false');
                            });
                            btn.classList.add('active');
                            btn.setAttribute('aria-pressed', 'true');
                        });

                        colorButtons.appendChild(btn);
                    });
                } else {
                    colorButtons.textContent = 'No colors available';
                }

                // Show the modal using Bootstrap 5 API
                const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
                modal.show();
            } catch (err) {
                console.error('Error parsing product info or opening modal:', err);
            }
        });
    });
}

// Add to Cart - delegated to avoid null if modal not available yet
document.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'modal-add-to-cart') {
        if (!selectedSize) {
            alert("Please select a size before adding to cart.");
            return;
        }
        if (!selectedColor) {
            alert("Please select a color before adding to cart.");
            return;
        }

        const qty = parseInt(document.getElementById('modal-product-qty').value, 10);

        fetch('add-to-cart.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    product_id: currentProductId,
                    size: selectedSize,
                    color: selectedColor,
                    quantity: qty
                })
            })
            .then(response => response.text())
            .then(result => {
                if (result.trim().toLowerCase() === "success") {
                    alert("Product added to cart!");
                    // Optionally, you can update cart count here without reload
                    location.reload();
                } else {
                    alert("Failed to add to cart: " + result);
                }
            })
            .catch(error => {
                alert("Error during add to cart: " + error);
            });
    }
});

// Buy Now - delegated event
document.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'modal-buy-now') {
        if (!selectedSize) {
            alert("Please select a size before buying.");
            return;
        }
        if (!selectedColor) {
            alert("Please select a color before buying.");
            return;
        }
        const qty = parseInt(document.getElementById('modal-product-qty').value, 10);
        const url =
            `product.php?id=${encodeURIComponent(currentProductId)}&buyNow=true&qty=${qty}&size=${encodeURIComponent(selectedSize)}&color=${encodeURIComponent(selectedColor)}`;
        window.location.href = url;
    }
});
</script>




<!-- Sale Banner -->

<?php
require_once('./admin/inc/config.php');

$result = $conn->query("SELECT * FROM tbl_banner ORDER BY id DESC LIMIT 1");
$row = $result->num_rows > 0 ? $result->fetch_assoc() : null;
?>

<style>
.sale-banner {
    background: <?=$row['bg_type']=='color'? $row['bg_value'] : "url('{$row['bg_value']}') center/cover"?>;
}
</style>
<link rel="stylesheet" href="./admin/banner.css">
<div class="sale-banner">
    <div class="banner-content">
        <div class="banner-side">
            <span class="discount"><?= $row['left_text'] ?></span>
            <div class="subtext"><?= $row['subtext'] ?></div>
        </div>
        <div class="banner-center"><?= $row['center_text'] ?></div>
        <div class="banner-side">
            <span class="discount"><?= $row['right_text'] ?></span>
            <div class="subtext"><?= $row['subtext'] ?></div>
        </div>
    </div>
</div>
<!-- Sale Banner End -->



<!-- Featured Product Heading -->
<?php if($home_featured_product_on_off == 1): ?>
<div class="product pt_70 pb_70">
    <div class="container-featured">
        <div class="row">
            <div class="col-md-12">
                <div class="headline">
                    <h2><?php echo $featured_product_title; ?></h2>
                    <h3><?php echo $featured_product_subtitle; ?></h3>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="container-featured">

                <div class="product-carousel">

                    <?php
                    $statement = $pdo->prepare("SELECT * FROM tbl_product WHERE p_is_featured=? AND p_is_active=? LIMIT ".$total_featured_product_home);
                    $statement->execute(array(1,1));
                    $result = $statement->fetchAll(PDO::FETCH_ASSOC);                            
                   foreach ($result as $row) {
                        $p_discount = '';
                        if (!empty($row['p_old_price']) && $row['p_old_price'] > $row['p_current_price']) {
                            $p_discount = round((($row['p_old_price'] - $row['p_current_price']) / $row['p_old_price']) * 100) . '% OFF';
                        }
                        ?>
                    <div class="cardLatest">
                        <div class="video-container-latest">
                            <div class="video"
                                style="background-image:url(assets/uploads/<?php echo $row['p_featured_photo']; ?>);"
                                onclick="openImageModal('assets/uploads/<?php echo $row['p_featured_photo']; ?>')">
                            </div>
                            <!-- Discount -->
                            <div class="sale_lbl-wrap">
                                <?php if($p_discount): ?>
                                <label class="lbl on-sale"><?php echo $p_discount; ?></label>
                                <?php endif; ?>
                            </div>
                            <div class="views"><?php echo $row['p_total_view']; ?> Views</div>
                            <div class="icons">
                                <i class="fa-regular fa-heart"></i>
                                <a type="button" onclick="openShareModal()">
                                    <i class="fa-regular fa-paper-plane"></i>
                                </a>
                            </div>
                        </div>

                        <div class="product-details">
                            <h4>
                                <a href="product.php?id=<?php echo $row['p_id']; ?>">
                                    <?php echo $row['p_name']; ?>
                                </a>
                            </h4>

                            <div class="price">
                                INR <?php echo $row['p_current_price']; ?>
                                <?php if (!empty($row['p_old_price'])): ?>
                                <span class="original">INR <del><?php echo $row['p_old_price']; ?></del></span>
                                <?php endif; ?>
                                <?php if (!empty($p_discount)): ?>
                                <span class="discount-latest"><?php echo $p_discount; ?></span>
                                <?php endif; ?>
                            </div>

                            <div class="rating">
                                <?php
                                    $statementRating = $pdo->prepare("SELECT rating FROM tbl_rating WHERE p_id=?");
                                    $statementRating->execute([$row['p_id']]);
                                    $ratings = $statementRating->fetchAll(PDO::FETCH_COLUMN);

                                    $tot_rating = count($ratings);
                                    $avg_rating = ($tot_rating > 0) ? array_sum($ratings) / $tot_rating : 0;

                                    for ($i = 1; $i <= 5; $i++) {
                                        if ($i <= floor($avg_rating)) {
                                            echo '<i class="fa fa-star"></i>';
                                        } elseif ($i - $avg_rating < 1) {
                                            echo '<i class="fa fa-star-half-o"></i>';
                                        } else {
                                            echo '<i class="fa fa-star-o"></i>';
                                        }
                                    }
                                    ?>
                            </div>

                            <?php if ($row['p_qty'] == 0): ?>
                            <div class="out-of-stock">
                                <div class="inner">Out Of Stock</div>
                            </div>
                            <?php else: ?>
                            <p>
                                <a class="buy-btn" href="product.php?id=<?php echo $row['p_id']; ?>">
                                    <i class="fa fa-shopping-cart"></i> Add to Cart
                                </a>
                            </p>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>
</div>
<?php endif; ?>
<!-- Featured Product End -->
<!-- Modal for Image Featured Preview -->
<div id="imageModal" class="image-modal">
    <span class="close" onclick="closeImageModal()">&times;</span>
    <img class="modal-content" id="modalImage">
</div>

<!-- CSS for Modal -->
<style>
.image-modal {
    display: none;
    position: fixed;
    z-index: 9999;
    padding-top: 50px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.9);
}

.image-modal .close {
    position: absolute;
    top: 30px;
    right: 50px;
    color: white;
    font-size: 40px;
    cursor: pointer;
}

.image-modal .modal-content {
    display: block;
    margin: auto;
    width: auto;
    height: 100%;
    animation: zoom 0.3s ease-in-out;
}


@media screen and (max-width: 768px) {
    .image-modal .modal-content {
        height: 50%;
    }
}

@keyframes zoom {
    from {
        transform: scale(0.5);
    }

    to {
        transform: scale(1);
    }
}
</style>
<script>
function openImageModal(src) {
    document.getElementById("imageModal").style.display = "block";
    document.getElementById("modalImage").src = src;
}

function closeImageModal() {
    document.getElementById("imageModal").style.display = "none";
}
</script>
<div class="container-video" style="margin:0; padding:0; overflow:hidden;">

    <!-- First Collage -->
    <div class="collage-container collage1">
        <div class="collage-item item1">
            <h1>Outfits For
                Every Occasion
            </h1>
            <p>From casual days to festive nights,
                workwear to vacation vibes-our versatile
                collection blends heritage with modern style.
                Celebrate every moment with timeless
                designs crafted for your unique style.</p>
            <a class="btn-Outfits">Learn More</a>
        </div>
        <div type="hidden" class="collage-item item2">

        </div>
        <div type="hidden" class="collage-item item3">

        </div>
        <div type="hidden" class="collage-item item4">

        </div>
    </div>

    <!-- Second Collage -->
    <div class="collage-container collage2">
        <div class="collage-item item2">
            <video src="video.mp4" autoplay muted playsinline loop style="width:100%; height:100%; object-fit:cover;"
                controls="false">

            </video>

        </div>
        <div class="collage-item item1">
            <video src="video.mp4" autoplay muted playsinline loop style="width:100%; height:100%; object-fit:cover;"
                controls="false"></video>

        </div>

        <div class="collage-item item3">
            <video src="video.mp4" autoplay muted playsinline loop style="width:100%; height:100%; object-fit:cover;"
                controls="false"></video>

        </div>
        <div class="collage-item item4">
            <video src="video.mp4" autoplay muted playsinline loop style="width:100%; height:100%; object-fit:cover;"
                controls="false"></video>

        </div>
    </div>
</div>


<script>
var vids = $("video");
$.each(vids, function() {
    this.controls = false;
});
</script>

<style>
.container-video {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    width: 90%;
}

.collage-container {
    position: relative;
    width: 48%;
    height: 100vh;
    background: transparent;
    border-radius: 10px;
    overflow: hidden;
}

.collage-item {
    position: absolute;
    border-radius: 15px;
    overflow: hidden;

}

.collage-item video {
    width: 100%;
    height: auto;
    display: block;
}

/* Layout for collage 1 */
.collage1 .item1 {
    top: 32%;
    left: 0;
    width: 68%;

    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    background: transparent;
    margin: auto;
    right: 0;



}

.collage1 .item2 {
    top: 10%;
    right: 29px;
    width: 64%;
}

.collage1 .item3 {
    top: 50%;
    left: 0;
    width: 40%;
}

.collage1 .item4 {
    bottom: 8px;
    right: 10%;
    width: 32%;
}

/* You can customize layout for collage2 if needed */
.collage2 .item1 {
    top: 14%;
    left: 41%;
    width: 50%;
    height: 500px;
}

.collage2 .item2 {
    top: 44%;
    right: 49%;
    width: 37%;
    height: 331px;
}

.collage2 .item3 {
    bottom: 61%;
    left: 11%;
    width: 34%;
    height: 320px;
}

.collage2 .item4 {
    bottom: 0%;
    right: 14%;
    width: 30%;
    height: 320px;
}

.btn-Outfits {
    padding: 10px 20px;
    background-color: #f15bb5;
    color: white;
    border-color: #f15bb5;
    border-radius: 15px;
    font-size: 16px;
    text-decoration: none;
    cursor: pointer;
    float: left;
}

.btn-Outfits:hover {
    padding: 10px 20px;
    background-color: #f15bb5ad;
    color: white;
    border-color: #f15bb5;
    border-radius: 15px;
    font-size: 16px;
    text-decoration: none;
}

@media (max-width: 568px) {
    .collage-container {
        width: 100%;
        height: auto;
    }

    .collage-item {
        position: static;
        width: 100%;
        margin: 10px auto;
        display: block;
    }

    .container-video {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
        width: 100%;
        justify-content: center;
        margin: auto;
    }

    .collage-item .h1,
    h1 {
        font-size: 19px;
    }
}
</style>
<?php if($home_latest_product_on_off == 1): ?>
<div class="product bg-gray pt_70 pb_30">
    <div class="container-featured">
        <div class="row">
            <div class="col-md-12">
                <div class="headline">
                    <h2><?php echo $latest_product_title; ?></h2>
                    <h3><?php echo $latest_product_subtitle; ?></h3>
                </div>
            </div>
        </div>

        <!-- Latest Products Section -->
        <div class="row">
            <div class="container-featured">
                <div class="product-list-wrapper">
                    <div class="product-carousel">
                        <?php
                    $statement = $pdo->prepare("SELECT * FROM tbl_product WHERE p_is_active=? ORDER BY p_id DESC LIMIT ".$total_latest_product_home);
                    $statement->execute(array(1));
                    $result = $statement->fetchAll(PDO::FETCH_ASSOC);                            
                    foreach ($result as $row) {
                        $p_discount = '';
                        if (!empty($row['p_old_price']) && $row['p_old_price'] > $row['p_current_price']) {
                            $p_discount = round((($row['p_old_price'] - $row['p_current_price']) / $row['p_old_price']) * 100) . '% OFF';
                        }
                    ?>
                        <div class="cardLatest">
                            <div class="video-container-latest">
                                <div class="video"
                                    style="background-image:url(assets/uploads/<?php echo $row['p_featured_photo']; ?>);">
                                </div>
                                <!-- Discount -->
                                <div class="sale_lbl-wrap">
                                    <?php if($p_discount): ?>
                                    <label class="lbl on-sale"><?php echo $p_discount; ?></label>
                                    <?php endif; ?>
                                </div>
                                <div class="views"><?php echo $row['p_total_view']; ?> Views</div>
                                <div class="icons">
                                    <i class="fa-regular fa-heart"></i>
                                    <a type="button" onclick="openShareModal()">
                                        <i class="fa-regular fa-paper-plane"></i>
                                    </a>
                                </div>
                            </div>

                            <div class="product-details">
                                <h4>
                                    <a href="product.php?id=<?php echo $row['p_id']; ?>">
                                        <?php echo $row['p_name']; ?>
                                    </a>
                                </h4>

                                <div class="price">
                                    INR <?php echo $row['p_current_price']; ?>
                                    <?php if($row['p_old_price'] != ''): ?>
                                    <span class="original">INR <del><?php echo $row['p_old_price']; ?></del></span>
                                    <?php endif; ?>
                                    <?php if($p_discount): ?>
                                    <span class="discount-latest"><?php echo $p_discount; ?></span>
                                    <?php endif; ?>
                                </div>

                                <div class="rating">
                                    <?php
                                $t_rating = 0;
                                $statement1 = $pdo->prepare("SELECT * FROM tbl_rating WHERE p_id=?");
                                $statement1->execute(array($row['p_id']));
                                $tot_rating = $statement1->rowCount();
                                $avg_rating = ($tot_rating == 0) ? 0 : array_sum(array_column($statement1->fetchAll(PDO::FETCH_ASSOC), 'rating')) / $tot_rating;

                                for($i=1; $i<=5; $i++) {
                                    if ($i <= floor($avg_rating)) {
                                        echo '<i class="fa fa-star"></i>';
                                    } elseif ($i - $avg_rating < 1) {
                                        echo '<i class="fa fa-star-half-o"></i>';
                                    } else {
                                        echo '<i class="fa fa-star-o"></i>';
                                    }
                                }
                                ?>
                                </div>

                                <?php if($row['p_qty'] == 0): ?>
                                <div class="out-of-stock">
                                    <div class="inner">Out Of Stock</div>
                                </div>
                                <?php else: ?>
                                <p>
                                    <a class="buy-btn" href="product.php?id=<?php echo $row['p_id']; ?>">
                                        <i class="fa fa-shopping-cart"></i> Add to Cart
                                    </a>
                                </p>
                                <?php endif; ?>
                            </div>
                        </div>
                        <?php } ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<?php endif; ?>



<style>
.latest-modal {
    display: none;
    position: fixed;
    z-index: 9999;
    padding-top: 50px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.9);
}

.latest-modal .close {
    position: absolute;
    top: 30px;
    right: 50px;
    color: white;
    font-size: 40px;
    cursor: pointer;
}

.latest-modal .modal-latest-content {
    display: block;
    margin: auto;
    width: auto;
    height: 100%;
    animation: zoom 0.3s ease-in-out;
}

@keyframes zoom {
    from {
        transform: scale(0.5);
    }

    to {
        transform: scale(1);
    }
}
</style>

<div id="imageProductModal" class="latest-modal">
    <span class="close" onclick="closeProductModal()">&times;</span>
    <img class="modal-latest-content" id="modalProductImage">
</div>

<script>
function openProductModal(src) {
    document.getElementById("imageProductModal").style.display = "block";
    document.getElementById("modalProductImage").src = src;
}

function closeProductModal() {
    document.getElementById("imageProductModal").style.display = "none";
}
</script>

<?php if ($home_popular_product_on_off == 1): ?>
<div class="product pt_70 pb_70">
    <div class="container-featured">
        <div class="row">
            <div class="col-md-12">
                <div class="headline">
                    <h2><?php echo $popular_product_title; ?></h2>
                    <h3><?php echo $popular_product_subtitle; ?></h3>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="container-featured">

                <div class="product-carousel">

                    <?php
         // Validate LIMIT as integer to avoid SQL injection
            $total_popular_product_home = (int)$total_popular_product_home;

                                    $statement = $pdo->prepare("SELECT * FROM tbl_product WHERE p_is_active=1 ORDER BY p_total_view DESC LIMIT $total_popular_product_home");
                        $statement->execute();

                    $result = $statement->fetchAll(PDO::FETCH_ASSOC);

                    foreach ($result as $row) {
                        $p_discount = '';
                        if (!empty($row['p_old_price']) && $row['p_old_price'] > $row['p_current_price']) {
                            $p_discount = round((($row['p_old_price'] - $row['p_current_price']) / $row['p_old_price']) * 100) . '% OFF';
                        }
                        ?>
                    <div class="cardLatest">
                        <div class="video-container-latest">
                            <div class="video"
                                style="background-image:url(assets/uploads/<?php echo $row['p_featured_photo']; ?>);"
                                onclick="openPopularModal('assets/uploads/<?php echo $row['p_featured_photo']; ?>')">
                            </div>
                            <!-- Discount -->
                            <div class="sale_lbl-wrap">
                                <?php if($p_discount): ?>
                                <label class="lbl on-sale"><?php echo $p_discount; ?></label>
                                <?php endif; ?>
                            </div>
                            <div class="views"><?php echo $row['p_total_view']; ?> Views</div>
                            <div class="icons">
                                <i class="fa-regular fa-heart"></i>
                                <a type="button" onclick="openShareModal()">
                                    <i class="fa-regular fa-paper-plane"></i>
                                </a>
                            </div>
                        </div>

                        <div class="product-details">
                            <h4>
                                <a href="product.php?id=<?php echo $row['p_id']; ?>">
                                    <?php echo $row['p_name']; ?>
                                </a>
                            </h4>

                            <div class="price">
                                INR <?php echo $row['p_current_price']; ?>
                                <?php if (!empty($row['p_old_price'])): ?>
                                <span class="original">INR <del><?php echo $row['p_old_price']; ?></del></span>
                                <?php endif; ?>
                                <?php if (!empty($p_discount)): ?>
                                <span class="discount-latest"><?php echo $p_discount; ?></span>
                                <?php endif; ?>
                            </div>

                            <div class="rating">
                                <?php
                                    $statementRating = $pdo->prepare("SELECT rating FROM tbl_rating WHERE p_id=?");
                                    $statementRating->execute([$row['p_id']]);
                                    $ratings = $statementRating->fetchAll(PDO::FETCH_COLUMN);

                                    $tot_rating = count($ratings);
                                    $avg_rating = ($tot_rating > 0) ? array_sum($ratings) / $tot_rating : 0;

                                    for ($i = 1; $i <= 5; $i++) {
                                        if ($i <= floor($avg_rating)) {
                                            echo '<i class="fa fa-star"></i>';
                                        } elseif ($i - $avg_rating < 1) {
                                            echo '<i class="fa fa-star-half-o"></i>';
                                        } else {
                                            echo '<i class="fa fa-star-o"></i>';
                                        }
                                    }
                                    ?>
                            </div>

                            <?php if ($row['p_qty'] == 0): ?>
                            <div class="out-of-stock">
                                <div class="inner">Out Of Stock</div>
                            </div>
                            <?php else: ?>
                            <p>
                                <a class="buy-btn" href="product.php?id=<?php echo $row['p_id']; ?>">
                                    <i class="fa fa-shopping-cart"></i> Add to Cart
                                </a>
                            </p>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php
                    }
                    ?>

                </div>

            </div>
        </div>
    </div>
</div>

<style>
.Popular-modal {
    display: none;
    position: fixed;
    z-index: 9999;
    padding-top: 50px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.9);
}

.Popular-modal .close {
    position: absolute;
    top: 30px;
    right: 50px;
    color: white;
    font-size: 40px;
    cursor: pointer;
}

.Popular-modal .modal-Popular-content {
    display: block;
    margin: auto;
    width: auto;
    height: 100%;
    animation: zoom 0.3s ease-in-out;
}

@keyframes zoom {
    from {
        transform: scale(0.5);
    }

    to {
        transform: scale(1);
    }
}
</style>

<div id="imagePopularModal" class="Popular-modal">
    <span class="close" onclick="closePopularModal()">&times;</span>
    <img class="modal-Popular-content" id="modalPopularImage">
</div>

<script>
function openPopularModal(src) {
    document.getElementById("imagePopularModal").style.display = "block";
    document.getElementById("modalPopularImage").src = src;
}

function closePopularModal() {
    document.getElementById("imagePopularModal").style.display = "none";
}
</script>


<!-- Share Modal -->
<div id="shareModal" class="modal2">
    <div class="modal2-content">
        <span class="close" onclick="closeShareModal()">&times;</span>
        <h4>Share on</h4>
        <hr />
        <div class="share-options">
            <a href="#" id="whatsappShare" target="_blank">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp">
                <span>WhatsApp</span>
            </a>
            <a href="#" id="xShare" target="_blank">
                <img src="https://img.icons8.com/ios-filled/50/twitterx--v1.png" alt="twitterx--v1" />
                <span>X</span>
            </a>
            <a href="#" onclick="copyLink()">
                <img src="https://img.icons8.com/officel/80/copy-link.png" alt="copy-link" />
                <span>Copy link</span>
            </a>
        </div>
    </div>
</div>
<script>
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
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Link copied to clipboard!");
    });
}
</script>



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

<div class="container">
    <center>
        <h2 class="title">Customer Reviews</h2>
        <h5 class="subtitle">See What Our Customers Say About Our Products</h5>
        <?php if ($total): ?>
        <p><strong>Average Rating:</strong> <?= $avg_rating ?> / 5</p>
        <?php endif; ?>
    </center>
    <br><br>

    <div class="review-container ]
     mySwiper">
        <div class="swiper-wrapper">
            <?php if ($total > 0): ?>
            <?php foreach ($reviews as $review): ?>
            <div class="swiper-slide">
                <a class="review-card-link" data-toggle-id="review-sidebar-<?= htmlspecialchars($review['cust_id']) ?>">
                    <div class="review-card">
                        <div class="stars">
                            <?php
                                $fullStars = floor($review['rating']);
                                $halfStar = ($review['rating'] - $fullStars) >= 0.5 ? 1 : 0;
                            ?>
                            <?php for ($i = 0; $i < $fullStars; $i++): ?>
                            <span class="star full" style="color: gold;">★</span>
                            <?php endfor; ?>
                            <?php if ($halfStar): ?>
                            <span class="star half" style="color: gold;">⯪</span>
                            <?php endif; ?>
                            <?php for ($i = $fullStars + $halfStar; $i < 5; $i++): ?>
                            <span class="star empty" style="color: lightgray;">☆</span>
                            <?php endfor; ?>
                        </div><br />
                        <p class="text"><?= htmlspecialchars($review['comment']) ?></p>
                        <div class="user">
                            <i style="font-size: 2.5em; color: #0000002e; margin-top:10px;">❝</i>
                            <?= htmlspecialchars($review['cust_name']) ?>
                        </div>

                    </div>
                </a>
            </div>
            <?php endforeach; ?>
            <?php else: ?>
            <div class="swiper-slide">
                <p>No reviews yet.</p>
            </div>
            <?php endif; ?>
        </div>

        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-pagination"></div>
    </div>
</div>

<!-- Sidebar modals -->
<?php foreach ($reviews as $review): ?>
<div id="review-sidebar-<?= htmlspecialchars($review['cust_id']) ?>" class="review-sidebar">
    <div class="review-sidebar__header">
        <div class="stars">
            <?php for ($i = 1; $i <= 5; $i++): ?>
            <span class="star <?= $i <= $review['rating'] ? 'filled' : '' ?>">★</span>
            <?php endfor; ?>
        </div>
        <a href="javascript:void(0)" class="review-card-link" data-toggle-id="review1">X</a>

        <div class="review-sidebar" id="review1">
            <button class="close-sidebar" data-close-id="review1"></button>

        </div>

    </div>
    <p class="textmodal"><?= htmlspecialchars($review['comment']) ?></p>
    <div class="review-footer">
        <i style="font-size: 2em; color: #0000002e;">❝</i>
        <?= htmlspecialchars($review['cust_name']) ?>
    </div>
</div>
<?php endforeach; ?>

<!-- Swiper JS -->
<script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
<script>
var swiper = new Swiper(".mySwiper", {
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        768: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        },
    }
});
</script>

<!-- Toggle Sidebar -->
<script>
document.addEventListener("DOMContentLoaded", function() {
    const reviewLinks = document.querySelectorAll(".review-card-link");
    const closeButtons = document.querySelectorAll(".close-sidebar");


    reviewLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.stopPropagation();


            document.querySelectorAll(".review-sidebar.open").forEach(openSidebar => {
                openSidebar.classList.remove("open");
            });


            const targetId = this.getAttribute("data-toggle-id");
            const targetSidebar = document.getElementById(targetId);
            if (targetSidebar) {
                targetSidebar.classList.add("open");
            }
        });
    });


    closeButtons.forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
            const targetId = this.getAttribute("data-close-id");
            const targetSidebar = document.getElementById(targetId);
            if (targetSidebar) {
                targetSidebar.classList.remove("open");
            }
        });
    });


    window.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            document.querySelectorAll(".review-sidebar.open").forEach(el => el.classList.remove(
                "open"));
        }
    });


    document.addEventListener("click", function(e) {
        document.querySelectorAll(".review-sidebar.open").forEach(sidebar => {
            if (!sidebar.contains(e.target)) {
                sidebar.classList.remove("open");
            }
        });
    });
});
</script>



<style>
.review-sidebar {
    display: none;
    position: fixed;
    right: 0;
    top: 0;
    background: #f3eacf;

    overflow-y: auto;
    padding: 20px;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    z-index: 9999;
}

.review-sidebar.open {
    display: block;
}


.review-card-link {
    text-decoration: none !important;
    color: #000;
}

.star {
    font-size: 1.2em;
    color: #ccc;
}

.star.filled {
    color: gold;
}
</style>





<?php

$accessToken = 'IGAARajw6g0ZAZABZAE5UN2paTF90SmtpbnUxTmpGUlhtNHVyOTRJYnRnS2xWX2RMLVpTT3RvSjdXajJZARDlVeFBSVkd4N3g1TEs2ellEV3ZANb2R0aWJBTjRTR1VRWUJwMndKWk9QZAm5kdW1JYmtzSmRxQXJYTXd6dG1VNncwTnNmOAZDZD';
$userId = '74842511807';
$limit = 10;

$url = "https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,media_type,thumbnail_url&access_token={$accessToken}&limit={$limit}";

$response = file_get_contents($url);
$data = json_decode($response, true);
$posts = $data['data'];
?>

<div class="follow-us-section">
    <h2>Follow us</h2>
    <p>Join our Community of members for daily inspiration and a closer look at our creations</p>

    <div class="image-card-row">
        <?php foreach ($posts as $post): ?>
        <div class="image-card">
            <a href="<?php echo $post['permalink']; ?>" target="_blank" class="image-link">
                <img src="<?php echo $post['media_type'] == 'VIDEO' ? $post['thumbnail_url'] : $post['media_url']; ?>"
                    alt="Instagram Post" class="img-insta">
                <div class="overlay">
                    <img src="https://img.icons8.com/fluency/48/instagram-new.png" alt="Instagram Icon"
                        class="insta-icon">
                </div>
            </a>
        </div>
        <?php endforeach; ?>
    </div>

    <a href="https://www.instagram.com/jitenpla/" class="visit-btn">
        <img width="28" height="28" src="https://img.icons8.com/fluency/48/instagram-new.png"
            alt="instagram-new" />&nbsp;
        Visit
    </a>
</div>



<style>
/* -------------------- Follow Us Section -------------------- */
.image-card {
    position: relative;
    display: inline-block;
    overflow: hidden;
    width: 160px;
    height: 250px;
    border: 2px solid #999;
    border-radius: 12px;
    background-color: #f5f5f5;
    background-size: cover;
    background-position: center;
}

.img-insta {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    display: block;
    transition: transform 0.3s ease;
}

.image-link:hover .img-insta {
    transform: scale(1.05);
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.image-link:hover .overlay {
    opacity: 1;
}

.insta-icon {
    width: 40px;
    height: 40px;
}

.follow-us-section {
    text-align: center;
    padding: 40px 20px;
    background-color: #fff;
}

.follow-us-section h2 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
}

.follow-us-section p {
    color: #333;
    font-size: 15px;
    margin-bottom: 30px;
}

.image-card-row {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

.visit-btn {
    display: inline-block;
    background-color: none;
    border: 2px solid #333;
    color: #000;
    text-decoration: none;
    padding: 10px 25px;
    border-radius: 8px;
    font-weight: 500;
    transition: background-color 0.3s;
}

.visit-btn:hover {
    background-color: #000;
    color: #fff;
}

/* -------------------- Card Latest Section -------------------- */


.video-container-latest {
    position: relative;
    width: 100%;
    padding-top: 100%;
    background-color: #eee;
}

.video {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
    cursor: pointer;
}

.views {
    position: absolute;
    bottom: 8px;
    left: 10px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
}

.icons {
    position: absolute;
    right: 10px;

    display: flex;
    gap: 10px;
    font-size: 16px;
    color: #fff;
}

.product-details {
    padding: 15px;
}

.product-details h4 {
    font-size: 16px;
    margin-bottom: 10px;
    height: 45px;
    overflow: hidden;
}

.product-details .price {
    font-weight: bold;
    color: #333;
}

.product-details .original {
    font-size: 13px;
    color: #888;
    margin-left: 8px;
}

.discount-latest {
    font-size: 12px;
    color: green;
    margin-left: 8px;
}

.rating i {
    margin-right: 2px;
    font-size: 16px;
    color: #108474;
}

.out-of-stock .inner {
    color: red;
    font-weight: bold;
    padding: 5px 0;
}

.buy-btn {
    background: #FAF1D7;
    color: #000000;
    padding: 6px 10px;
    border-radius: 4px;
    text-decoration: none;
    display: inline-block;
    border: 1px solid #d4cdba;
}

.buy-btn:hover {
    background: #d4cdba;
    color: #108474;
}

/* -------------------- Modal -------------------- */
.latest-modal {
    display: none;
    position: fixed;
    z-index: 9999;
    padding-top: 50px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.9);
}

.latest-modal .close {
    position: absolute;
    top: 30px;
    right: 50px;
    color: white;
    font-size: 40px;
    cursor: pointer;
}

.latest-modal .modal-latest-content {
    display: block;
    margin: auto;
    width: auto;
    height: 100%;
    animation: zoom 0.3s ease-in-out;
}

@keyframes zoom {
    from {
        transform: scale(0.5);
    }

    to {
        transform: scale(1);
    }
}

/* -------------------- Featured Section -------------------- */
.featured-container {
    padding: 40px 20px;
}

.featured-container h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 30px;
    text-align: center;
}

.logo-row {
    display: flex;
    justify-content: center;
    gap: 175px;
    align-items: center;
    margin-bottom: 85px;
    flex-wrap: wrap;
}

.logo-row img {
    height: 100px;
}

.reviews {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-bottom: 30px;
}

.stars {
    color: teal;
    font-size: 18px;
}

.review-count {
    font-size: 16px;
    color: teal;
}

.badges-row {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 40px;
    flex-wrap: wrap;
}

.badges-row img {
    height: 60px;
}

.judge-badge img {
    height: 100px;
}

/* -------------------- Mobile Responsive -------------------- */
@media screen and (max-width: 768px) {
    .image-card-row {
        gap: 15px;
    }

    .image-card {
        width: 45%;
        height: 200px;
    }

    .cardLatest {
        max-width: 100%;
        margin: 10px 0;
    }

    .icons {
        font-size: 14px;
    }

    .modal-latest-content {
        width: 90%;
    }

    .logo-row {
        flex-direction: column;
        gap: 40px;
    }

    .logo-row img {
        height: 60px;
    }

    .featured-container h2 {
        font-size: 20px;
    }

    .badges-row img,
    .judge-badge img {
        height: 50px;
    }

    .follow-us-section h2 {
        font-size: 18px;
    }

    .follow-us-section p {
        font-size: 14px;
    }

    .visit-btn {
        padding: 8px 20px;
        font-size: 14px;
    }
}
</style>



<?php if($home_service_on_off == 1): ?>
<div class="service bg-gray">
    <div class="container-service">

        <?php
                $statement = $pdo->prepare("SELECT * FROM tbl_service");
                $statement->execute();
                $result = $statement->fetchAll(PDO::FETCH_ASSOC);                            
                foreach ($result as $row) {
                    ?>

        <div class="col-md-4">
            <div class="item">
                <div class="photo"><img src="assets/uploads/<?php echo $row['photo']; ?>" width="50px"
                        alt="<?php echo $row['title']; ?>"></div>
                <p><?php echo $row['title']; ?></p>
                <p>
                    <?php echo nl2br($row['content']); ?>
                </p>
            </div>

        </div>
        <?php
                }
            ?>

    </div>
</div>
<?php endif; ?>
<?php endif; ?>


<!-- jQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<?php require_once('footer.php'); ?>