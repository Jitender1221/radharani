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
<?php
if (!isset($_REQUEST['id'])) {
    header('location: index.php');
    exit;
} else {
    // Check the id is valid or not
    $statement = $pdo->prepare("SELECT * FROM tbl_product WHERE p_id=?");
    $statement->execute(array($_REQUEST['id']));
    $total = $statement->rowCount();
    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    if ($total == 0) {
        header('location: index.php');
        exit;
    }
}

foreach ($result as $row) {
    $p_name = $row['p_name'];
    $p_old_price = $row['p_old_price'];
    $p_current_price = $row['p_current_price'];
    $p_qty = $row['p_qty'];
    $p_featured_photo = $row['p_featured_photo'];
    $p_description = $row['p_description'];
    $p_short_description = $row['p_short_description'];
    $p_feature = $row['p_feature'];
    $p_condition = $row['p_condition'];
    $p_return_policy = $row['p_return_policy'];
    $p_total_view = $row['p_total_view'];
    $p_is_featured = $row['p_is_featured'];
    $p_is_active = $row['p_is_active'];
    $ecat_id = $row['ecat_id'];
    
}





// Getting all categories name for breadcrumb
$statement = $pdo->prepare("SELECT
                        t1.ecat_id,
                        t1.ecat_name,
                        t1.mcat_id,
                        t2.mcat_id,
                        t2.mcat_name,
                        t2.tcat_id,
                        t3.tcat_id,
                        t3.tcat_name
                        FROM tbl_end_category t1
                        JOIN tbl_mid_category t2 ON t1.mcat_id = t2.mcat_id
                        JOIN tbl_top_category t3 ON t2.tcat_id = t3.tcat_id
                        WHERE t1.ecat_id=?");
$statement->execute(array($ecat_id));
$total = $statement->rowCount();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);
foreach ($result as $row) {
    $ecat_name = $row['ecat_name'];
    $mcat_id = $row['mcat_id'];
    $mcat_name = $row['mcat_name'];
    $tcat_id = $row['tcat_id'];
    $tcat_name = $row['tcat_name'];
}

$p_total_view = $p_total_view + 1;

$statement = $pdo->prepare("UPDATE tbl_product SET p_total_view=? WHERE p_id=?");
$statement->execute(array($p_total_view, $_REQUEST['id']));

$statement = $pdo->prepare("SELECT * FROM tbl_product_size WHERE p_id=?");
$statement->execute(array($_REQUEST['id']));
$result = $statement->fetchAll(PDO::FETCH_ASSOC);
$size = [];
foreach ($result as $row) {
    $size[] = $row['size_id'];
}

$statement = $pdo->prepare("SELECT * FROM tbl_product_color WHERE p_id=?");
$statement->execute(array($_REQUEST['id']));
$result = $statement->fetchAll(PDO::FETCH_ASSOC);
$color = [];
foreach ($result as $row) {
    $color[] = $row['color_id'];
}

if (isset($_POST['form_review'])) {
    $statement = $pdo->prepare("SELECT * FROM tbl_rating WHERE p_id=? AND cust_id=?");
    $statement->execute(array($_REQUEST['id'], $_SESSION['customer']['cust_id']));
    $total = $statement->rowCount();

    if ($total) {
        $error_message = LANG_VALUE_68; 
    } else {
        $statement = $pdo->prepare("INSERT INTO tbl_rating (p_id, cust_id, comment, rating) VALUES (?, ?, ?, ?)");
        $statement->execute(array($_REQUEST['id'], $_SESSION['customer']['cust_id'], $_POST['comment'], $_POST['rating']));
        $success_message = LANG_VALUE_163;    
    }
}

// Getting the average rating for this product
$t_rating = 0;
$statement = $pdo->prepare("SELECT * FROM tbl_rating WHERE p_id=?");
$statement->execute(array($_REQUEST['id']));
$tot_rating = $statement->rowCount();
if ($tot_rating == 0) {
    $avg_rating = 0;
} else {
    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    foreach ($result as $row) {
        $t_rating += $row['rating'];
    }
    $avg_rating = $t_rating / $tot_rating;
}

