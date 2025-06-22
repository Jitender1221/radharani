<!-- This is main configuration File -->

<?php error_reporting( E_ALL ); ?>
<?php
ob_start();
session_start();
include("admin/inc/config.php");
include("admin/inc/functions.php");
include("admin/inc/CSRF_Protect.php");
$csrf = new CSRF_Protect();
$error_message = '';
$success_message = '';
$error_message1 = '';
$success_message1 = '';

// Getting all language variables into array as global variable
$i=1;
$statement = $pdo->prepare("SELECT * FROM tbl_language");
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);							
foreach ($result as $row) {
	define('LANG_VALUE_'.$i,$row['lang_value']);
	$i++;
}

$statement = $pdo->prepare("SELECT * FROM tbl_settings WHERE id=1");
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);
foreach ($result as $row)
{
	$logo = $row['logo'];
	$favicon = $row['favicon'];
	$contact_email = $row['contact_email'];
	$contact_phone = $row['contact_phone'];
	$meta_title_home = $row['meta_title_home'];
    $meta_keyword_home = $row['meta_keyword_home'];
    $meta_description_home = $row['meta_description_home'];
    $before_head = $row['before_head'];
    $after_body = $row['after_body'];
}


$current_date_time = date('Y-m-d H:i:s');
$statement = $pdo->prepare("SELECT * FROM tbl_payment WHERE payment_status=?");
$statement->execute(array('Pending'));
$result = $statement->fetchAll(PDO::FETCH_ASSOC);							
foreach ($result as $row) {
	$ts1 = strtotime($row['payment_date']);
	$ts2 = strtotime($current_date_time);     
	$diff = $ts2 - $ts1;
	$time = $diff/(3600);
	if($time>24) {

		// Return back the stock amount
		$statement1 = $pdo->prepare("SELECT * FROM tbl_order WHERE payment_id=?");
		$statement1->execute(array($row['payment_id']));
		$result1 = $statement1->fetchAll(PDO::FETCH_ASSOC);
		foreach ($result1 as $row1) {
			$statement2 = $pdo->prepare("SELECT * FROM tbl_product WHERE p_id=?");
			$statement2->execute(array($row1['product_id']));
			$result2 = $statement2->fetchAll(PDO::FETCH_ASSOC);							
			foreach ($result2 as $row2) {
				$p_qty = $row2['p_qty'];
			}
			$final = $p_qty+$row1['quantity'];

			$statement = $pdo->prepare("UPDATE tbl_product SET p_qty=? WHERE p_id=?");
			$statement->execute(array($final,$row1['product_id']));
		}
		
		// Deleting data from table
		$statement1 = $pdo->prepare("DELETE FROM tbl_order WHERE payment_id=?");
		$statement1->execute(array($row['payment_id']));

		$statement1 = $pdo->prepare("DELETE FROM tbl_payment WHERE id=?");
		$statement1->execute(array($row['id']));
	}
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <!-- Meta Tags -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="assets/uploads/<?php echo $favicon; ?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

    <!-- Stylesheets -->
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/css/owl.carousel.min.css">
    <link rel="stylesheet" href="assets/css/owl.theme.default.min.css">
    <link rel="stylesheet" href="assets/css/jquery.bxslider.min.css">
    <link rel="stylesheet" href="assets/css/magnific-popup.css">
    <link rel="stylesheet" href="assets/css/rating.css">
    <link rel="stylesheet" href="assets/css/spacing.css">
    <link rel="stylesheet" href="assets/css/bootstrap-touch-slider.css">
    <link rel="stylesheet" href="assets/css/animate.min.css">
    <link rel="stylesheet" href="assets/css/tree-menu.css">
    <link rel="stylesheet" href="assets/css/select2.min.css">
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

    <!-- Swiper JS -->
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <!-- Swiper CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- Slick Slider CSS/JS -->
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css" />
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>

    <!-- Optional Slick theme -->
    <link rel="stylesheet" type="text/css"
        href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css" />




    <link rel='stylesheet' type='text/css' href='style.css' crossorigin>
    <link rel='stylesheet' type='text/css' href='assets/css/normalize.css' crossorigin>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <script src="
https://cdn.jsdelivr.net/npm/js-toggle-switch@1.0.1/dist/toggle-switch.min.js
"></script>
    <link href="
https://cdn.jsdelivr.net/npm/js-toggle-switch@1.0.1/dist/toggle-switch.min.css
" rel="stylesheet">

    <?php

	$statement = $pdo->prepare("SELECT * FROM tbl_page WHERE id=1");
	$statement->execute();
	$result = $statement->fetchAll(PDO::FETCH_ASSOC);							
	foreach ($result as $row) {
		$about_meta_title = $row['about_meta_title'];
		$about_meta_keyword = $row['about_meta_keyword'];
		$about_meta_description = $row['about_meta_description'];
		$faq_meta_title = $row['faq_meta_title'];
		$faq_meta_keyword = $row['faq_meta_keyword'];
		$faq_meta_description = $row['faq_meta_description'];
		$blog_meta_title = $row['blog_meta_title'];
		$blog_meta_keyword = $row['blog_meta_keyword'];
		$blog_meta_description = $row['blog_meta_description'];
		$contact_meta_title = $row['contact_meta_title'];
		$contact_meta_keyword = $row['contact_meta_keyword'];
		$contact_meta_description = $row['contact_meta_description'];
		$pgallery_meta_title = $row['pgallery_meta_title'];
		$pgallery_meta_keyword = $row['pgallery_meta_keyword'];
		$pgallery_meta_description = $row['pgallery_meta_description'];
		$vgallery_meta_title = $row['vgallery_meta_title'];
		$vgallery_meta_keyword = $row['vgallery_meta_keyword'];
		$vgallery_meta_description = $row['vgallery_meta_description'];
	}

	$cur_page = substr($_SERVER["SCRIPT_NAME"],strrpos($_SERVER["SCRIPT_NAME"],"/")+1);
	
	if($cur_page == 'index.php' || $cur_page == 'login.php' || $cur_page == 'registration.php' || $cur_page == 'cart.php' || $cur_page == 'checkout.php' || $cur_page == 'forget-password.php' || $cur_page == 'reset-password.php' || $cur_page == 'product-category.php' || $cur_page == 'product.php') {
		?>
    <title><?php echo $meta_title_home; ?></title>
    <meta name="keywords" content="<?php echo $meta_keyword_home; ?>">
    <meta name="description" content="<?php echo $meta_description_home; ?>">
    <?php
	}

	if($cur_page == 'about.php') {
		?>
    <title><?php echo $about_meta_title; ?></title>
    <meta name="keywords" content="<?php echo $about_meta_keyword; ?>">
    <meta name="description" content="<?php echo $about_meta_description; ?>">
    <?php
	}
	if($cur_page == 'faq.php') {
		?>
    <title><?php echo $faq_meta_title; ?></title>
    <meta name="keywords" content="<?php echo $faq_meta_keyword; ?>">
    <meta name="description" content="<?php echo $faq_meta_description; ?>">
    <?php
	}
	if($cur_page == 'contact.php') {
		?>
    <title><?php echo $contact_meta_title; ?></title>
    <meta name="keywords" content="<?php echo $contact_meta_keyword; ?>">
    <meta name="description" content="<?php echo $contact_meta_description; ?>">
    <?php
	}
	if($cur_page == 'product.php')
	{
		$statement = $pdo->prepare("SELECT * FROM tbl_product WHERE p_id=?");
		$statement->execute(array($_REQUEST['id']));
		$result = $statement->fetchAll(PDO::FETCH_ASSOC);							
		foreach ($result as $row) 
		{
		    $og_photo = $row['p_featured_photo'];
		    $og_title = $row['p_name'];
		    $og_slug = 'product.php?id='.$_REQUEST['id'];
			$og_description = substr(strip_tags($row['p_description']),0,200).'...';
		}
	}

	if($cur_page == 'dashboard.php') {
		?>
    <title>Dashboard - <?php echo $meta_title_home; ?></title>
    <meta name="keywords" content="<?php echo $meta_keyword_home; ?>">
    <meta name="description" content="<?php echo $meta_description_home; ?>">
    <?php
	}
	if($cur_page == 'customer-profile-update.php') {
		?>
    <title>Update Profile - <?php echo $meta_title_home; ?></title>
    <meta name="keywords" content="<?php echo $meta_keyword_home; ?>">
    <meta name="description" content="<?php echo $meta_description_home; ?>">
    <?php
	}
	if($cur_page == 'customer-billing-shipping-update.php') {
		?>
    <title>Update Billing and Shipping Info - <?php echo $meta_title_home; ?></title>
    <meta name="keywords" content="<?php echo $meta_keyword_home; ?>">
    <meta name="description" content="<?php echo $meta_description_home; ?>">
    <?php
	}
	if($cur_page == 'customer-password-update.php') {
		?>
    <title>Update Password - <?php echo $meta_title_home; ?></title>
    <meta name="keywords" content="<?php echo $meta_keyword_home; ?>">
    <meta name="description" content="<?php echo $meta_description_home; ?>">
    <?php
	}
	if($cur_page == 'customer-order.php') {
		?>
    <title>Orders - <?php echo $meta_title_home; ?></title>
    <meta name="keywords" content="<?php echo $meta_keyword_home; ?>">
    <meta name="description" content="<?php echo $meta_description_home; ?>">
    <?php
	}
	?>

    <?php if($cur_page == 'blog-single.php'): ?>
    <meta property="og:title" content="<?php echo $og_title; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo BASE_URL.$og_slug; ?>">
    <meta property="og:description" content="<?php echo $og_description; ?>">
    <meta property="og:image" content="assets/uploads/<?php echo $og_photo; ?>">
    <?php endif; ?>

    <?php if($cur_page == 'product.php'): ?>
    <meta property="og:title" content="<?php echo $og_title; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo BASE_URL.$og_slug; ?>">
    <meta property="og:description" content="<?php echo $og_description; ?>">
    <meta property="og:image" content="assets/uploads/<?php echo $og_photo; ?>">
    <?php endif; ?>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"></script>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">


    <?php if (!empty ($before_head)) {?>
    <?php echo $before_head; ?>
    <?php }?>
</head>
<style>
@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@200..800&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
}

