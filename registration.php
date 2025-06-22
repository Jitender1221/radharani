<?php require_once('header.php'); ?>

<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'vendor/autoload.php'; 

$error_message = '';
$success_message = '';

$statement = $pdo->prepare("SELECT * FROM tbl_settings WHERE id=1");
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);
foreach ($result as $row) {
    $banner_registration = $row['banner_registration'];
}

if (isset($_POST['form1'])) {
    $valid = 1;

    // Basic Validation
    if (empty($_POST['cust_name'])) {
        $valid = 0;
        $error_message .= LANG_VALUE_123 . "<br>";
    }

    if (empty($_POST['cust_email'])) {
        $valid = 0;
        $error_message .= LANG_VALUE_131 . "<br>";
    } else {
        if (!filter_var($_POST['cust_email'], FILTER_VALIDATE_EMAIL)) {
            $valid = 0;
            $error_message .= LANG_VALUE_134 . "<br>";
        } else {
            $statement = $pdo->prepare("SELECT * FROM tbl_customer WHERE cust_email=?");
            $statement->execute([$_POST['cust_email']]);
            if ($statement->rowCount()) {
                $valid = 0;
                $error_message .= LANG_VALUE_147 . "<br>";
            }
        }
    }

    if (empty($_POST['cust_phone'])) $valid = 0;
    if (empty($_POST['cust_address'])) $valid = 0;
    if (empty($_POST['cust_country'])) $valid = 0;
    if (empty($_POST['cust_city'])) $valid = 0;
    if (empty($_POST['cust_state'])) $valid = 0;
    if (empty($_POST['cust_zip'])) $valid = 0;

    if (empty($_POST['cust_password']) || empty($_POST['cust_re_password'])) {
        $valid = 0;
        $error_message .= LANG_VALUE_138 . "<br>";
    } elseif ($_POST['cust_password'] !== $_POST['cust_re_password']) {
        $valid = 0;
        $error_message .= LANG_VALUE_139 . "<br>";
    }

    if ($valid == 1) {
        $token = md5(time());
        $cust_datetime = date('Y-m-d h:i:s');
        $cust_timestamp = time();

        $statement = $pdo->prepare("INSERT INTO tbl_customer (
            cust_name, cust_cname, cust_email, cust_phone,
            cust_country, cust_address, cust_city, cust_state, cust_zip,
            cust_b_name, cust_b_cname, cust_b_phone, cust_b_country, cust_b_address, cust_b_city, cust_b_state, cust_b_zip,
            cust_s_name, cust_s_cname, cust_s_phone, cust_s_country, cust_s_address, cust_s_city, cust_s_state, cust_s_zip,
            cust_password, cust_token, cust_datetime, cust_timestamp, cust_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ?, ?, ?, ?, 0)");

        $statement->execute([
            strip_tags($_POST['cust_name']),
            strip_tags($_POST['cust_cname']),
            strip_tags($_POST['cust_email']),
            strip_tags($_POST['cust_phone']),
            strip_tags($_POST['cust_country']),
            strip_tags($_POST['cust_address']),
            strip_tags($_POST['cust_city']),
            strip_tags($_POST['cust_state']),
            strip_tags($_POST['cust_zip']),
            md5($_POST['cust_password']),
            $token,
            $cust_datetime,
            $cust_timestamp
        ]);

        // Send verification email via PHPMailer
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'rao.jeetu74@gmail.com';     
            $mail->Password   = 'xhot ccqx nimk liyr'; // Use App Password
            $mail->SMTPSecure = 'tls';
            $mail->Port       = 587;

            $mail->setFrom('rao.jeetu74@gmail.com', 'Radharani Textiles');
            $mail->addAddress($_POST['cust_email']);

            $mail->isHTML(true);
            $mail->Subject = 'Email Verification';
            $verify_link = BASE_URL . 'http://localhost:8080/radarani/verify.php?email=' . urlencode($_POST['cust_email']) . '&token=' . $token;
            $mail->Body = "Click below to verify your email:<br><br><a href='$verify_link'>$verify_link</a>";

            $mail->send();
            $success_message = LANG_VALUE_152; // Verification email sent!
        } catch (Exception $e) {
            $error_message = "Email could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }

        unset($_POST);
    }
}
?>


