<?php

$api_url = 'https://test.nextgenscminc.com/api/create-order';

$data = array(
    'customer_mobile' => '9999999999',
    'user_token' => 'SPECIAL_USER_TOKEN_FOR_ADMIN',
    'amount' => '1',
    'order_id' => "TXN".uniqid(),   
    'redirect_url' => 'https://youtube.com/@techwithonkar/',
    'remark1' => 'REMARK1',
    'remark2' => 'REMARK2',
);

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data)); 

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo 'cURL error: ' . curl_error($ch);
} else {

    $result = json_decode($response, true);

    if ($result && isset($result['status'])) {
        if ($result['status'] === true) {

            echo 'Order Created Successfully<br>';
            echo 'Order ID: ' . $result['result']['orderId'] . '<br>';
            echo 'Payment URL: ' . $result['result']['payment_url'];
            header('Location:'.$result['result']['payment_url']);
        } else {

            echo 'Status: ' . $result['status'] . '<br>';
            echo 'Message: ' . $result['message'];
        }
    } else {

        echo 'Invalid API response';
    }
}

curl_close($ch);
?>