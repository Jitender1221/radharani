<?php require_once('header.php'); ?>

<?php
$statement = $pdo->prepare("SELECT * FROM tbl_settings WHERE id=1");
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);
foreach ($result as $row) {
    $banner_cart = $row['banner_cart'];
}
?>

<?php
$error_message = '';
if (isset($_POST['form1'])) {
    $statement = $pdo->prepare("SELECT p_id, p_qty FROM tbl_product");
    $statement->execute();
    $products = $statement->fetchAll(PDO::FETCH_KEY_PAIR); // [p_id => p_qty]

    $allow_update = 1;
    $error_message = '';

    foreach ($_POST['product_id'] as $index => $p_id) {
        $requested_qty = (int)$_POST['quantity'][$index];
        $product_name = $_POST['product_name'][$index];

        if (isset($products[$p_id])) {
            if ($products[$p_id] < $requested_qty) {
                $allow_update = 0;
                $error_message .= '"' . $requested_qty . '" items are not available for "' . $product_name . "\"\\n";
            } else {
                // Find original session key for the product and update quantity
                foreach ($_SESSION['cart_p_id'] as $key => $session_p_id) {
                    if ($session_p_id == $p_id) {
                        $_SESSION['cart_p_qty'][$key] = $requested_qty;
                        break;
                    }
                }
            }
        }
    }

    if ($allow_update == 0) {
        echo "<script>alert('$error_message');</script>";
    } else {
        echo "<script>alert('All Items Quantity Update is Successful!'); window.location.href = 'cart.php';</script>";
    }
}
?>
<link rel="stylesheet" href="./cart.css">
<div class="page-banner" style="background-image: url(assets/uploads/<?php echo $banner_cart; ?>)">
    <div class="overlay"></div>
    <div class="page-banner-inner">
        <h1><?php echo LANG_VALUE_18; ?></h1>
    </div>
</div>
<?php
require_once('admin/inc/config.php');
$result = $conn->query("SELECT * FROM tbl_page ORDER BY id DESC LIMIT 1");
$row = $result->num_rows > 0 ? $result->fetch_assoc() : null;
?>

<?php if ($row): ?>
<div class="offer-banner">
    <div class="offer-text">
        <?php echo htmlspecialchars($row['banner_text']); ?>
    </div>
