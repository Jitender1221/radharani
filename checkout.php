<?php require_once('header.php'); ?>
<?php
$statement = $pdo->prepare("SELECT * FROM tbl_settings WHERE id=1");
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);                            
foreach ($result as $row) {
    $banner_checkout = $row['banner_checkout'];
}
?>
<?php
if(!isset($_SESSION['cart_p_id'])) {
    header('location: cart.php');
    exit;
}
?>
<div class="page-banner" style="background-image: url(assets/uploads/<?php echo $banner_checkout; ?>)">
    <div class="overlay"></div>
    <div class="page-banner-inner">
        <h1><?php echo LANG_VALUE_22; ?></h1>
    </div>
</div>
<div class="page">
    <div class="container">
        <div class="row">
            <div class="col-md-12">

                <?php if(!isset($_SESSION['customer'])): ?>
                <p>
                    <a href="login.php" class="btn btn-md btn-danger"><?php echo LANG_VALUE_160; ?></a>
                </p>
                <?php else: ?>

                <h3 class="special"><?php echo LANG_VALUE_26; ?></h3>
                <div class="cart table-responsive">
                    <table class="table  table-hover table-bordered">
                        <tr>
                            <th><?php echo '#' ?></th>
                            <th><?php echo LANG_VALUE_8; ?></th>
                            <th><?php echo LANG_VALUE_47; ?></th>
                            <th><?php echo LANG_VALUE_157; ?></th>
                            <th><?php echo LANG_VALUE_158; ?></th>
                            <th><?php echo LANG_VALUE_159; ?></th>
                            <th><?php echo LANG_VALUE_55; ?></th>
                            <th class="text-right"><?php echo LANG_VALUE_82; ?></th>
                        </tr>
                        <?php
                        $table_total_price = 0;

                        $i=0;
                        foreach($_SESSION['cart_p_id'] as $key => $value) 
                        {
                            $i++;
                            $arr_cart_p_id[$i] = $value;
                        }

                        $i=0;
                        foreach($_SESSION['cart_size_id'] as $key => $value) 
                        {
                            $i++;
                            $arr_cart_size_id[$i] = $value;
                        }

                        $i=0;
                        foreach($_SESSION['cart_size_name'] as $key => $value) 
                        {
                            $i++;
                            $arr_cart_size_name[$i] = $value;
                        }

                        $i=0;
                        foreach($_SESSION['cart_color_id'] as $key => $value) 
                        {
                            $i++;
                            $arr_cart_color_id[$i] = $value;
                        }

                        $i=0;
                        foreach($_SESSION['cart_color_name'] as $key => $value) 
                        {
                            $i++;
                            $arr_cart_color_name[$i] = $value;
                        }

                        $i=0;
                        foreach($_SESSION['cart_p_qty'] as $key => $value) 
                        {
                            $i++;
                            $arr_cart_p_qty[$i] = $value;
                        }

                        $i=0;
                        foreach($_SESSION['cart_p_current_price'] as $key => $value) 
                        {
                            $i++;
                            $arr_cart_p_current_price[$i] = $value;
                        }

                        $i=0;
                        foreach($_SESSION['cart_p_name'] as $key => $value) 
                        {
                            $i++;
                            $arr_cart_p_name[$i] = $value;
                        }

                        $i=0;
                        foreach($_SESSION['cart_p_featured_photo'] as $key => $value) 
                        {
                            $i++;
                            $arr_cart_p_featured_photo[$i] = $value;
                        }
                        ?>
                        <?php for($i=1;$i<=count($arr_cart_p_id);$i++): ?>
                        <tr>
                            <td><?php echo $i; ?></td>
                            <td>
                                <img src="assets/uploads/<?php echo $arr_cart_p_featured_photo[$i]; ?>" alt="">
                            </td>
                            <td><?php echo $arr_cart_p_name[$i]; ?></td>
                            <td><?php echo $arr_cart_size_name[$i]; ?></td>
                            <td><?php echo $arr_cart_color_name[$i]; ?></td>
                            <td><?php echo LANG_VALUE_1; ?><?php echo $arr_cart_p_current_price[$i]; ?></td>
                            <td><?php echo $arr_cart_p_qty[$i]; ?></td>
                            <td class="text-right">
                                <?php
                                $row_total_price = $arr_cart_p_current_price[$i]*$arr_cart_p_qty[$i];
                                $table_total_price = $table_total_price + $row_total_price;
                                ?>
                                <?php echo LANG_VALUE_1; ?><?php echo $row_total_price; ?>
                            </td>
                        </tr>
                        <?php endfor; ?>
                        <tr>
                            <th colspan="7" class="total-text"><?php echo LANG_VALUE_81; ?></th>
                            <th class="total-amount"><?php echo LANG_VALUE_1; ?><?php echo $table_total_price; ?></th>
                        </tr>
                        <?php
                        $statement = $pdo->prepare("SELECT * FROM tbl_shipping_cost WHERE country_id=?");
                        $statement->execute(array($_SESSION['customer']['cust_country']));
                        $total = $statement->rowCount();
                        if($total) {
                            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
                            foreach ($result as $row) {
                                $shipping_cost = $row['amount'];
                            }
                        } else {
                            $statement = $pdo->prepare("SELECT * FROM tbl_shipping_cost_all WHERE sca_id=1");
                            $statement->execute();
                            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
                            foreach ($result as $row) {
                                $shipping_cost = $row['amount'];
                            }
                        }                        
                        ?>
                        <tr>
                            <td colspan="7" class="total-text"><?php echo LANG_VALUE_84; ?></td>
                            <td class="total-amount"><?php echo LANG_VALUE_1; ?><?php echo $shipping_cost; ?></td>
                        </tr>
                        <tr>
                            <th colspan="7" class="total-text"><?php echo LANG_VALUE_82; ?></th>
                            <th class="total-amount">
                                <?php
                                $final_total = $table_total_price+$shipping_cost;
                                ?>
                                <?php echo LANG_VALUE_1; ?><?php echo $final_total; ?>
                            </th>
                        </tr>
                    </table>
                </div>
                <div class="billing-address">
                    <div class="row">
                        <div class="col-md-6">
                            <h3 class="special"><?php echo LANG_VALUE_161; ?></h3>
                            <table class="table table-responsive table-bordered table-hover table-striped bill-address">
                                <tr>
                                    <td><?php echo LANG_VALUE_102; ?></td>
                                    <td><?php echo $_SESSION['customer']['cust_b_name']; ?></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td><?php echo LANG_VALUE_103; ?></td>
                                    <td><?php echo $_SESSION['customer']['cust_b_cname']; ?></td>
                                </tr>
                                <tr>
                                    <td><?php echo LANG_VALUE_104; ?></td>
                                    <td><?php echo $_SESSION['customer']['cust_b_phone']; ?></td>
                                </tr>
                                <tr>
                                    <td><?php echo LANG_VALUE_106; ?></td>
                                    <td>
                                        <?php
                                        $statement = $pdo->prepare("SELECT * FROM tbl_country WHERE country_id=?");
                                        $statement->execute(array($_SESSION['customer']['cust_b_country']));
                                        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
                                        foreach ($result as $row) {
                                            echo $row['country_name'];
                                        }
                                        ?>
                                    </td>
                                </tr>
                                <tr>
                                    <td><?php echo LANG_VALUE_105; ?></td>
                                    <td>
                                        <?php echo nl2br($_SESSION['customer']['cust_b_address']); ?>
                                    </td>
                                </tr>
                                <tr>
                                    <td><?php echo LANG_VALUE_107; ?></td>
                                    <td><?php echo $_SESSION['customer']['cust_b_city']; ?></td>
                                </tr>
                                <tr>
                                    <td><?php echo LANG_VALUE_108; ?></td>
                                    <td><?php echo $_SESSION['customer']['cust_b_state']; ?></td>
                                </tr>
                                <tr>
                                    <td><?php echo LANG_VALUE_109; ?></td>
                                    <td><?php echo $_SESSION['customer']['cust_b_zip']; ?></td>
                                </tr>
                            </table>
                        </div>
                        <div class="col-md-6">
                            <h3 class="special"><?php echo LANG_VALUE_162; ?></h3>
                            <table class="table table-responsive table-bordered table-hover table-striped bill-address">
                                <tr>
                                    <td><?php echo LANG_VALUE_102; ?></td>
                                    <td><?php echo $_SESSION['customer']['cust_s_name']; ?></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td><?php echo LANG_VALUE_103; ?></td>
                                    <td><?php echo $_SESSION['customer']['cust_s_cname']; ?></td>
                                </tr>
                                <tr>
                                    <td><?php echo LANG_VALUE_104; ?></td>
                                    <td><?php echo $_SESSION['customer']['cust_s_phone']; ?></td>
                                </tr>
                                <tr>
                                    <td><?php echo LANG_VALUE_106; ?></td>
                                    <td>
                                        <?php
                                        $statement = $pdo->prepare("SELECT * FROM tbl_country WHERE country_id=?");
                                        $statement->execute(array($_SESSION['customer']['cust_s_country']));
                                        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
                                        foreach ($result as $row) {
                                            echo $row['country_name'];
                                        }
                                        ?>
                                    </td>
                                </tr>
                                <tr>
                                    <td><?php echo LANG_VALUE_105; ?></td>
                                    <td>
                                        <?php echo nl2br($_SESSION['customer']['cust_s_address']); ?>
                                    </td>
                                </tr>
                                <tr>
                                    <td><?php echo LANG_VALUE_107; ?></td>
                                    <td><?php echo $_SESSION['customer']['cust_s_city']; ?></td>
                                </tr>
                                <tr>
                                    <td><?php echo LANG_VALUE_108; ?></td>
                                    <td><?php echo $_SESSION['customer']['cust_s_state']; ?></td>
                                </tr>
                                <tr>
                                    <td><?php echo LANG_VALUE_109; ?></td>
                                    <td><?php echo $_SESSION['customer']['cust_s_zip']; ?></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="btnLast ">
                    <button type="button" onclick="document.location='cart.php'" class="cssbuttons-io-button2">
                        <?php echo LANG_VALUE_21; ?>
                    </button>
                    <button type="button" onclick="document.location='cart.php'" class="cssbuttons-io-button2">
                        <?php echo LANG_VALUE_46; ?>
                    </button>
                </div>
                <h3 class="special"><?php echo LANG_VALUE_33; ?></h3>
                <div class="row">
                    <?php
