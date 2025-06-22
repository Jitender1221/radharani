<?php require_once('header.php'); ?>

<?php
// Check if the customer is logged in or not
if(!isset($_SESSION['customer'])) {
    header('location: '.BASE_URL.'logout.php');
    exit;
} else {
    // If customer is logged in, but admin make him inactive, then force logout this user.
    $statement = $pdo->prepare("SELECT * FROM tbl_customer WHERE cust_id=? AND cust_status=?");
    $statement->execute(array($_SESSION['customer']['cust_id'],0));
    $total = $statement->rowCount();
    $row = $statement->fetchAll(PDO::FETCH_ASSOC);

    if($total) {
        header('location: '.BASE_URL.'logout.php');
        exit;
    }
}
?>

<div class="page">
    <div class="container-customer">
        <div class="row">
            <div class="user-content">
                <h3 class="text-center">
                    <?php echo LANG_VALUE_90 . ' ' . $_SESSION['customer']['cust_name']; ?>
                </h3>
            </div>
        </div>
    </div>
</div>

<style>
.container-customer {
    margin-top: 30px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    flex-wrap: wrap;
    flex-direction: row;
}


.user-content {
    margin-top: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>

<?php require_once('footer.php'); ?>