body {
    font-family: 'Montserrat', sans-serif;

}

/* Top Bar */
.top {
    background-color: #333;
    color: #fff;
    padding: 10px 0;
    font-size: 14px;
}

.top .left ul {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 0;
}

.top .left ul li {
    color: #fff;
}

/* Header */
header.navbar {
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    position: relative;
    z-index: 1000;
}

.mobile-header .left-icons,
.mobile-header .right-icons {
    display: flex;
    align-items: center;
    gap: 15px;
}

.mobile-header .logo img {
    height: 40px;
}

/* Desktop Navigation */
.desktop-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    width: 85%;
    left: 0;
    right: 0;
    flex-direction: row;
    margin: auto;
    margin-bottom: 20px;
    position: sticky;
    padding-left: 70px;
    padding-right: 70px;
}

.desktop-nav .logo img {
    height: 50px;
}

.nav-menu ul {
    list-style: none;
    display: flex;
    gap: 20px;
    padding-left: 0;
    margin: 0;
}

.nav-menu ul li {
    position: relative;
}

.nav-menu ul li a {
    text-decoration: none;
    color: #000;
    padding: 8px 12px;
    display: block;
}

.nav-menu ul li:hover>ul {
    display: block;
}

/* Dropdown Menu */
.nav-menu ul ul {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #FAF1D7;
    border: 1px solid #FAF1D7;
    z-index: 1000;
}

