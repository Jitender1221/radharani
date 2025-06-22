<?php require_once('header.php'); ?>

<?php
$statement = $pdo->prepare("SELECT * FROM tbl_page WHERE id=1");
$statement->execute();
$result = $statement->fetchAll(PDO::FETCH_ASSOC);                            
foreach ($result as $row) {
   $shipping_title = $row['shipping_title'];
    $shipping_content = $row['shipping_content'];
  
}

$statement1 = $pdo->prepare("SELECT * FROM tbl_settings WHERE id=1");
$statement1->execute();
$results = $statement1->fetchAll(PDO::FETCH_ASSOC);                            
foreach ($results as $rows) {

    $policy_banner = $rows['policy_banner'];
}
?>

<div class="page-banner" style="background-image: url(assets/uploads/<?php echo $policy_banner; ?>);">
    <div class="inner">
        <h1><?php echo $shipping_title; ?></h1>
    </div>
</div>

<div class="page">
    <div class="container">
        <div class="row">
            <div class="col-md-12">

                <p>
                    <?php echo $shipping_content; ?>
                </p>

            </div>
        </div>
    </div>
</div>

<?php require_once('footer.php'); ?>