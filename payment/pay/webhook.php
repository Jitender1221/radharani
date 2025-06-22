<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $status = $_POST['status'];
    $order_id = $_POST['order_id'];
    $remark1 = $_POST['remark1'];

    if ($status === 'SUCCESS') {

        echo "Webhook received successfully";
    } else {

        http_response_code(400); 
        echo "Invalid status: " . $status;
    }

} else {
    http_response_code(400); 
    echo "Invalid request method";
}
?>