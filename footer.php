<?php
$statement = $pdo->prepare("SELECT * FROM tbl_settings WHERE id=1");
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);
foreach ($result as $row)
{
    $logo = $row['logo'];
	$footer_about = $row['footer_about'];
	$contact_email = $row['contact_email'];
	$contact_phone = $row['contact_phone'];
	$contact_address = $row['contact_address'];
	$footer_copyright = $row['footer_copyright'];
	$total_recent_post_footer = $row['total_recent_post_footer'];
    $total_popular_post_footer = $row['total_popular_post_footer'];
    $newsletter_on_off = $row['newsletter_on_off'];
    $before_body = $row['before_body'];
    $footer_privacy = $row['footer_privacy'];
    $footer_return = $row['footer_return'];
    $footer_shipping = $row['footer_shipping'];
    $footer_terms = $row['footer_terms'];
 
}
?>


<?php if($newsletter_on_off == 1): ?>

<footer class="site-footer">
    <div class="footer-top">
        <div class="footer-logo">
            <a href="index.php"> <img src="assets/uploads/<?php echo htmlspecialchars($logo); ?>"
                    alt="Radha Rani Textiles Logo" /></a>

        </div>
        <div class="footer-about">
            <h3>About Us</h3>
            <p><?= $footer_about ?> </p>
            <div class="social-icons">
                <a href="#"><img src="https://img.icons8.com/color/48/instagram-new--v1.png" alt="Instagram" /></a>
                <a href="#"><img src="https://img.icons8.com/color/48/facebook-new.png" alt="Facebook" /></a>
                <a href="#"><img src="https://img.icons8.com/color/48/youtube-play.png" alt="YouTube" /></a>
            </div>
        </div>
        <div class="footer-contact">
            <h3>Contact Us</h3>
            <p>Request For Call Back<br>
                <?= $contact_email ?><br>
                Customer Care :- <?= $contact_phone ?><br>
                <?= $contact_address ?></p>
        </div>
    </div>
    <hr>
    <div class="footer-bottom">
        <a href=" <?= $footer_privacy ?>">Privacy Policy</a>
        <a href=" <?= $footer_return ?>">Return Policy</a>
        <a href=" <?= $footer_shipping ?>">Shipping Policy</a>
        <a href=" <?= $footer_terms ?>">Terms and Service</a>
    </div>
</footer>



<!-- <section class="home-newsletter">
    <div class="container">
        <div class="row">
            <div class="col-md-6 col-md-offset-3">
                <div class="single">
                    <?php
			if(isset($_POST['form_subscribe']))
			{

				if(empty($_POST['email_subscribe'])) 
			    {
			        $valid = 0;
			        $error_message1 .= LANG_VALUE_131;
			    }
			    else
			    {
			    	if (filter_var($_POST['email_subscribe'], FILTER_VALIDATE_EMAIL) === false)
				    {
				        $valid = 0;
				        $error_message1 .= LANG_VALUE_134;
				    }
				    else
				    {
				    	$statement = $pdo->prepare("SELECT * FROM tbl_subscriber WHERE subs_email=?");
				    	$statement->execute(array($_POST['email_subscribe']));
				    	$total = $statement->rowCount();							
				    	if($total)
				    	{
				    		$valid = 0;
				        	$error_message1 .= LANG_VALUE_147;
				    	}
				    	else
				    	{
				  
				    		$key = md5(uniqid(rand(), true));

				    	
				    		$current_date = date('Y-m-d');

				    		
				    		$current_date_time = date('Y-m-d H:i:s');

				    	
				    		$statement = $pdo->prepare("INSERT INTO tbl_subscriber (subs_email,subs_date,subs_date_time,subs_hash,subs_active) VALUES (?,?,?,?,?)");
				    		$statement->execute(array($_POST['email_subscribe'],$current_date,$current_date_time,$key,0));

				    		
				    		$to = $_POST['email_subscribe'];
							$subject = 'Subscriber Email Confirmation';
							
						
							$verification_url = BASE_URL.'verify.php?email='.$to.'&key='.$key;

							$message = '
Thanks for your interest to subscribe our newsletter!<br><br>
Please click this link to confirm your subscription:
					'.$verification_url.'<br><br>
This link will be active only for 24 hours.
					';

							$headers = 'From: ' . $contact_email . "\r\n" .
								   'Reply-To: ' . $contact_email . "\r\n" .
								   'X-Mailer: PHP/' . phpversion() . "\r\n" . 
								   "MIME-Version: 1.0\r\n" . 
								   "Content-Type: text/html; charset=ISO-8859-1\r\n";

						
							mail($to, $subject, $message, $headers);

							$success_message1 = LANG_VALUE_136;
				    	}
				    }
			    }
			}
			if($error_message1 != '') {
				echo "<script>alert('".$error_message1."')</script>";
			}
			if($success_message1 != '') {
				echo "<script>alert('".$success_message1."')</script>";
			}
			?>
                    <form action="" method=" post">
            <?php $csrf->echoInputField(); ?>
            <h2><?php echo LANG_VALUE_93; ?></h2>
            <div class="input-group">
                <input type="email" class="form-control" placeholder="<?php echo LANG_VALUE_95; ?>"
                    name="email_subscribe">
                <span class="input-group-btn">
                    <button class="btn btn-theme" type="submit"
                        name="form_subscribe"><?php echo LANG_VALUE_92; ?></button>
                </span>
            </div>
    </div>
    </form>
    </div>
    </div>
    </div>
    </section> -->
