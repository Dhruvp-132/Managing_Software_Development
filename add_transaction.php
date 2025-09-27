<?php
     error_reporting(E_ALL);
     ini_set('display_errors', 1);
header('Content-Type: application/json');
include 'config.php';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $date = $_POST['date'] ?? '';
    $type = $_POST['type'] ?? '';
    $category = $_POST['category'] ?? '';
    $amount = $_POST['amount'] ?? 0;
    $description = $_POST['description'] ?? '';
    if (empty($date) || empty($type) || empty($category) || $amount <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
        exit;
    }
    try {
        $stmt = $pdo->prepare("INSERT INTO transactions (date, type, category, amount, description) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$date, $type, $category, $amount, $description]);
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>