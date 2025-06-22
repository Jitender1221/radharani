<?php require_once('header.php'); ?>

<?php
// Ensure session and customer login
if (!isset($_SESSION['customer'])) {
    header('Location: ' . BASE_URL . 'logout.php');
    exit;
} else {
    // Logout if the customer is inactive
    $statement = $pdo->prepare("SELECT * FROM tbl_customer WHERE cust_id=? AND cust_status=?");
    $statement->execute([$_SESSION['customer']['cust_id'], 0]);
    if ($statement->rowCount()) {
        header('Location: ' . BASE_URL . 'logout.php');
        exit;
    }
}

$error_message = '';
$success_message = '';

// Handle form submission
if (isset($_POST['form1'])) {
    try {
        $statement = $pdo->prepare("UPDATE tbl_customer SET 
            cust_b_name=?, cust_b_cname=?, cust_b_phone=?, cust_b_country=?, cust_b_address=?, 
            cust_b_city=?, cust_b_state=?, cust_b_zip=?, cust_s_name=?, cust_s_cname=?, 
            cust_s_phone=?, cust_s_country=?, cust_s_address=?, cust_s_city=?, cust_s_state=?, 
            cust_s_zip=? WHERE cust_id=?");

        $statement->execute([
            strip_tags($_POST['cust_b_name']),
            strip_tags($_POST['cust_b_cname']),
            strip_tags($_POST['cust_b_phone']),
            strip_tags($_POST['cust_b_country']),
            strip_tags($_POST['cust_b_address']),
            strip_tags($_POST['cust_b_city']),
            strip_tags($_POST['cust_b_state']),
            strip_tags($_POST['cust_b_zip']),
            strip_tags($_POST['cust_s_name']),
            strip_tags($_POST['cust_s_cname']),
            strip_tags($_POST['cust_s_phone']),
            strip_tags($_POST['cust_s_country']),
            strip_tags($_POST['cust_s_address']),
            strip_tags($_POST['cust_s_city']),
            strip_tags($_POST['cust_s_state']),
            strip_tags($_POST['cust_s_zip']),
            $_SESSION['customer']['cust_id']
        ]);

        // Update session values
        foreach ($_POST as $key => $value) {
            if (strpos($key, 'cust_') === 0) {
                $_SESSION['customer'][$key] = strip_tags($value);
            }
        }

        $success_message = LANG_VALUE_122;
    } catch (Exception $e) {
        $error_message = 'Something went wrong. Please try again.';
    }
}
?>



<div class="page">
    <div class="container-customer">

        <div class="user-content">
            <?php if ($error_message): ?>
            <div class='error' style='padding: 10px; background:#f1f1f1; margin-bottom:20px;'>
                <?= $error_message ?></div>
            <?php endif; ?>
            <?php if ($success_message): ?>
            <div class='success' style='padding: 10px; background:#f1f1f1; margin-bottom:20px;'>
                <?= $success_message ?></div>
            <?php endif; ?>

            <form action="" method="post">
                <?php if (isset($csrf)) $csrf->echoInputField(); ?>

                <h4 class="mb-3">Contact</h4>
                <div class="mb-3">
                    <label for="cust_b_phone">Email or mobile phone number</label>
                    <input type="text" name="cust_b_phone" class="form-control"
                        value="<?= $_SESSION['customer']['cust_b_phone'] ?>" required>
                </div>

                <div class="form-check mb-4">
                    <input class="form-check-input" type="checkbox" id="offers" checked>
                    <label class="form-check-label" for="offers">Email me with news and offers</label>
                </div>

                <h4 class="mb-3">Delivery</h4>
                <div class="mb-3">
                    <label for="cust_b_country">Country/Region</label>
                    <select name="cust_b_country" class="form-select">
                        <?php
            $stmt = $pdo->prepare("SELECT * FROM tbl_country ORDER BY country_name ASC");
            $stmt->execute();
            foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
                $selected = $row['country_id'] == $_SESSION['customer']['cust_b_country'] ? 'selected' : '';
                echo "<option value='{$row['country_id']}' $selected>{$row['country_name']}</option>";
            }
            ?>
                    </select>
                </div>

                <div class="row g-3">
                    <div class="col-md-6">
                        <input type="text" name="cust_b_name" class="form-control" placeholder="First name (optional)"
                            value="<?= $_SESSION['customer']['cust_b_name'] ?>">
                    </div>
                    <div class="col-md-6">
                        <input type="text" name="cust_b_cname" class="form-control" placeholder="Last name"
                            value="<?= $_SESSION['customer']['cust_b_cname'] ?>">
                    </div>
                    <div class="col-12">
                        <input type="text" name="cust_s_cname" class="form-control" placeholder="Company (optional)"
                            value="<?= $_SESSION['customer']['cust_s_cname'] ?>">
                    </div>
                    <div class="col-12">
                        <input type="text" name="cust_b_address" class="form-control" placeholder="Address"
                            value="<?= $_SESSION['customer']['cust_b_address'] ?>">
                    </div>
                    <div class="col-12">
                        <input type="text" name="cust_b_address2" class="form-control"
                            placeholder="Apartment, suite, etc. (optional)">
                    </div>
                    <div class="col-md-4">
                        <input type="text" name="cust_b_city" class="form-control" placeholder="City"
                            value="<?= $_SESSION['customer']['cust_b_city'] ?>">
                    </div>
                    <div class="col-md-4">
                        <input type="text" name="cust_b_state" class="form-control" placeholder="State"
                            value="<?= $_SESSION['customer']['cust_b_state'] ?>">
                    </div>
                    <div class="col-md-4">
                        <input type="text" name="cust_b_zip" class="form-control" placeholder="PIN code"
                            value="<?= $_SESSION['customer']['cust_b_zip'] ?>">
                    </div>
                    <div class="col-12">
                        <input type="text" name="cust_s_phone" class="form-control" placeholder="Phone"
                            value="<?= $_SESSION['customer']['cust_s_phone'] ?>">
                    </div>
                </div>

                <div class="form-check mt-4">
                    <input class="form-check-input" type="checkbox" id="saveinfo" checked>
                    <label class="form-check-label" for="saveinfo">Save this information for next time</label>
                </div>

                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="textoffers" checked>
                    <label class="form-check-label" for="textoffers">Text me with news and offers</label>
                </div>

                <div class="mb-4">
                    <label>Mobile phone number</label>
                    <input type="text" class="form-control" placeholder="+91" value="">
                </div>

                <button type="submit" name="form1" class="btn btn-primary w-100"><?= LANG_VALUE_5; ?></button>
            </form>

        </div>


    </div>
</div>

<style>
.container-customer {
    max-width: 720px;
    margin: 40px auto;
    background: #fff;
    border-radius: 6px;
    padding: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-label {
    font-weight: 500;
}
</style>


<?php require_once('footer.php'); ?>