<?php endif; ?>


<!-- 

<div class="footer-bottom">
    <div class="container">
        <div class="row">
            <div class="col-md-12 copyright">
                <?php if (!empty ($footer_copyright)) {?>

                <?php echo $footer_copyright; ?>
                <?php }?>
            </div>
        </div>
    </div>
</div> -->
<!-- <?php
$currency_name = '';
$result = $conn->query("SELECT * FROM tbl_currency");
if (!$result) {
    die("Error fetching currencies: " . $conn->error);
}

$flagImages = [
    'USD' => 'https://flagcdn.com/us.svg',
    'EUR' => 'https://flagcdn.com/eu.svg',
    'GBP' => 'https://flagcdn.com/gb.svg',
    'AUD' => 'https://flagcdn.com/au.svg',
    'CAD' => 'https://flagcdn.com/ca.svg',
    'JPY' => 'https://flagcdn.com/jp.svg',
    'CNY' => 'https://flagcdn.com/cn.svg',
    'INR' => 'https://flagcdn.com/in.svg',
];
?>


<div id="currencySwitcher">
    <select id="currencySelect" style="width: 102px;">
        <?php while ($row = $result->fetch_assoc()):
            $code = $row['currency_name'];
            $flag = isset($flagImages[$code]) ? $flagImages[$code] : '';
        ?>
        <option value="<?php echo $code; ?>" data-image="<?php echo $flag; ?>"
            <?php if ($code == $currency_name) echo 'selected'; ?>>
            <?php echo $code; ?>
        </option>
        <?php endwhile; ?>
    </select>
</div> -->

<!-- Include jQuery and Select2 CSS/JS -->
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<!-- jQuery (already included if not, use this) -->


<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

<style>
#currencySwitcher {
    position: fixed;
    bottom: 70px;
    left: 99px;
    z-index: 9999;
    background: white;
    padding: 8px 12px;
    border-radius: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    width: 126px;
}

#currencySelect {
    padding: 5px 10px;
    font-size: 16px;
}

.select2-container--default .select2-selection--single {
    height: 38px;
}

.select2-container--default .select2-selection--single .select2-selection__rendered img {
    vertical-align: middle;
    margin-right: 8px;
    height: 20px;
    width: 28px;
}

.select2-results__option img {
    vertical-align: middle;
    margin-right: 8px;
    height: 20px;
    width: 28px;
}
</style>

<script>
function formatCurrency(state) {
    if (!state.id) {
        return state.text;
    }
    var imgSrc = $(state.element).data('image');
    if (!imgSrc) {
        return state.text;
    }
    var $state = $(
        '<span><img src="' + imgSrc + '" class="img-flag" /> ' + state.text + '</span>'
    );
    return $state;
}

$(document).ready(function() {
    $('#currencySelect').select2({
        templateResult: formatCurrency,
        templateSelection: formatCurrency,
        minimumResultsForSearch: -1
    });
});
</script>


<!-- <?php foreach ($currencies as $curr): ?>
<img src="<?php echo $flagImages[$curr['currency_name']] ?? ''; ?>" alt="<?php echo $curr['currency_name']; ?>"
    style="width: 28px; height: 20px; vertical-align: middle; margin-right: 8px;">
<?php echo $curr['currency_name']; ?>
<?php endforeach; ?> -->



<a href="#" class="scrollup">
    <i class="fa fa-angle-up"></i>
</a>


<a href="#" id="whatsappShare2" class="whatsappShare2" target="_blank">
    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="Share on WhatsApp">
</a>

<style>
.whatsappShare2 {
    position: fixed;
    z-index: 99999;
    bottom: 70px;
    right: 20px;
    display: block;

}

.whatsappShare2 img {
    width: 70px;
    height: 70px;

    opacity: 1;
    transition: transform 0.3s ease, opacity 0.3s ease;
    transform: scale(1);
}

.whatsappShare2 img:hover {
    opacity: 1;
    transform: scale(1.2);
    /* Zoom-in effect */
}


.site-footer {
    background-color: #231f20;
    color: #fff;
    padding: 30px;
    font-family: 'Montserrat', sans-serif;
    border-radius: 12px 12px 0 0;
}

.footer-top {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    text-align: left;
    margin-bottom: 20px;
    align-items: center;
    padding: 10px;
    min-width: 80%;
    margin: auto;
}

.footer-logo img {
    max-width: 350px;
    border-radius: 8px;
    animation: glow 2s infinite alternate;
    transition: transform 0.3s ease-in-out;
}