if (isset($_POST['form_add_to_cart'])) {
    // Fetch current stock for the product
    $statement = $pdo->prepare("SELECT * FROM tbl_product WHERE p_id=?");
    $statement->execute([$_REQUEST['id']]);
    $products = $statement->fetch(PDO::FETCH_ASSOC);
 
    if (!$product) {
        echo "<script>alert('Product not found.');</script>";
        return;
    }

    $current_p_qty = $product['p_qty'];
    $requested_qty = $_POST['p_qty'];

  

    if ($requested_qty > $current_p_qty) {
        $temp_msg = 'Sorry! Only ' . $current_p_qty . ' item(s) are in stock';
        echo "<script>alert('$temp_msg');</script>";
    } else {
        $size_id = $_POST['size_id'] ?? 0;
        $color_id = $_POST['color_id'] ?? 0;

        // Get size name
        $size_name = '';
        if ($size_id) {
            $stmt = $pdo->prepare("SELECT size_name FROM tbl_size WHERE size_id=?");
            $stmt->execute([$size_id]);
            $size_name = $stmt->fetchColumn();
        }

        // Get color code
        $color_code = '';
        if ($color_id) {
            $stmt = $pdo->prepare("SELECT color_code FROM tbl_color WHERE color_id=?");
            $stmt->execute([$color_id]);
            $color_code = $stmt->fetchColumn();
        }

        if (!isset($_SESSION['cart_p_id'])) {
            $_SESSION['cart_p_id'] = [];
            $_SESSION['cart_size_id'] = [];
            $_SESSION['cart_size_name'] = [];
            $_SESSION['cart_color_id'] = [];
            $_SESSION['cart_color_name'] = [];
            $_SESSION['cart_p_qty'] = [];
            $_SESSION['cart_p_current_price'] = [];
            $_SESSION['cart_p_name'] = [];
            $_SESSION['cart_p_featured_photo'] = [];
        }

        $added = false;
        $cart_count = count($_SESSION['cart_p_id']);

        // Check if product with same size and color already in cart
        for ($i = 0; $i < $cart_count; $i++) {
            if (
                $_SESSION['cart_p_id'][$i] == $_REQUEST['id'] &&
                $_SESSION['cart_size_id'][$i] == $size_id &&
                $_SESSION['cart_color_id'][$i] == $color_id
            ) {
                $new_qty = $_SESSION['cart_p_qty'][$i] + $requested_qty;

                if ($new_qty > $current_p_qty) {
                    $error_message1 = 'You cannot add more than ' . $current_p_qty . ' items in total.';
                } else {
                    $_SESSION['cart_p_qty'][$i] = $new_qty;
                    $success_message1 = 'Product quantity updated in your cart!';
                }

                $added = true;
                break;
            }
        }

        if (!$added) {
            $new_key = $cart_count;

            $_SESSION['cart_p_id'][$new_key] = $_REQUEST['id'];
            $_SESSION['cart_size_id'][$new_key] = $size_id;
            $_SESSION['cart_size_name'][$new_key] = $size_name;
            $_SESSION['cart_color_id'][$new_key] = $color_id;
            $_SESSION['cart_color_name'][$new_key] = $color_code;
            $_SESSION['cart_p_qty'][$new_key] = $requested_qty;
            $_SESSION['cart_p_current_price'][$new_key] = $_POST['p_current_price'];
            $_SESSION['cart_p_name'][$new_key] = $_POST['p_name'];
            $_SESSION['cart_p_featured_photo'][$new_key] = $_POST['p_featured_photo'];

            $success_message1 = 'Product is added to the cart successfully!';
        }
    }
}

?>

<?php
if (isset($error_message1) && $error_message1 != '') {
    echo "<script>alert('" . $error_message1 . "')</script>";
}
if (isset($success_message1) && $success_message1 != '') {
    echo "<script>alert('" . $success_message1 . "')</script>";
    header('location: product.php?id=' . $_REQUEST['id']);
}
?>

<link rel="stylesheet" href="product.css">




