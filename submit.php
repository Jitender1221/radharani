<?php
$host = "localhost";
$dbname = "u136990712_crm_gci";
$username = "u136990712_crm_gci";
$password = "Gcicrm@12345"; // Use your MySQL password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $gci = $_POST['gci_roll_no'];
        $neet = $_POST['neet_score'];
        $name = $_POST['name'];
        $fname = $_POST['fname'];
        $address = $_POST['address'];
        $air_score = $_POST['air_score'];
      
        // Range Validation
        if ($gci < 51200001 || $gci > 69799999 || $neet < -180 || $neet > 720) {
            header("Location: index.php?error=range");
            exit;
        }

        // Check if GCI ROLL NO already exists
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM applications WHERE gci_roll_no = ? AND neet_score = ?");
        $stmt->execute([$gci , $neet]);
        $count = $stmt->fetchColumn();

        if ($count > 0) {
            // Already submitted
            echo "GCI ROLL NO already exists.";
            header("Location: index.php?error=exists");
            exit;
        }

        // Insert new application
        $stmt = $pdo->prepare("INSERT INTO applications (gci_roll_no, neet_score, name, fname, address, air_score) VALUES (?, ?, ?)");
        $stmt->execute([$gci, $neet, $pass, $name, $fname, $address, $air_score]);

        header("Location: index.php?submitted=true");
        exit;
    }
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage();
}