<div class="page-banner" style="background-image: url(assets/uploads/<?php echo $banner_registration; ?>);">
    <div class="inner">
        <h1><?php echo LANG_VALUE_16; ?></h1>
    </div>
</div>

<div class="page">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="user-content">
                    <form action="" method="post">
                        <?php $csrf->echoInputField(); ?>
                        <div class="row">
                            <div class="col-md-2"></div>
                            <div class="col-md-8">

                                <?php if ($error_message): ?>
                                <div class="error" style="padding:10px; background:#fdd;">
                                    <?php echo $error_message; ?>
                                </div>
                                <?php endif; ?>
                                <?php if ($success_message): ?>
                                <div class="success" style="padding:10px; background:#dfd;">
                                    <?php echo $success_message; ?>
                                </div>
                                <?php endif; ?>

                                <!-- Registration Form Fields -->
                                <?php
                                function getInput($name) {
                                    return isset($_POST[$name]) ? htmlspecialchars($_POST[$name]) : '';
                                }
                                ?>
                                <div class="col-md-6 form-group">
                                    <label><?php echo LANG_VALUE_102; ?> *</label>
                                    <input type="text" class="form-control" name="cust_name"
                                        value="<?php echo getInput('cust_name'); ?>">
                                </div>
                                <div class="col-md-6 form-group">
                                    <label><?php echo LANG_VALUE_103; ?></label>
                                    <input type="text" class="form-control" name="cust_cname"
                                        value="<?php echo getInput('cust_cname'); ?>">
                                </div>
                                <div class="col-md-6 form-group">
                                    <label><?php echo LANG_VALUE_94; ?> *</label>
                                    <input type="email" class="form-control" name="cust_email"
                                        value="<?php echo getInput('cust_email'); ?>">
                                </div>
                                <div class="col-md-6 form-group">
                                    <label><?php echo LANG_VALUE_104; ?> *</label>
                                    <input type="text" class="form-control" name="cust_phone"
                                        value="<?php echo getInput('cust_phone'); ?>">
                                </div>
                                <div class="col-md-12 form-group">
                                    <label><?php echo LANG_VALUE_105; ?> *</label>
                                    <textarea class="form-control" name="cust_address"
                                        style="height:70px;"><?php echo getInput('cust_address'); ?></textarea>
                                </div>
                                <div class="col-md-6 form-group">
                                    <label><?php echo LANG_VALUE_106; ?> *</label>
                                    <select name="cust_country" class="form-control select2">
                                        <option value="">Select country</option>
                                        <?php
                                        $stmt = $pdo->prepare("SELECT * FROM tbl_country ORDER BY country_name ASC");
                                        $stmt->execute();
                                        $countries = $stmt->fetchAll(PDO::FETCH_ASSOC);
                                        foreach ($countries as $row):
                                            $selected = ($_POST['cust_country'] ?? '') == $row['country_id'] ? 'selected' : '';
                                        ?>
                                        <option value="<?php echo $row['country_id']; ?>" <?php echo $selected; ?>>
                                            <?php echo $row['country_name']; ?>
                                        </option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                                <div class="col-md-6 form-group">
                                    <label><?php echo LANG_VALUE_107; ?> *</label>
                                    <input type="text" class="form-control" name="cust_city"
                                        value="<?php echo getInput('cust_city'); ?>">
                                </div>
                                <div class="col-md-6 form-group">
                                    <label><?php echo LANG_VALUE_108; ?> *</label>
                                    <input type="text" class="form-control" name="cust_state"
                                        value="<?php echo getInput('cust_state'); ?>">
                                </div>
                                <div class="col-md-6 form-group">
                                    <label><?php echo LANG_VALUE_109; ?> *</label>
                                    <input type="text" class="form-control" name="cust_zip"
                                        value="<?php echo getInput('cust_zip'); ?>">
                                </div>
                                <div class="col-md-6 form-group">
                                    <label><?php echo LANG_VALUE_96; ?> *</label>
                                    <input type="password" class="form-control" name="cust_password">
                                </div>
                                <div class="col-md-6 form-group">
                                    <label><?php echo LANG_VALUE_98; ?> *</label>
                                    <input type="password" class="form-control" name="cust_re_password">
                                </div>
                                <div class="col-md-6 form-group">
                                    <input type="submit" class="btn btn-danger" name="form1"
                                        value="<?php echo LANG_VALUE_15; ?>">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once('footer.php'); ?>