.nav-menu ul ul li a {
    padding: 10px 15px;
    color: #000;
}

.nav-menu ul ul ul {
    left: 100%;
    top: 0;
}

/* Navigation Icons */
.nav-icons {
    display: flex;
    align-items: center;
    gap: 15px;
}

.nav-icons button,
.nav-icons a {
    background: none;
    border: none;
    cursor: pointer;
}

.nav-icons .account-dropdown {
    position: relative;
}

.nav-icons .account-dropdown .dropdown-menu {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #FAF1D7;
    border: 1px solid #FAF1D7;
    min-width: 150px;
    z-index: 1000;
}

.nav-icons .account-dropdown:hover .dropdown-menu {
    display: block;
}

.nav-icons .cart-link {
    display: flex;
    align-items: center;
    gap: 5px;
    text-decoration: none;
    color: #000;
}

.icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #fff;
}

/* Search Sidebar */
.search-sidebar {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    max-width: 400px;
    height: 100%;
    background-color: #fff;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
    transition: right 0.3s ease-in-out;
    z-index: 2000;
    padding: 20px;
}

.search-sidebar.open {
    right: 0;
}

.search-sidebar__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.search-sidebar__header-title {
    font-size: 18px;
    font-weight: bold;
}

.search-sidebar__close-button-wrapper {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

.search-sidebar__form .search-field {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
}

.search-sidebar__form .search-field__input {
    flex: 1;
    padding: 10px;
    border: none;
    outline: none;
}

.search-sidebar__form .search-field__controls-item {
    background: #333;
    color: #fff;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
}

/* Responsive */
@media (max-width: 568px) {
    .desktop-nav {
        display: none;
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

    .nav-menu {
        position: fixed;
        top: 0;
        left: -100%;
        width: 269px;
        height: 100vh;
        background-color: #FAF1D7;
        z-index: 9999;
        transition: left 0.3s ease;
        padding: 20px;
        overflow-y: auto;
    }

    .nav-menu.open {
        left: 0;
    }
}

.mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
}

@media (min-width: 769px) {
    .mobile-header {
        display: none;
    }
}
</style>


<body>


    <?php if (!empty($after_body)) echo $after_body; ?>

    <!-- Top bar -->
    <div class="top">
        <div class="container">
            <div class="row">
                <div class="col-md-6 col-sm-6 col-md-12">
                    <div class="left">
                        <ul>
                            <?php if (!empty($contact_phone)) : ?>
                            <li>Customer Care - <i class="fa fa-phone"></i> <?php echo $contact_phone; ?></li>
                            <?php endif; ?>
                        </ul>
                    </div>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-12">
                    <div class="right">
                        <!-- Reserved for future use (e.g. social icons) -->
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- Mobile Header -->
    <div class="mobile-header">
        <div class="left-icons">
            <!-- Sidebar Toggle Button -->
            <!-- Toggle Button -->
            <button id="menu-toggle-mobile" class="icon-btn text-dark">
                <img width="28" height="28" src="https://img.icons8.com/color/48/circled-menu.png" alt="circled-menu" />
            </button>

            <!-- Sidebar Navigation Menu -->
            <ul id="nav-menu-mobile" class="nav-menu-mobile">
                <?php
    $stmt = $pdo->prepare("SELECT * FROM tbl_top_category WHERE show_on_menu=1");
    $stmt->execute();
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $top): ?>
                <li>
                    <div class="accordion-header top">
                        <span class="accordion-icon">+</span>
                        <span class="accordion-title"><?= $top['tcat_name']; ?></span>
                    </div>
                    <ul class="accordion-body">
                        <?php
                $stmt1 = $pdo->prepare("SELECT * FROM tbl_mid_category WHERE tcat_id=?");
                $stmt1->execute([$top['tcat_id']]);
                foreach ($stmt1->fetchAll(PDO::FETCH_ASSOC) as $mid): ?>
                        <li>
                            <div class="accordion-header mid">
                                <span class="accordion-icon">+</span>
                                <a href="product-category.php?id=<?= $mid['mcat_id']; ?>&type=mid-category"
                                    class="accordion-title">
                                    <?= $mid['mcat_name']; ?>
                                </a>
                            </div>
                            <ul class="accordion-body-next">
                                <?php
                            $stmt2 = $pdo->prepare("SELECT * FROM tbl_end_category WHERE mcat_id=?");
                            $stmt2->execute([$mid['mcat_id']]);
                            foreach ($stmt2->fetchAll(PDO::FETCH_ASSOC) as $end): ?>
                                <li style="list-style-type: none">
                                    <a href="product-category.php?id=<?= $end['ecat_id']; ?>&type=end-category">
                                        <?= $end['ecat_name']; ?>
                                    </a>
                                </li>
                                <?php endforeach; ?>
                            </ul>
                        </li>
                        <?php endforeach; ?>
                    </ul>
                </li>
                <?php endforeach; ?>
            </ul>

            <!-- Account Dropdown -->
            <div class="account-dropdown" id="accountDropdown">
                <button id="account-toggle-mobile" class="icon-btn" aria-label="Account">
                    <img width="28" height="28" src="https://img.icons8.com/ios/50/user-male-circle--v1.png"
                        alt="user-male-circle--v1" />
                </button>

                <ul class="dropdown-menu-mobile">
                    <?php if (isset($_SESSION['customer'])): ?>
                    <li><i class="fa fa-user"></i> <?= LANG_VALUE_13 . ' ' . $_SESSION['customer']['cust_name']; ?></li>
                    <li><a href="dashboard.php"><img width="30" src="https://img.icons8.com/fluency/48/home.png" />
                            <?= LANG_VALUE_89; ?></a></li>
                    <li><a href="customer-profile-update.php"><img width="30"
                                src="https://img.icons8.com/color/48/life-cycle-female--v1.png" />
                            <?= LANG_VALUE_117; ?></a></li>
                    <li><a href="customer-billing-shipping-update.php"><img width="30"
                                src="https://img.icons8.com/color/48/order-delivered.png" /> <?= LANG_VALUE_88; ?></a>
                    </li>
                    <li><a href="customer-password-update.php"><img width="30"
                                src="https://img.icons8.com/external-flat-vol-2-vectorslab/68/external-lock-refresh-gdpr-flat-vol-2-vectorslab.png" />
                            <?= LANG_VALUE_99; ?></a></li>
                    <li><a href="customer-order.php"><img width="30"
                                src="https://img.icons8.com/color-glass/48/order-history.png" />
                            <?= LANG_VALUE_24; ?></a></li>
                    <li><a href="logout.php"><img width="30" src="https://img.icons8.com/arcade/64/exit.png" />
                            <?= LANG_VALUE_14; ?></a></li>
                    <?php else: ?>
                    <li><a href="login.php"><img width="16"
                                src="https://img.icons8.com/ios/50/login-rounded-right--v1.png" />
                            <?= LANG_VALUE_9; ?></a></li>
                    <li><a href="registration.php"><img width="16"
                                src="https://img.icons8.com/parakeet-line/48/user.png" /> <?= LANG_VALUE_15; ?></a></li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>


        <!-- Logo -->
        <div class="logo">
            <a href="index.php">
                <img src="assets/uploads/<?= htmlspecialchars($logo); ?>" alt="Radha Rani" />
            </a>
        </div>

        <!-- Right Icons -->
        <div class="right-icons">
            <button id="search-toggle" class="icon-btn">
                <img width="28" height="28" src="https://img.icons8.com/ios/50/search--v1.png" alt="search--v1" />
            </button>
            <!-- Wishlist Icon -->


            <?php