$checkout_access = 1;
$required_fields = [
    'cust_b_name', 'cust_b_cname', 'cust_b_phone', 'cust_b_country', 'cust_b_address', 'cust_b_city', 'cust_b_state', 'cust_b_zip',
    'cust_s_name', 'cust_s_cname', 'cust_s_phone', 'cust_s_country', 'cust_s_address', 'cust_s_city', 'cust_s_state', 'cust_s_zip'
];
foreach ($required_fields as $field) {
    if (empty($_SESSION['customer'][$field])) {
        $checkout_access = 0;
        break;
    }
}
?>
                    <?php if ($checkout_access == 0): ?>


                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Select Payment Method *</label>
                            <select class="form-control" id="paymentSelector">
                                <option value="">-- Select --</option>
                                <option value="paypal">PayPal</option>
                                <option value="bank">Bank Deposit</option>
                                <option value="razorpay">Razorpay</option>
                                <option value="stripe">Stripe</option>
                                <option value="upi">UPI</option>
                            </select>
                        </div>

                        <!-- PayPal -->
                        <form action="<?php echo BASE_URL; ?>payment/paypal/payment_process.php" method="post"
                            id="paypal_form" target="_blank" style="display:none;">
                            <input type="hidden" name="final_total" value="<?php echo $final_total; ?>">
                            <button type="submit" class="btn btn-primary" name="form1">Pay with PayPal</button>
                        </form>

                        <!-- Bank Deposit -->
                        <form action="payment/bank/init.php" method="post" id="bank_form" style="display:none;">
                            <input type="hidden" name="amount" value="<?php echo $final_total; ?>">
                            <div class="form-group">
                                <label>Bank Details:</label><br>
                                <?php
                                $stmt = $pdo->prepare("SELECT bank_detail FROM tbl_settings WHERE id=1");
                                $stmt->execute();
                                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                                echo nl2br($row['bank_detail']);
                                ?>
                            </div>
                            <div class="form-group">
                                <label>Transaction Info</label>
                                <textarea name="transaction_info" class="form-control" rows="4"
                                    placeholder="Enter transaction ID, UTR, etc."></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary" name="form3">Submit Payment Info</button>
                        </form>

                        <!-- Razorpay -->
                        <form action="payment/razorpay/checkout.php" method="post" id="razorpay_form"
                            style="display:none;">
                            <input type="hidden" name="amount" value="<?php echo $final_total * 100; ?>">
                            <!-- In paise -->
                            <button type="submit" class="btn btn-primary">Pay with Razorpay</button>
                        </form>

                        <!-- Stripe -->
                        <form action="payment/stripe/charge.php" method="post" id="stripe_form" style="display:none;">
                            <input type="hidden" name="amount" value="<?php echo $final_total * 100; ?>">
                            <div class="form-group">
                                <label>Card Details</label>
                                <input type="text" name="card_number" class="form-control" placeholder="Card Number">
                                <input type="text" name="expiry" class="form-control" placeholder="MM/YY">
                                <input type="text" name="cvc" class="form-control" placeholder="CVC">
                            </div>
                            <button type="submit" class="btn btn-primary">Pay with Stripe</button>
                        </form>

                        <!-- UPI -->
                        <!-- UPI -->
                        <form action="payment/upi/init.php" method="post" id="upi_form" style="display:none;">
                            <input type="hidden" name="amount" value="<?php echo $final_total; ?>">

                            <?php
      
        $upi_id = 'yourupi@bank'; 
        $name = 'Your Name';     
        $amount = number_format($final_total, 2, '.', '');

       
        $upi_qr_data = "upi://pay?pa={$upi_id}&pn=" . urlencode($name) . "&am={$amount}&cu=INR";

   
        $qr_url = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" . urlencode($upi_qr_data);
    ?>

                            <div class="form-group">
                                <label>Scan UPI QR or Send to UPI ID</label><br>
                                <img src="<?php echo $qr_url; ?>" alt="Dynamic UPI QR" style="max-width:250px;"><br>
                                <p><strong>UPI ID:</strong> <?php echo $upi_id; ?></p>

                                <label>Enter UPI Reference ID</label>
                                <input type="text" name="upi_ref" class="form-control"
                                    placeholder="Enter UPI Reference">
                            </div>

                            <button type="submit" class="btn btn-primary">Submit UPI Payment</button>
                        </form>

                        <?php else: ?>

                        <div class="col-md-12">
                            <div style="color:red;font-size:22px;margin-bottom:50px;">
                                Please complete billing and shipping details from your dashboard before placing an
                                order.
                                <a href="customer-billing-shipping-update.php"
                                    style="color:red;text-decoration:underline;">Update now</a>.
                            </div>
                        </div>
                        <?php endif; ?>
                    </div>
                    <?php endif; ?>

                </div>
            </div>
        </div>
    </div>
    <style>
    .btnLast {

        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        margin: auto;
    }

    .cssbuttons-io-button2 {
        background: #8A6A45;
        color: white;
        font-family: inherit;
        padding: 0.35em;
        padding-left: 2em;
        font-size: 17px;
        font-weight: 500;
        border-radius: 0.9em;
        border: none;
        letter-spacing: 0.05em;
        display: flex;
        align-items: center;
        box-shadow: inset 0 0 1.6em -0.6em #8A6A45;
        overflow: hidden;
        position: relative;
        height: 2.8em;
        padding-right: 2em;
        cursor: pointer;
        justify-content: end;
        display: flex;
        margin: 0 auto;
    }

    .cssbuttons-io-button:active .icon {
        transform: scale(0.95);
    }
    </style>
    <script>
    document.getElementById('paymentSelector').addEventListener('change', function() {
        const forms = ['paypal', 'bank', 'razorpay', 'stripe', 'upi'];
        forms.forEach(id => {
            document.getElementById(id + '_form').style.display = 'none';
        });
        const selected = this.value;
        if (selected && document.getElementById(selected + '_form')) {
            document.getElementById(selected + '_form').style.display = 'block';
        }
    });
    </script>
    <?php require_once('footer.php'); ?>