<?php

$url = "https://test.nextgenscminc.com/api/create-order";

$postData = array(
    "user_token" => "SPECIAL_USER_TOKEN_FOR_ADMIN",
    "order_id" => "PUT_YOUR_ORDER_ID_HERE"
);

$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo "cURL Error: " . curl_error($ch);
    exit;
}

curl_close($ch);

$responseData = json_decode($response, true);

if ($responseData["status"] === "COMPLETED") {

    $txnStatus = $responseData["result"]["txnStatus"];
    $orderId = $responseData["result"]["orderId"];
    $status = $responseData["result"]["status"];
    $amount = $responseData["result"]["amount"];
    $date = $responseData["result"]["date"];
    $utr = $responseData["result"]["utr"];

    echo "Transaction Status: $txnStatus<br>";
    echo "Order ID: $orderId<br>";
    echo "Status: $status<br>";
    echo "Amount: $amount<br>";
    echo "Date: $date<br>";
    echo "UTR: $utr<br>";
} else {

    $errorMessage = $responseData["message"];
    echo "API Error: $errorMessage";
}
?>