$wishlist_count = isset($_COOKIE['wishlist']) ? count(json_decode($_COOKIE['wishlist'], true)) : 0;
?>
            <a href="wishlist.php" class="icon-btn" style="position: relative; display: inline-block;">
                <img width="28" src="https://img.icons8.com/ios/50/000000/like--v1.png" alt="wishlist" />
                <?php if ($wishlist_count > 0): ?>
                <span class="cart-count"><?= $wishlist_count; ?></span>
                <?php endif; ?>
            </a>

            <a href="cart.php" class="icon-btn cart-btn">
                <img width="28" height="28" src="https://img.icons8.com/ios/50/shop-local.png" alt="shop-local" />
                <?php if (!empty($_SESSION['cart_p_id']) && array_sum($_SESSION['cart_p_qty']) > 0): ?>
                <span class="cart-count">
                    <?= array_sum($_SESSION['cart_p_qty']); ?>
                </span>
                <?php endif; ?>
            </a>
        </div>
    </div>
    <!-- Desktop Header -->
    <div class="desktop-nav">
        <div class="logo">
            <a href="index.php">
                <img src="assets/uploads/<?php echo htmlspecialchars($logo); ?>" alt="Logo" height="50">
            </a>
        </div>
        <div class="nav-menu" id="nav-menu" tabindex="-1">
            <ul>
                <?php
            $stmt = $pdo->prepare("SELECT * FROM tbl_top_category WHERE show_on_menu=1");
            $stmt->execute();
            $topCats = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($topCats as $top):
            ?>
                <li class="dropdown">
                    <a
                        href="product-category.php?id=<?php echo $top['tcat_id']; ?>&type=top-category"><?php echo $top['tcat_name']; ?></a>
                    <ul class="dropdown-menu">
                        <?php
                    $stmt1 = $pdo->prepare("SELECT * FROM tbl_mid_category WHERE tcat_id=?");
                    $stmt1->execute([$top['tcat_id']]);
                    foreach ($stmt1->fetchAll(PDO::FETCH_ASSOC) as $mid):
                    ?>
                        <li class="dropdown">
                            <a
                                href="product-category.php?id=<?php echo $mid['mcat_id']; ?>&type=mid-category"><?php echo $mid['mcat_name']; ?></a>
                            <ul class="dropdown-menu">
                                <?php
                            $stmt2 = $pdo->prepare("SELECT * FROM tbl_end_category WHERE mcat_id=?");
                            $stmt2->execute([$mid['mcat_id']]);
                            foreach ($stmt2->fetchAll(PDO::FETCH_ASSOC) as $end):
                            ?>
                                <li>
                                    <a
                                        href="product-category.php?id=<?php echo $end['ecat_id']; ?>&type=end-category"><?php echo $end['ecat_name']; ?></a>
                                </li>
                                <?php endforeach; ?>
                            </ul>
                        </li>
                        <?php endforeach; ?>
                    </ul>
                </li>
                <?php endforeach; ?>
            </ul>
            <!-- <a class="unstyled-button search-sidebar__close-button-wrapper" id="close-menu-bar"></a> -->
        </div>


        <div class="nav-icons">
            <button id="search-toggle" aria-label="Search">
                <img src="https://img.icons8.com/sf-ultralight/50/search.png" alt="Search" width="28" height="28">
            </button>
            <div class="account-dropdown">
                <button id="account-toggle" aria-label="Account">
                    <img src="https://img.icons8.com/ios/50/user-male-circle--v1.png" alt="Account" width="28"
                        height="28">
                </button>



                <ul class="dropdown-menu">

                    <?php if (isset($_SESSION['customer'])) { ?>
                    <li><i class="fa fa-user"></i> <?= LANG_VALUE_13 . ' ' . $_SESSION['customer']['cust_name']; ?></li>
                    <li><a href="dashboard.php"><img width="30" src="https://img.icons8.com/fluency/48/home.png" />
                            <?= LANG_VALUE_89; ?></a></li>
                    <li><a href="customer-profile-update.php"><img width="30"
                                src="https://img.icons8.com/color/48/life-cycle-female--v1.png" />
                            <?= LANG_VALUE_117; ?></a></li>
                    <li><a href="customer-billing-shipping-update.php"><img width="30"
                                src="https://img.icons8.com/color/48/order-delivered.png" /> <?= LANG_VALUE_88; ?></a>
                    </li>
                    <li><a href="customer-password-update.php"><img width="30"
                                src="https://img.icons8.com/external-flat-vol-2-vectorslab/68/external-lock-refresh-gdpr-flat-vol-2-vectorslab.png" />
                            <?= LANG_VALUE_99; ?></a></li>
                    <li><a href="customer-order.php"><img width="30"
                                src="https://img.icons8.com/color-glass/48/order-history.png" />
                            <?= LANG_VALUE_24; ?></a></li>
                    <li><a href="logout.php"><img width="30" src="https://img.icons8.com/arcade/64/exit.png" />
                            <?= LANG_VALUE_14; ?></a></li>
                    <?php }elseif (!isset($_SESSION['customer'])) { ?>
                    <li><a href="login.php"><img width="16"
                                src="https://img.icons8.com/ios/50/login-rounded-right--v1.png" />
                            <?= LANG_VALUE_9; ?></a></li>
                    <li><a href="registration.php"><img width="16"
                                src="https://img.icons8.com/parakeet-line/48/user.png" /> <?= LANG_VALUE_15; ?></a></li>
                    <?php } else { ?>
                    <li><?php $csrf->echoInputField(); ?>
                        <a id="openSearchSidebar" style="text-decoration: none; cursor: pointer;">
                            <img width="20" height="20" src="https://img.icons8.com/sf-ultralight/50/search.png"
                                alt="search" />
                            <?php echo LANG_VALUE_3; ?>
                        </a>
                    </li>

                    <!-- Account Dropdown -->
                    <li class="dropdown">
                        <a class="dropdown-toggle" href="#">
                            <img width="28" height="28" src="https://img.icons8.com/ios/50/user-male-circle--v1.png"
                                alt="account" />
                            Account
                        </a>
                        <ul class="dropdown-menu">
                            <li><a href="login.php">
                                    <img width="28" height="28"
                                        src="https://img.icons8.com/ios/50/login-rounded-right--v1.png" alt="login" />
                                    <?php echo LANG_VALUE_9; ?>
                                </a></li>
                            <li><a href="registration.php">
                                    <img width="28" height="28" src="https://img.icons8.com/parakeet-line/48/user.png"
                                        alt="register" />
                                    <?php echo LANG_VALUE_15; ?>
                                </a></li>
                        </ul>
                    </li>
                    <?php } ?>

            </div>
            <!-- Wishlist Icon -->
            <?php
