<?php
$servername = "localhost";
$username = "root"; // Default XAMPP MySQL user
$password = ""; // Default XAMPP MySQL password (empty)
$dbname = "finance_tracker";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
