<?php

ini_set('error_reporting', E_ALL);


date_default_timezone_set('America/Los_Angeles');


$dbhost = 'localhost';


$dbname = 'if0_39203795_radarani';


$dbuser = 'if0_39203795';


$dbpass = 'v10NkpQBrO';


define("BASE_URL", "");


define("ADMIN_URL", BASE_URL . "admin" . "/");



$conn = mysqli_connect('localhost','root','','radharani') or die('');


try {
	$pdo = new PDO("mysql:host={$dbhost};dbname={$dbname}", $dbuser, $dbpass);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch( PDOException $exception ) {
	echo "Connection error :" . $exception->getMessage();
}


?>