$wishlist_count = isset($_COOKIE['wishlist']) ? count(json_decode($_COOKIE['wishlist'], true)) : 0;
?>
            <a href="wishlist.php" class="icon-btn" style="position: relative; display: inline-block;">
                <img width="28" src="https://img.icons8.com/ios/50/000000/like--v1.png" alt="wishlist" />
                <?php if ($wishlist_count > 0): ?>
                <span class="wishlist-count"><?= $wishlist_count; ?></span>
                <?php endif; ?>
            </a>


            <a href="cart.php" class="icon-btn cart-btn">
                <img width="28" height="28" src="https://img.icons8.com/ios/50/shop-local.png" alt="shop-local" />
                <?php if (!empty($_SESSION['cart_p_id']) && array_sum($_SESSION['cart_p_qty']) > 0): ?>
                <span class="cart-count">
                    <?= array_sum($_SESSION['cart_p_qty']); ?>
                </span>
                <?php endif; ?>
            </a>

            </ul>
        </div>
    </div>

    <!-- Search Sidebar -->
    <div id="SearchSidebar" class="search-sidebar" tabindex="-1">
        <div class="search-sidebar__body">
            <div class="search-sidebar__header-wrapper">
                <div class="search-sidebar__header">
                    <div class="search-sidebar__header-title">SEARCH</div>
                    <button class="unstyled-button search-sidebar__close-button-wrapper"
                        id="close-search-sidebar">✖</button>
                </div>
                <form id="SearchSidebarForm" action="search-result.php" method="get" role="search">
                    <div class="search-field" style="position: relative;">
                        <input id="SearchInput" type="text" name="search_text"
                            placeholder="What are you looking for?" />
                        <div class="search-field__controls">
                            <button type="submit" aria-label="Search">🔍</button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="search-sidebar__footer hidden">
                <button class="btn btn--solid btn--lg search-sidebar__footer-button" form="SearchSidebarForm"
                    type="submit">
                    See all results
                </button>
            </div>
        </div>
    </div>



    <script>
    document.addEventListener("DOMContentLoaded", function() {
        const menuToggle = document.querySelectorAll("#menu-toggle");
        const navMenu = document.getElementById("nav-menu");
        const closeMenuBtn = document.getElementById("close-menu-bar");
        const openBtns = document.querySelectorAll("#search-toggle");
        const sidebar = document.getElementById("SearchSidebar");
        const closeBtn = document.getElementById("close-search-sidebar");


        menuToggle.forEach(btn => {
            btn.addEventListener("click", () => navMenu.classList.add("open"));
        });

        if (closeMenuBtn && navMenu) {
            closeMenuBtn.addEventListener("click", () => navMenu.classList.remove("open"));
        }

        window.addEventListener("click", function(e) {
            if (navMenu.classList.contains("open") &&
                !navMenu.contains(e.target) &&
                !e.target.closest("#menu-toggle")) {
                navMenu.classList.remove("open");
            }
        });

        window.addEventListener("keydown", function(e) {
            if (e.key === "Escape") {
                navMenu.classList.remove("open");
            }
        });


        openBtns.forEach(btn => {
            btn.addEventListener("click", () => sidebar.classList.add("open"));
        });

        if (closeBtn && sidebar) {
            closeBtn.addEventListener("click", () => sidebar.classList.remove("open"));
        }

        window.addEventListener("click", function(e) {
            if (sidebar.classList.contains("open") &&
                !sidebar.contains(e.target) &&
                !e.target.closest("#search-toggle")) {
                sidebar.classList.remove("open");
            }
        });

        window.addEventListener("keydown", function(e) {
            if (e.key === "Escape") {
                sidebar.classList.remove("open");
            }
        });
    });
    </script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>








    <!-- CSS -->
    <style>
    .nav-menu-mobile {
        list-style: none;
        padding: 0;
        margin: 0;
        background: #FAF1D7;
        width: 100%;
    }

    .accordion-header {
        background-color: #FAF1D7;
        color: #000;
        padding: 10px 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: bold;
    }

    .accordion-header.inner {
        background-color: #ffffff00;
        color: #000;
        padding-left: 30px;
        font-weight: normal;
    }

    .accordion-icon {
        background: transparent;
        color: #000;
        width: 20px;
        height: 20px;
        display: inline-block;
        text-align: center;
        border-radius: 3px;
        font-weight: bold;
    }

    .accordion-body {
        display: none;
        list-style: none;
        padding-left: 30px;
        background-color: #ffffff00;
    }

    .accordion-body li a {
        display: block;
        padding: 8px 0;
        color: #000;
        text-decoration: none;
    }



    .nav-menu-mobile {
        display: none;
        position: absolute;
        background: #FAF1D7;
        width: 300px;
        max-height: 100vh;
        overflow-y: auto;
        z-index: 1000;
        border: 1px solid #FAF1D7;
        padding: 10px;
        top: 162px;
    }

    .nav-menu-mobile.show {
        display: block;
    }

    .accordion-body,
    .accordion-body-next {
        display: none;
        padding-left: 15px;
    }

    .accordion-header {
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 6px;
        padding: 6px 0;
    }

    .accordion-header span.accordion-icon {
        font-weight: bold;
        width: 16px;
        display: inline-block;
    }




    .dropdown-menu {
        display: none;
        list-style: none;
        padding-left: 15px;
        background-color: #FAF1D7;
    }

    .dropdown:hover>.dropdown-menu {
        display: block;
        background-color: #FAF1D7;
    }

    .account-dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-menu-mobile {
        display: none;
        position: absolute;
        background-color: #FAF1D7;
        min-width: 300px;
        z-index: 1000;
        list-style: none;
        padding: 10px 0;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        left: 0;

    }

    .account-dropdown.show .dropdown-menu-mobile {
        display: block;
    }

    .dropdown-menu-mobile li {
        padding: 8px 16px;
    }

    .dropdown-menu-mobile li a {
        text-decoration: none;
        color: #000;
    }

    .dropdown-menu-mobile li:hover {
        background-color: #FAF1D7;
    }

    .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
    }

    .cart-count {
        background: hotpink;
        color: white;
        border-radius: 50%;
        font-size: 12px;
        padding: 2px 6px;
        position: absolute;
        top: -12px;
        right: -10px;
    }

    .wishlist-count {
        position: absolute;
        top: -12px;
        right: -8px;
        background-color: hotpink;
        color: white;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 50%;
        font-weight: bold;
        min-width: 20px;
        text-align: center;
    }

    .cart-btn {
        position: relative;
        display: inline-block;
    }
    </style>


    <script>
    document.getElementById('account-toggle-mobile').addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('accountDropdown').classList.toggle('show');
    });

    document.getElementById('dropdown-toggle-mobile').addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('dropdown-menu-mobile').classList.toggle('show');
    });

    window.addEventListener('click', function() {
        document.getElementById('accountDropdown').classList.remove('show');
    });
    </script>

    <script>
    // Open/Close nav-menu-mobile
    const toggleBtn = document.getElementById('menu-toggle-mobile');
    const navMenu = document.getElementById('nav-menu-mobile');

    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('show');
    });

    // Accordion functionality
    document.querySelectorAll('#nav-menu-mobile .accordion-header.top').forEach(topHeader => {
        topHeader.addEventListener('click', function() {
            const body = this.nextElementSibling;
            const icon = this.querySelector('.accordion-icon');

            // Close all top bodies except this one
            document.querySelectorAll('#nav-menu-mobile .accordion-body').forEach(el => {
                if (el !== body) el.style.display = 'none';
            });

            document.querySelectorAll('#nav-menu-mobile .accordion-header.top .accordion-icon').forEach(
                ic => {
                    if (ic !== icon) ic.innerText = '+';
                });

            if (body.style.display === 'block') {
                body.style.display = 'none';
                icon.innerText = '+';
            } else {
                body.style.display = 'block';
                icon.innerText = '−';
            }
        });
    });

    document.querySelectorAll('#nav-menu-mobile .accordion-header.mid').forEach(midHeader => {
        midHeader.addEventListener('click', function(e) {
            e.stopPropagation();
            const body = this.nextElementSibling;
            const icon = this.querySelector('.accordion-icon');

            // Close all mid bodies except this one
            document.querySelectorAll('#nav-menu-mobile .accordion-body-next').forEach(el => {
                if (el !== body) el.style.display = 'none';
            });

            document.querySelectorAll('#nav-menu-mobile .accordion-header.mid .accordion-icon').forEach(
                ic => {
                    if (ic !== icon) ic.innerText = '+';
                });

            if (body.style.display === 'block') {
                body.style.display = 'none';
                icon.innerText = '+';
            } else {
                body.style.display = 'block';
                icon.innerText = '−';
            }
        });
    });

    // Close nav-menu when clicking outside
    window.addEventListener('click', function(e) {
        const isClickInside = navMenu.contains(e.target) || toggleBtn.contains(e.target);
        if (!isClickInside) {
            navMenu.classList.remove('show');
            document.querySelectorAll('.accordion-body, .accordion-body-next').forEach(el => el.style.display =
                'none');
            document.querySelectorAll('.accordion-icon').forEach(ic => ic.innerText = '+');
        }
    });
    </script>