</div>
<?php endif; ?>
<div class="page">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <?php if (!isset($_SESSION['cart_p_id'])): ?>
                <h2 class="text-center">Cart is Empty!!</h2><br>
                <h4 class="text-center">Add products to the cart in order to view it here.</h4>
                <?php else: ?>
                <form action="" method="post">
                    <?php $csrf->echoInputField(); ?>
                    <div class="cart table-responsive">
                        <table class="table table-hover table-bordered">
                            <tr>
                                <th>#</th>
                                <th><?php echo LANG_VALUE_8; ?></th>
                                <th><?php echo LANG_VALUE_47; ?></th>
                                <th><?php echo LANG_VALUE_157; ?></th>
                                <th><?php echo LANG_VALUE_158; ?></th>
                                <th><?php echo LANG_VALUE_159; ?></th>
                                <th><?php echo LANG_VALUE_55; ?></th>
                                <th class="text-right"><?php echo LANG_VALUE_82; ?></th>
                                <th class="text-center" style="width: 100px;"><?php echo LANG_VALUE_83; ?></th>
                            </tr>
                            <?php
                                $table_total_price = 0;
                                foreach ($_SESSION['cart_p_id'] as $key => $p_id):
                                    $i = $key;
                                    $photo = $_SESSION['cart_p_featured_photo'][$i];
                                    $name = $_SESSION['cart_p_name'][$i];
                                    $size = $_SESSION['cart_size_name'][$i];
                                    $color = $_SESSION['cart_color_name'][$i];
                                    $price = $_SESSION['cart_p_current_price'][$i];
                                    $qty = $_SESSION['cart_p_qty'][$i];
                                    $total = $price * $qty;
                                    $table_total_price += $total;
                                ?>
                            <tr>
                                <td><?php echo $i+1; ?></td>
                                <td> <a href="product.php?id=<?php echo $p_id; ?>" class="product-link"><img
                                            src="assets/uploads/<?php echo $photo; ?>" class="cart-img" alt=""></a></td>
                                <td>
                                    <?php
    $fullName = $_SESSION['cart_p_name'][$i];
    $shortName = mb_substr($fullName, 0, 10); 
    $needsToggle = mb_strlen($fullName) > 10;
    ?>
                                    <span class="product-name">
                                        <?php if ($needsToggle): ?>
                                        <span class="short-name"><?php echo htmlspecialchars($shortName); ?>...</span>
                                        <span class="full-name d-none"><?php echo htmlspecialchars($fullName); ?></span>
                                        <a href="javascript:void(0);" class="read-toggle"
                                            onclick="toggleReadMore(this)">...</a>
                                        <?php else: ?>
                                        <?php echo htmlspecialchars($fullName); ?>
                                        <?php endif; ?>
                                    </span></a>
                                </td>

                                <td><?php echo $size; ?></td>
                                <td>
                                    <div class="colorBox">

                                        <div class=" text-center ">
                                            <label style="cursor: pointer;">

                                                <div class="color-box"
                                                    style="width: 20px; height: 20px; background-color: <?php echo $color; ?>; border-radius: 50%; border: 1px solid #999; margin: auto;">

                                                </div>

                                            </label>
                                        </div>

                                    </div>
                                </td>
                                <td><?php echo LANG_VALUE_1 . $price; ?></td>
                                <td>
                                    <input type="hidden" name="product_id[]" value="<?php echo $p_id; ?>">
                                    <input type="hidden" name="product_name[]" value="<?php echo $name; ?>">

                                    <div class="quantity-wrapper" style="display: flex; align-items: center; gap: 5px;">
                                        <button type="button" class="qty-btn" onclick="changeQty(this, -1)">−</button>
                                        <input type="number" class="input-text qty text" step="1" min="1"
                                            name="quantity[]" value="<?php echo $qty; ?>" title="Qty"
                                            style="width: 60px; text-align: center;" readonly>
                                        <button type="button" class="qty-btn" onclick="changeQty(this, 1)">+</button>
                                    </div>
                                </td>

                                <td class="text-right"><?php echo LANG_VALUE_1 . $total; ?></td>
                                <td class="text-center">
                                    <a onclick="return confirmDelete();"
                                        href="cart-item-delete.php?id=<?php echo $p_id; ?>&size=<?php echo $_SESSION['cart_size_id'][$i]; ?>&color=<?php echo $_SESSION['cart_color_id'][$i]; ?>"
                                        class="trash"><i class="fa fa-trash" style="color:red;"></i></a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                            <tr>
                                <th colspan="7" class="total-text">Total</th>
                                <th class="total-amount"><?php echo LANG_VALUE_1 . $table_total_price; ?></th>
                                <th></th>
                            </tr>
                        </table>
                    </div>
                    <div class="cart-buttons">
                        <ul>
                            <li><input type="submit" value="<?php echo LANG_VALUE_20; ?>" class="btn btn-primary"
                                    name="form1"></li>
                            <li><a href="index.php" class="btn btn-primary"><?php echo LANG_VALUE_85; ?></a></li>
                            <li><a href="checkout.php" class="btn btn-primary"><?php echo LANG_VALUE_23; ?></a></li>
                        </ul>
                    </div>
                </form>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>
<style>
.d-none {
    display: none;
}

.read-toggle {
    display: inline-block;
    margin-left: 5px;
    color: #007bff;
    cursor: pointer;
    text-decoration: underline;
}

.cart-img {
    width: 50px !important;
}

.qty-btn {
    width: 30px;
    height: 30px;
    background-color: #007bff00;
    ;
    color: #000;
    border: none;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
}

.qty-btn:hover {
    background-color: #007bff00;
    ;
}
</style>

<script>
function changeQty(button, delta) {
    const input = button.parentElement.querySelector('input[name="quantity[]"]');
    let current = parseInt(input.value) || 1;
    current += delta;
    if (current < 1) current = 1;
    input.value = current;
}
</script>
<script>
function toggleReadMore(el) {
    const parent = el.closest('.product-name');
    const shortText = parent.querySelector('.short-name');
    const fullText = parent.querySelector('.full-name');

    if (shortText.classList.contains('d-none')) {
        shortText.classList.remove('d-none');
        fullText.classList.add('d-none');
        el.textContent = '...';
    } else {
        shortText.classList.add('d-none');
        fullText.classList.remove('d-none');
        el.textContent = 'Read less';
    }
}
</script>


<?php require_once('footer.php'); ?>