@media (max-width: 568px) {

    .footer-logo img {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin: auto;
    }

    .footer-top {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .footer-bottom {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 20px;

    }


}


@keyframes glow {
    from {
        filter: drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px #FAF1D7) drop-shadow(0 0 15px #FAF1D7);
        transform: scale(0.9);
    }

    to {
        filter: drop-shadow(0 0 10px #fff) drop-shadow(0 0 20px #FAF1D7) drop-shadow(0 0 25px #FAF1D7);
        transform: scale(1);
    }
}


.footer-about,
.footer-contact {
    flex: 1;
    max-width: 550px;
    margin: 10px 20px;
}

.footer-about h3,
.footer-contact h3 {
    margin-bottom: 10px;
    color: #fff;
}

.footer-about p,
.footer-contact p {
    font-size: 14px;
    color: #ccc;
    line-height: 1.6;
}

.social-icons a img {
    width: 28px;
    height: 28px;
    margin-right: 10px;
    transition: transform 0.3s ease;
}

.social-icons a img:hover {
    transform: scale(1.2);
}

hr {
    border-top: 1px solid #999;
    margin: 20px 0;
}

.footer-bottom {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 80px;
}

.footer-bottom a {
    color: #b8b8b8;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s;
}

.footer-bottom a:hover {
    color: #fff;
}
</style>

<script>
// Set WhatsApp share link dynamically
document.addEventListener("DOMContentLoaded", function() {
    const shareBtn = document.getElementById("whatsappShare2");
    const shareText = "Check this out: " + window.location.href;
    shareBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
});
</script>


<?php
$statement = $pdo->prepare("SELECT * FROM tbl_settings WHERE id=1");
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);                            
foreach ($result as $row) {
    $stripe_public_key = $row['stripe_public_key'];
    $stripe_secret_key = $row['stripe_secret_key'];
}
?>

<script src="assets/js/jquery-2.2.4.min.js"></script>
<script src="assets/js/bootstrap.min.js"></script>
<script src="https://js.stripe.com/v2/"></script>
<script src="assets/js/megamenu.js"></script>
<script src="assets/js/owl.carousel.min.js"></script>
<script src="assets/js/owl.animate.js"></script>
<script src="assets/js/jquery.bxslider.min.js"></script>
<script src="assets/js/jquery.magnific-popup.min.js"></script>
<script src="assets/js/rating.js"></script>
<script src="assets/js/jquery.touchSwipe.min.js"></script>
<script src="assets/js/bootstrap-touch-slider.js"></script>
<script src="assets/js/select2.full.min.js"></script>
<script src="assets/js/custom.js"></script>
<script>
function confirmDelete() {
    return confirm("Sure you want to delete this data?");
}
$(document).ready(function() {
    advFieldsStatus = $('#advFieldsStatus').val();

    $('#paypal_form').hide();
    $('#stripe_form').hide();
    $('#bank_form').hide();

    $('#advFieldsStatus').on('change', function() {
        advFieldsStatus = $('#advFieldsStatus').val();
        if (advFieldsStatus == '') {
            $('#paypal_form').hide();
            $('#stripe_form').hide();
            $('#bank_form').hide();
        } else if (advFieldsStatus == 'PayPal') {
            $('#paypal_form').show();
            $('#stripe_form').hide();
            $('#bank_form').hide();
        } else if (advFieldsStatus == 'Stripe') {
            $('#paypal_form').hide();
            $('#stripe_form').show();
            $('#bank_form').hide();
        } else if (advFieldsStatus == 'Bank Deposit') {
            $('#paypal_form').hide();
            $('#stripe_form').hide();
            $('#bank_form').show();
        }
    });
});


$(document).on('submit', '#stripe_form', function() {
    // createToken returns immediately - the supplied callback submits the form if there are no errors
    $('#submit-button').prop("disabled", true);
    $("#msg-container").hide();
    Stripe.card.createToken({
        number: $('.card-number').val(),
        cvc: $('.card-cvc').val(),
        exp_month: $('.card-expiry-month').val(),
        exp_year: $('.card-expiry-year').val()
        // name: $('.card-holder-name').val()
    }, stripeResponseHandler);
    return false;
});
Stripe.setPublishableKey('<?php echo $stripe_public_key; ?>');

function stripeResponseHandler(status, response) {
    if (response.error) {
        $('#submit-button').prop("disabled", false);
        $("#msg-container").html(
            '<div style="color: red;border: 1px solid;margin: 10px 0px;padding: 5px;"><strong>Error:</strong> ' +
            response.error.message + '</div>');
        $("#msg-container").show();
    } else {
        var form$ = $("#stripe_form");
        var token = response['id'];
        form$.append("<input type='hidden' name='stripeToken' value='" + token + "' />");
        form$.get(0).submit();
    }
}
</script>

<?php if (!empty ($before_body)) {?>
<?php echo $before_body; ?>
<?php }?>
</body>

</html>