<div class="page">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="breadcrumb mb_30">
                    <ul>
                        <li><a href="<?php echo BASE_URL.'index.php'; ?>">Home</a></li>
                        <li>></li>
                        <li><a
                                href="<?php echo BASE_URL.'product-category.php?id='.$tcat_id.'&type=top-category' ?>"><?php echo $tcat_name; ?></a>
                        </li>
                        <li>></li>
                        <li><a
                                href="<?php echo BASE_URL.'product-category.php?id='.$mcat_id.'&type=mid-category' ?>"><?php echo $mcat_name; ?></a>
                        </li>
                        <li>></li>
                        <li><a
                                href="<?php echo BASE_URL.'product-category.php?id='.$ecat_id.'&type=end-category' ?>"><?php echo $ecat_name; ?></a>
                        </li>
                        <li>></li>
                        <li><?php echo $p_name; ?></li>
                    </ul>
                </div>

                <div class="product">
                    <div class="row">
                        <div class="container">
                            <div class="row col-md-5">
                                <ul class="prod-slider">

                                    <li style="background-image: url(assets/uploads/<?php echo $p_featured_photo; ?>);">
                                        <a class="popup" href="assets/uploads/<?php echo $p_featured_photo; ?>"></a>
                                    </li>
                                    <?php
                                $statement = $pdo->prepare("SELECT * FROM tbl_product_photo WHERE p_id=?");
                                $statement->execute(array($_REQUEST['id']));
                                $result = $statement->fetchAll(PDO::FETCH_ASSOC);
                                foreach ($result as $row) {
                                    ?>
                                    <li
                                        style="background-image: url(assets/uploads/product_photos/<?php echo $row['photo']; ?>);">
                                        <a class="popup"
                                            href="assets/uploads/product_photos/<?php echo $row['photo']; ?>"></a>
                                    </li>
                                    <?php
                                }
                                ?>
                                </ul>
                                <div id="prod-pager" class="thumbs">
                                    <a data-slide-index="0" href="">
                                        <div class="prod-pager-thumb"
                                            style="background-image: url(assets/uploads/<?php echo $p_featured_photo; ?>">
                                        </div>
                                    </a>
                                    <?php
                                $i=1;
                                $statement = $pdo->prepare("SELECT * FROM tbl_product_photo WHERE p_id=?");
                                $statement->execute(array($_REQUEST['id']));
                                $result = $statement->fetchAll(PDO::FETCH_ASSOC);
                                foreach ($result as $row) {
                                    ?>
                                    <a data-slide-index="<?php echo $i; ?>" href="">
                                        <div class="prod-pager-thumb"
                                            style="background-image: url(assets/uploads/product_photos/<?php echo $row['photo']; ?>">
                                        </div>
                                    </a>
                                    <?php
                                    $i++;
                                }
                                ?>
                                </div>
                            </div>



                            <div class="col-md-7">
                                <div class="p-title">
                                    <h2><?php echo $p_name; ?></h2>
                                </div>
                                <div class="p-review">
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
                                </div>
                                <div class="p-short-des">
                                    <p>
                                        <?php echo $p_short_description; ?>
                                    </p>
                                </div>
                                <form action="" method="post">
                                    <div class="p-quantity">
                                        <div class="row">
                                            <?php if(isset($size)): ?>
                                            <div class="col-md-12 mb_20">
                                                <label class="label-title"><?php echo LANG_VALUE_52; ?></label> <br>

                                                <div class="size-box-group">
                                                    <?php
            $statement = $pdo->prepare("SELECT * FROM tbl_size");
            $statement->execute();
            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
            foreach ($result as $row) {
                if(in_array($row['size_id'],$size)) {
            ?>
                                                    <label class="size-btn">
                                                        <input type="radio" name="size_id"
                                                            value="<?php echo $row['size_id']; ?>" required hidden>
                                                        <?php echo $row['size_name']; ?>
                                                    </label>
                                                    <?php
                }
            }
            ?>
                                                </div>
                                            </div>
                                            <?php endif; ?>


                                            <?php if(isset($color)): ?>
                                            <div class="col-md-12">
                                                <label><?php echo LANG_VALUE_53; ?></label>
                                                <div class="colorBox">
                                                    <?php
                                $statement = $pdo->prepare("SELECT * FROM tbl_color");
                                $statement->execute();
                                $result = $statement->fetchAll(PDO::FETCH_ASSOC);

                                foreach ($result as $row) {
                                    if (in_array($row['color_id'], $color)) {
                                        $color_code = $row['color_code'];
                                        $shape = $row['shape'];
                                        $border_radius = ($shape == 'circle') ? '50%' : '50%';
                                ?>
                                                    <div class=" text-center ">
                                                        <label style="cursor: pointer;">
                                                            <input type="radio" name="color_id"
                                                                value="<?php echo $row['color_id']; ?>" required
                                                                style="display:none;">
                                                            <div class="color-box"
                                                                style="width: 20px; height: 20px; background-color: <?php echo $color_code; ?>; border-radius: <?php echo $border_radius; ?>; border: 1px solid #999; margin: auto;">
                                                            </div>

                                                        </label>
                                                    </div>
                                                    <?php  }     }     ?>
                                                </div>
                                            </div>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                    <div id="color-section" class="mt-2">
                                        <img src="https://cdn.shopify.com/s/files/1/0848/1321/8088/files/ruler_pink.svg?v=1736774771"
                                            alt="open size chart icon" style="width: auto; margin-left: 0px;"><span
                                            class="form__label smartsize-button-text" data-toggle="modal"
                                            data-target="#sizeGuideModal" style="margin-left: 7px;">SIZE
                                            GUIDE</span>
                                    </div>
                                    <br />
                                    <div class="row">
                                        <div class="p-price ">
                                            <span style="font-size:14px;"><?php echo LANG_VALUE_54; ?></span><br>
                                            <span>
                                                <?php if($p_old_price!=''): ?>
                                                <del><?php echo LANG_VALUE_1; ?><?php echo $p_old_price; ?></del>
                                                <?php endif; ?>
                                                <?php echo LANG_VALUE_1; ?><?php echo $p_current_price; ?>

                                                <?php 

                                                $sql = "SELECT * FROM tbl_product WHERE p_id = :p_id";
                                                $stmt = $pdo->prepare($sql);
                                                $stmt->execute(['p_id' => $_REQUEST['id']]);
                                                $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
                                                foreach ($products as $product) {

                                                $p_discount = '';
                                                                        if (!empty($product['p_old_price']) && $product['p_old_price'] > $product['p_current_price']) {
                                                                            $p_discount = round((($product['p_old_price'] - $product['p_current_price']) / $product['p_old_price']) * 100) . '% OFF';
                                                                        }

                                                }



                                            ?>

                                                <?php if($p_discount): ?>
                                                <span class="discount-latest">
                                                    <?php echo $p_discount; ?>
                                                </span>
                                                <?php endif; ?>
                                                <!-- Price Details -->


                                                <?php
                                            
                                                $mrp = ($product['p_old_price']);
                                                $selling_price = ($product['p_old_price']);
                                                $final_price = ($product['p_current_price']);
                                                $discount = $selling_price - $final_price;
                                                $total_savings = $mrp - $final_price;
                                                $saving_percent = round(($total_savings / $mrp) * 100);
                                                    ?>

                                                <!-- Price Details -->
                                                <div class="faq-button">
                                                    <img class="faq-icon"
                                                        src="https://img.icons8.com/sf-ultralight-filled/25/information.png"
                                                        alt="information" />
                                                    <div class="faq-tooltip">
                                                        <div class="faq-tooltip-title">Price Details</div>
                                                        <p>MRP: ₹<?php echo number_format($mrp); ?></p>
                                                        <p>Selling Price: ₹<?php echo number_format($selling_price); ?>
                                                        </p>
                                                        <p>Sale Discount:
                                                            ₹<i
                                                                class="highlight"><?php echo number_format($discount); ?></i>
                                                        </p>
                                                        <p><strong>Final Price:
                                                                ₹<?php echo number_format($final_price); ?></strong></p>
                                                        <p style="font-size: 12px;">Prices are inclusive of all taxes
                                                        </p>
                                                        <p class="highlight">You are saving
                                                            ₹<?php echo number_format($total_savings); ?>
                                                            (<?php echo $saving_percent; ?>%)</p>
                                                    </div>
                                                </div>


                                            </span>
                                        </div>
                                    </div>
                                    <input type="hidden" name="p_current_price" value="<?php echo $p_current_price; ?>">
                                    <input type="hidden" name="p_name" value="<?php echo $p_name; ?>">
                                    <input type="hidden" name="p_featured_photo"
                                        value="<?php echo $p_featured_photo; ?>">
                                    <div class="p-quantity">
                                        <?php echo LANG_VALUE_55; ?>
                                        <input type="number" class="input-text qty" step="1" min="1" max="" name="p_qty"
                                            value="1" title="Qty" size="4" pattern="[0-9]*" inputmode="numeric">
                                    </div>
                                    <div class="btn-cart btn-cart1">
                                        <input type="submit" value="<?php echo LANG_VALUE_154; ?>"
                                            name="form_add_to_cart">
                                    </div>
                                </form>
                                <div class="share">
                                    <?php echo LANG_VALUE_58; ?> <br>
                                    <div class="sharethis-inline-share-buttons"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <!-- Nav tabs -->
                            <ul class="nav nav-tabs" role="tablist">
                                <li role="presentation" class="active"><a href="#description"
                                        aria-controls="description" role="tab"
                                        data-toggle="tab"><?php echo LANG_VALUE_59; ?></a></li>
                                <li role="presentation"><a href="#feature" aria-controls="feature" role="tab"
                                        data-toggle="tab"><?php echo LANG_VALUE_60; ?></a></li>
                                <li role="presentation"><a href="#condition" aria-controls="condition" role="tab"
                                        data-toggle="tab"><?php echo LANG_VALUE_61; ?></a></li>
                                <li role="presentation"><a href="#return_policy" aria-controls="return_policy"
                                        role="tab" data-toggle="tab"><?php echo LANG_VALUE_62; ?></a></li>
                                <li role="presentation"><a href="#review" aria-controls="review" role="tab"
                                        data-toggle="tab"><?php echo LANG_VALUE_63; ?></a></li>
                            </ul>

                            <!-- Tab panes -->
                            <div class="tab-content">
                                <div role="tabpanel" class="tab-pane active" id="description"
                                    style="margin-top: -30px;">
                                    <p>
                                        <?php
                                        if($p_description == '') {
                                            echo LANG_VALUE_70;
                                        } else {
                                            echo $p_description;
                                        }
                                        ?>
                                    </p>
                                </div>
                                <div role="tabpanel" class="tab-pane" id="feature" style="margin-top: -30px;">
                                    <p>
                                        <?php
                                        if($p_feature == '') {
                                            echo LANG_VALUE_71;
                                        } else {
                                            echo $p_feature;
                                        }
                                        ?>
                                    </p>
                                </div>
                                <div role="tabpanel" class="tab-pane" id="condition" style="margin-top: -30px;">
                                    <p>
                                        <?php
                                        if($p_condition == '') {
                                            echo LANG_VALUE_72;
                                        } else {
                                            echo $p_condition;
                                        }
                                        ?>
                                    </p>
                                </div>
                                <div role="tabpanel" class="tab-pane" id="return_policy" style="margin-top: -30px;">
                                    <p>
                                        <?php
                                        if($p_return_policy == '') {
                                            echo LANG_VALUE_73;
                                        } else {
                                            echo $p_return_policy;
                                        }
                                        ?>
                                    </p>
                                </div>
                                <div role="tabpanel" class="tab-pane" id="review" style="margin-top: -30px;">
                                    <div class="review-form">
                                        <?php
       
        $statement = $pdo->prepare("
            SELECT DISTINCT r.*, c.cust_name
            FROM tbl_rating r
            JOIN tbl_customer c ON r.cust_id = c.cust_id
            JOIN tbl_payment p ON r.cust_id = p.customer_id
            JOIN tbl_order o ON p.payment_id = o.payment_id AND r.p_id = o.product_id
            WHERE r.p_id = ?
        ");
        $statement->execute([$_REQUEST['id']]);
        $total = $statement->rowCount();
        ?>

                                        <h2><?php echo LANG_VALUE_63; ?> (<?php echo $total; ?>)</h2>

                                        <?php
        if ($total > 0) {
            $reviews = $statement->fetchAll(PDO::FETCH_ASSOC);
            $j = 0;
            foreach ($reviews as $row) {
                $j++;
        ?>
                                        <div class="mb_10"><b><u><?php echo LANG_VALUE_64; ?> <?php echo $j; ?></u></b>
                                        </div>
                                        <table class="table table-bordered">
                                            <tr>
                                                <th style="width:170px;"><?php echo LANG_VALUE_75; ?></th>
                                                <td><?php echo htmlspecialchars($row['cust_name']); ?></td>
                                            </tr>
                                            <tr>
                                                <th><?php echo LANG_VALUE_76; ?></th>
                                                <td><?php echo htmlspecialchars($row['comment']); ?></td>
                                            </tr>
                                            <tr>
                                                <th><?php echo LANG_VALUE_78; ?></th>
                                                <td>
                                                    <div class="rating">
                                                        <?php
                        for ($i = 1; $i <= 5; $i++) {
                            if ($i > $row['rating']) {
                                echo '<i class="fa fa-star-o"></i>';
                            } else {
                                echo '<i class="fa fa-star"></i>';
                            }
                        }
                        ?>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        <?php
            }
        } else {
            echo '<p>' . LANG_VALUE_74 . '</p>';
        }
        ?>

                                        <h2><?php echo LANG_VALUE_65; ?></h2>

                                        <?php
        if ($error_message != '') {
            echo "<script>alert('{$error_message}');</script>";
        }
        if ($success_message != '') {
            echo "<script>alert('{$success_message}');</script>";
        }
        ?>

                                        <?php if (isset($_SESSION['customer'])): ?>
                                        <?php
         
            $statement = $pdo->prepare("
                SELECT o.id
                FROM tbl_order o
                JOIN tbl_payment p ON o.payment_id = p.payment_id
                WHERE o.product_id = ? AND p.customer_id = ?
            ");
            $statement->execute([$_REQUEST['id'], $_SESSION['customer']['cust_id']]);
            $hasPurchased = $statement->rowCount() > 0;

         
            $statement = $pdo->prepare("SELECT * FROM tbl_rating WHERE p_id = ? AND cust_id = ?");
            $statement->execute([$_REQUEST['id'], $_SESSION['customer']['cust_id']]);
            $hasReviewed = $statement->rowCount() > 0;
            ?>

                                        <?php if ($hasPurchased && !$hasReviewed): ?>
                                        <form action="" method="post">
                                            <div class="rating-section">
                                                <label><input type="radio" name="rating" value="1"> 1</label>
                                                <label><input type="radio" name="rating" value="2"> 2</label>
                                                <label><input type="radio" name="rating" value="3" checked> 3</label>
                                                <label><input type="radio" name="rating" value="4"> 4</label>
                                                <label><input type="radio" name="rating" value="5"> 5</label>
                                            </div>
                                            <div class="form-group">
                                                <textarea name="comment" class="form-control"
                                                    placeholder="Write your comment (optional)"
                                                    style="height:100px;"></textarea>
                                            </div>
                                            <input type="submit" class="btn btn-default" name="form_review"
                                                value="<?php echo LANG_VALUE_67; ?>">
                                        </form>
                                        <?php elseif (!$hasPurchased): ?>
                                        <span style="color:red;">You can only review after purchasing this
                                            product.</span>
                                        <?php else: ?>
                                        <span style="color:red;"><?php echo LANG_VALUE_68; ?></span>
                                        <?php endif; ?>

                                        <?php else: ?>
                                        <p class="error">
                                            <?php echo LANG_VALUE_69; ?><br>
                                            <a href="login.php"
                                                style="color:red;text-decoration: underline;"><?php echo LANG_VALUE_9; ?></a>
                                        </p>
                                        <?php endif; ?>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.querySelectorAll('.size-btn input[type=radio]').forEach(radio => {
    radio.addEventListener('change', function() {
        document.querySelectorAll('.size-btn').forEach(label => label.classList.remove('active'));
        this.parentElement.classList.add('active');
    });
});
</script>


<link rel="stylesheet" href="index.css">
<div class="product bg-gray pt_70 pb_70">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="headline">
                    <h2><?php echo LANG_VALUE_155; ?></h2>
                    <h3><?php echo LANG_VALUE_156; ?></h3>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">

                <div class="product-carousel">


                    <?php
                    $statement = $pdo->prepare("SELECT * FROM tbl_product WHERE ecat_id=? AND p_id!=?");
                    $statement->execute(array($ecat_id,$_REQUEST['id']));
                    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
                    foreach ($result as $row) {
                        ?>
                    <div class="cardLatest">
                        <div class="video-container-latest">
                            <div class="video"
                                style="background-image:url(assets/uploads/<?php echo ($row['p_featured_photo']); ?>);">
                            </div>
                            <?php if (!empty($p_discount)): ?>
                            <div class="discount-badge"><?php echo ($p_discount); ?></div>
                            <?php endif; ?>
                            <div class="views"><?php echo $row['p_total_view']; ?> Views</div>
                            <div class="icons">
                                <?php
$wishlist = isset($_COOKIE['wishlist']) ? json_decode($_COOKIE['wishlist'], true) : [];
$is_in_wishlist = in_array($row['p_id'], $wishlist);
?>

                                <button class="wishlist-btn" data-product-id="<?= $row['p_id']; ?>">
                                    <?php if ($is_in_wishlist): ?>
                                    <i class="fa-solid fa-heart" style="color:red;"></i>
                                    <?php else: ?>
                                    <i class="fa-regular fa-heart"></i>
                                    <?php endif; ?>
                                </button>
                                <a type="button" onclick="openShareModal()">
                                    <i class="fa-regular fa-paper-plane"></i>
                                </a>
                            </div>
                        </div>

                        <div class="product-details">
                            <h4>
                                <a href="product.php?id=<?php echo $row['p_id']; ?>">
                                    <?php echo ($row['p_name']); ?>
                                </a>
                            </h4>

                            <div class="price">
                                INR <?php echo $row['p_current_price']; ?>
                                <?php if (!empty($row['p_old_price'])): ?>
                                <span class="original">INR <del><?php echo $row['p_old_price']; ?></del></span>
                                <?php endif; ?>
                                <?php if (!empty($p_discount)): ?>
                                <span class="discount-latest"><?php echo ($p_discount); ?></span>
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
                    <?php } ?>

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
        <hr />
        <div class="share-options">
            <a href="#" id="whatsappShare" target="_blank">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
                <span>WhatsApp</span>
            </a>
            <a href="#" id="xShare" target="_blank">
                <img src="https://img.icons8.com/ios-filled/50/twitterx--v1.png" alt="X" />
                <span>X</span>
            </a>
            <a href="#" onclick="copyLink()">
                <img src="https://img.icons8.com/officel/80/copy-link.png" alt="Copy Link" />
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

<script>
document.addEventListener("DOMContentLoaded", function() {
    const colorPicker = document.getElementById("colorPicker");
    const colorResult = document.getElementById("colorResult");
    const colorPreview = document.getElementById("colorPreview");
    const shapeSelect = document.getElementById("colorShape");

    const hiddenColor = document.getElementById("colorCodeHidden");
    const hiddenShape = document.getElementById("shapeHidden");
    const hiddenPreview = document.getElementById("previewHtmlHidden");

    function updateColorPreview() {
        const color = colorPicker.value;
        const shape = shapeSelect.value;

        colorResult.value = color;
        hiddenColor.value = color;
        hiddenShape.value = shape;

        colorPreview.style.backgroundColor = color;
        colorPreview.style.borderRadius = shape === 'circle' ? '50%' : '0';

        const previewHTML =
            `<div style="width:30px; height:30px; background:${color}; border-radius:${shape === 'circle' ? '50%' : '0'};"></div>`;
        hiddenPreview.value = previewHTML;
    }

    colorPicker.addEventListener("input", updateColorPreview);
    shapeSelect.addEventListener("change", updateColorPreview);

    updateColorPreview();
});
</script>



<!-- Size Guide Modal -->
<div class="modal fade" id="sizeGuideModal" tabindex="-1" role="dialog" aria-labelledby="sizeGuideLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content p-3" style="border-radius: 10px;">
            <div class="modal-header border-0">
                <h4 class="modal-title w-100 text-center" id="sizeGuideLabel">SIZE GUIDE</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="font-size: 2rem;">
                    &times;
                </button>
            </div>
            <div class="modal-body text-center">

                <p style="margin-bottom: 15px;">Pink Printed Sleeveless Cotton Kurta & Pants Set</p>


                <div class="btn-group mb-3" role="group" aria-label="Toggle Unit">
                    <a href="#tab_1" data-toggle="tab" class="btnToggle ">INCHES</a>
                    <a href="#tab_2" data-toggle="tab" class="btnToggle ">CM</a>

                </div>

                <div class="tab-content">
                    <div class="tab-pane active" id="tab_1">
                        <div class="table-responsive">
                            <table class="table table-bordered text-center" style="font-size: 15px;">
                                <thead style="background-color: #fcf2d9; font-weight: bold;">
                                    <tr>
                                        <th>SIZE</th>
                                        <th>CHEST</th>
                                        <th>WAIST</th>
                                        <th>SHOULDER</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style="background-color: #fef7e3;">
                                        <td>XS</td>
                                        <td>34</td>
                                        <td>32</td>
                                        <td>13.5</td>
                                    </tr>
                                    <tr style="background-color: #fef7e3;">
                                        <td>S</td>
                                        <td>36</td>
                                        <td>34</td>
                                        <td>14</td>
                                    </tr>
                                    <tr style="background-color: #fef7e3;">
                                        <td>M</td>
                                        <td>38</td>
                                        <td>36</td>
                                        <td>14.5</td>
                                    </tr>
                                    <tr style="background-color: #fef7e3;">
                                        <td>L</td>
                                        <td>40</td>
                                        <td>38</td>
                                        <td>15</td>
                                    </tr>
                                    <tr style="background-color: #fef7e3;">
                                        <td>XL</td>
                                        <td>42</td>
                                        <td>40</td>
                                        <td>15.5</td>
                                    </tr>
                                    <tr style="background-color: #fef7e3;">
                                        <td>XXL</td>
                                        <td>44</td>
                                        <td>42</td>
                                        <td>16</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>


                    <div class="tab-pane " id="tab_2">
                        <div class="table-responsive">
                            <table class="table table-bordered text-center" style="font-size: 15px;">
                                <thead style="background-color: #fcf2d9; font-weight: bold;">
                                    <tr>
                                        <th>SIZE</th>
                                        <th>CHEST</th>
                                        <th>WAIST</th>
                                        <th>SHOULDER</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style="background-color: #fef7e3;">
                                        <td>XS</td>
                                        <td>86.5</td>
                                        <td>81</td>
                                        <td>34</td>
                                    </tr>
                                    <tr style="background-color: #fef7e3;">
                                        <td>S</td>
                                        <td>91.5</td>
                                        <td>86.5</td>
                                        <td>35.5</td>
                                    </tr>
                                    <tr style="background-color: #fef7e3;">
                                        <td>M</td>
                                        <td>96.5</td>
                                        <td>91.5</td>
                                        <td>37</td>
                                    </tr>
                                    <tr style="background-color: #fef7e3;">
                                        <td>L</td>
                                        <td>101.5</td>
                                        <td>96.5</td>
                                        <td>38</td>
                                    </tr>
                                    <tr style="background-color: #fef7e3;">
                                        <td>XL</td>
                                        <td>106.5</td>
                                        <td>101.5</td>
                                        <td>39.5</td>
                                    </tr>
                                    <tr style="background-color: #fef7e3;">
                                        <td>XXL</td>
                                        <td>112</td>
                                        <td>106.5</td>
                                        <td>40.5</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.btnToggle {
    text-decoration: none;
    background-color: #fff;
    color: #000;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px 12px;
    margin-right: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btnToggle.active {
    background-color: #F574A8;
    color: #fff;
    border-color: #F574A8;
}
</style>




<?php require_once('footer.php'); ?>